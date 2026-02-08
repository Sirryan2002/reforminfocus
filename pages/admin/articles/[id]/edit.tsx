import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { withAuth } from '@/lib/withAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import TiptapEditor from '@/components/admin/TiptapEditor';
import AuthorSelector from '@/components/admin/AuthorSelector';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Article = Database['public']['Tables']['articles']['Row'];
type ArticleUpdate = Database['public']['Tables']['articles']['Update'];

function EditArticlePage() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    article_type: 'topic' as 'topic' | 'research' | 'opinion' | 'understanding',
    author_name: '',
    read_time_minutes: null as number | null,
    published: false,
    pinned: false,
    featured_image_url: null as string | null,
  });
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<number[]>([]);
  const [status, setStatus] = useState<'loading' | 'idle' | 'saving' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchArticle = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id as string)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          setStatus('error');
          setErrorMessage('Article not found');
          return;
        }

        const articleData = data as Article;
        setArticle(articleData);
        setFormData({
          title: articleData.title,
          slug: articleData.slug,
          excerpt: articleData.excerpt,
          content: articleData.content,
          article_type: articleData.article_type as typeof formData.article_type,
          author_name: articleData.author_name || '',
          read_time_minutes: articleData.read_time_minutes,
          published: articleData.published,
          pinned: articleData.pinned || false,
          featured_image_url: articleData.featured_image_url,
        });

        // Fetch existing authors for this article
        try {
          const { data: authorLinks } = await supabase
            .from('article_authors')
            .select('author_id, author_order')
            .eq('article_id', articleData.id)
            .order('author_order', { ascending: true });

          if (authorLinks && authorLinks.length > 0) {
            const authorIds = (authorLinks as Array<{ author_id: number; author_order: number }>)
              .map(link => link.author_id);
            setSelectedAuthorIds(authorIds);
          }
        } catch (authorErr) {
          // Authors table might not exist yet, continue without authors
          console.log('Authors not available:', authorErr);
        }

        setStatus('idle');
      } catch (error) {
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load article');
        console.error('Error loading article:', error);
      }
    };

    fetchArticle();
  }, [router.isReady, id]);

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      // Don't auto-update slug when editing existing article
    }));
  };

  const calculateReadTime = (content: string): number => {
    const text = content.replace(/<[^>]*>/g, ''); // Strip HTML
    const wordCount = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
  };

  const handleSubmit = async (e: React.FormEvent, shouldPublish: boolean) => {
    e.preventDefault();
    setStatus('saving');
    setErrorMessage('');

    try {
      // Validation
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.slug.trim()) {
        throw new Error('Slug is required');
      }
      if (!formData.excerpt.trim()) {
        throw new Error('Excerpt is required');
      }
      if (!formData.content.trim()) {
        throw new Error('Content is required');
      }

      // Calculate read time if not set
      const readTime = formData.read_time_minutes || calculateReadTime(formData.content);

      const articleData: ArticleUpdate = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content,
        article_type: formData.article_type,
        author_name: formData.author_name.trim() || null,
        read_time_minutes: readTime,
        published: shouldPublish,
        published_at: shouldPublish && !article?.published ? new Date().toISOString() : article?.published_at,
        pinned: formData.pinned,
        featured_image_url: formData.featured_image_url,
      };

      const { error } = await supabase
        .from('articles')
        .update(articleData as never)
        .eq('id', id as string);

      if (error) throw error;

      // Update author relationships
      try {
        // First, delete existing author relationships
        await supabase
          .from('article_authors')
          .delete()
          .eq('article_id', id as string);

        // Then insert new author relationships
        if (selectedAuthorIds.length > 0) {
          const authorRelations = selectedAuthorIds.map((authorId, index) => ({
            article_id: parseInt(id as string),
            author_id: authorId,
            author_order: index + 1
          }));

          const { error: authorError } = await supabase
            .from('article_authors')
            .insert(authorRelations as never);

          if (authorError) {
            console.error('Error saving authors:', authorError);
            // Don't fail the whole save if authors fail
          }
        }
      } catch (authorErr) {
        // Authors table might not exist yet, continue without saving authors
        console.log('Authors not available:', authorErr);
      }

      // Redirect to article list
      router.push('/admin/articles');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update article');
      console.error('Error updating article:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    setStatus('saving');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id as string);

      if (error) throw error;

      router.push('/admin/articles');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete article');
      console.error('Error deleting article:', error);
    }
  };

  if (status === 'loading') {
    return (
      <>
        <Head>
          <title>Loading Article - Admin - Reform in Focus</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <AdminLayout title="Edit Article">
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: '1.125rem', color: 'var(--neutral-600)' }}>
              Loading article...
            </div>
          </div>
        </AdminLayout>
      </>
    );
  }

  if (status === 'error' && !article) {
    return (
      <>
        <Head>
          <title>Error - Admin - Reform in Focus</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <AdminLayout title="Edit Article">
          <div style={{
            padding: '2rem',
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderRadius: '6px',
            color: '#991B1B',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>{errorMessage}</p>
            <button
              onClick={() => router.push('/admin/articles')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--primary-blue)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Back to Articles
            </button>
          </div>
        </AdminLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Article - Admin - Reform in Focus</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminLayout title="Edit Article">
        <form>
          {/* Title */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="title"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--neutral-800)'
              }}
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              placeholder="Enter article title"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1.25rem',
                fontWeight: '600',
                border: '1px solid var(--neutral-300)',
                borderRadius: '6px',
                fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
              }}
            />
          </div>

          {/* Slug */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="slug"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--neutral-800)'
              }}
            >
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              placeholder="article-url-slug"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '1px solid var(--neutral-300)',
                borderRadius: '6px',
                fontFamily: 'monospace'
              }}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--neutral-600)', marginTop: '0.25rem' }}>
              URL: /articles/{formData.slug || 'article-slug'}
            </div>
          </div>

          {/* Type and Settings Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* Article Type */}
            <div>
              <label
                htmlFor="article_type"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: 'var(--neutral-800)',
                  fontSize: '0.875rem'
                }}
              >
                Type *
              </label>
              <select
                id="article_type"
                value={formData.article_type}
                onChange={(e) => setFormData({ ...formData, article_type: e.target.value as typeof formData.article_type })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '1px solid var(--neutral-300)',
                  borderRadius: '6px',
                  backgroundColor: 'var(--white)',
                  cursor: 'pointer'
                }}
              >
                <option value="topic">Topic</option>
                <option value="research">Research</option>
                <option value="opinion">Opinion</option>
                <option value="understanding">Understanding</option>
              </select>
            </div>

            {/* Read Time */}
            <div>
              <label
                htmlFor="read_time"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: 'var(--neutral-800)',
                  fontSize: '0.875rem'
                }}
              >
                Read Time (min)
              </label>
              <input
                type="number"
                id="read_time"
                value={formData.read_time_minutes || ''}
                onChange={(e) => setFormData({ ...formData, read_time_minutes: e.target.value ? parseInt(e.target.value) : null })}
                placeholder="Auto"
                min="1"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '1px solid var(--neutral-300)',
                  borderRadius: '6px'
                }}
              />
            </div>
          </div>

          {/* Authors */}
          <div style={{ marginBottom: '1.5rem' }}>
            <AuthorSelector
              selectedAuthorIds={selectedAuthorIds}
              onChange={setSelectedAuthorIds}
              legacyAuthorName={formData.author_name}
              onLegacyAuthorNameChange={(name) => setFormData({ ...formData, author_name: name })}
            />
          </div>

          {/* Excerpt */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="featured_image_url"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--neutral-800)'
              }}
            >
              Excerpt *
            </label>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              required
              placeholder="Brief summary of the article (shown in article lists)"
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '1px solid var(--neutral-300)',
                borderRadius: '6px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>
          {/* featured image */}
          <div style={{ marginBottom: '1.5rem' }}>
          <label
              htmlFor="featured_image_url"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--neutral-800)'
              }}
            >
              Featured Image
            </label>
            <input
              type="text"
              id="featured_image_url"
              value={formData.featured_image_url || ''}
              onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
              placeholder="Featured image URL"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '1px solid var(--neutral-300)',
                  borderRadius: '6px'
                }}
            />
          </div>
          {/* Content Editor */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--neutral-800)'
              }}
            >
              Content *
            </label>
            <TiptapEditor
              content={formData.content}
              onChange={(html) => setFormData({ ...formData, content: html })}
            />
          </div>

          {/* Checkboxes */}
          <div style={{ marginBottom: '2rem', display: 'flex', gap: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.pinned}
                onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontWeight: '600' }}>Pin to homepage</span>
            </label>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              backgroundColor: '#FEE2E2',
              border: '1px solid #FCA5A5',
              borderRadius: '6px',
              color: '#991B1B'
            }}>
              {errorMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
            <div>
              <button
                type="button"
                onClick={handleDelete}
                disabled={status === 'saving'}
                style={{
                  padding: '0.875rem 1.5rem',
                  backgroundColor: '#DC2626',
                  color: 'var(--white)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: status === 'saving' ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                Delete
              </button>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => router.push('/admin/articles')}
                disabled={status === 'saving'}
                style={{
                  padding: '0.875rem 1.5rem',
                  backgroundColor: 'var(--white)',
                  color: 'var(--neutral-700)',
                  border: '1px solid var(--neutral-300)',
                  borderRadius: '6px',
                  cursor: status === 'saving' ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, false)}
                disabled={status === 'saving'}
                style={{
                  padding: '0.875rem 1.5rem',
                  backgroundColor: 'var(--neutral-700)',
                  color: 'var(--white)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: status === 'saving' ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                {status === 'saving' ? 'Saving...' : formData.published ? 'Unpublish' : 'Save as Draft'}
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={status === 'saving'}
                style={{
                  padding: '0.875rem 1.5rem',
                  backgroundColor: 'var(--primary-blue)',
                  color: 'var(--white)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: status === 'saving' ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                {status === 'saving' ? 'Saving...' : formData.published ? 'Update' : 'Publish'}
              </button>
            </div>
          </div>
        </form>
      </AdminLayout>
    </>
  );
}

export default withAuth(EditArticlePage);
