import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { withAuth } from '@/lib/withAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import TiptapEditor from '@/components/admin/TiptapEditor';
import ImageUploader from '@/components/admin/ImageUploader';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type ArticleInsert = Database['public']['Tables']['articles']['Insert'];

function NewArticlePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    article_type: 'topic' as 'topic' | 'research' | 'opinion' | 'understanding',
    author_name: '',
    read_time_minutes: null as number | null,
    featured_image_url: '',
    meta_description: '',
    published: false,
    pinned: false,
  });
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showImageGuidelines, setShowImageGuidelines] = useState(false);
  const [showSEOSection, setShowSEOSection] = useState(false);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug === '' ? generateSlug(title) : prev.slug
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

      const articleData: ArticleInsert = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content,
        article_type: formData.article_type,
        author_name: formData.author_name.trim() || null,
        read_time_minutes: readTime,
        featured_image_url: formData.featured_image_url.trim() || null,
        // Note: meta_description field can be added later if needed in database
        published: shouldPublish,
        published_at: shouldPublish ? new Date().toISOString() : null,
        pinned: formData.pinned,
      };

      const { error } = await supabase
        .from('articles')
        .insert(articleData as never)
        .select()
        .single();

      if (error) throw error;

      // Redirect to article list or edit page
      router.push('/admin/articles');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save article');
      console.error('Error saving article:', error);
    }
  };

  return (
    <>
      <Head>
        <title>New Article - Admin - Reform in Focus</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminLayout title="New Article">
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
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

            {/* Author */}
            <div>
              <label
                htmlFor="author_name"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: 'var(--neutral-800)',
                  fontSize: '0.875rem'
                }}
              >
                Author
              </label>
              <input
                type="text"
                id="author_name"
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                placeholder="Author name"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '1px solid var(--neutral-300)',
                  borderRadius: '6px'
                }}
              />
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

          {/* Excerpt */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="excerpt"
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

          {/* Featured Image Section */}
          <div style={{ marginBottom: '1.5rem', border: '1px solid var(--neutral-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--neutral-50)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <label style={{ fontWeight: '600', color: 'var(--neutral-800)', fontSize: '1.125rem' }}>
                Featured Image
              </label>
              <button
                type="button"
                onClick={() => setShowImageGuidelines(!showImageGuidelines)}
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--primary-blue)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {showImageGuidelines ? 'Hide' : 'Show'} Guidelines
              </button>
            </div>

            {showImageGuidelines && (
              <div style={{
                marginBottom: '1rem',
                padding: '1rem',
                backgroundColor: '#FEF3C7',
                borderRadius: '6px',
                fontSize: '0.875rem',
                lineHeight: '1.6'
              }}>
                <p style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#92400E' }}>📸 Image Optimization Guidelines</p>
                <ul style={{ marginLeft: '1.25rem', color: '#78350F' }}>
                  <li><strong>Size:</strong> 1200x630px for featured/OG images, max 800px wide for inline images</li>
                  <li><strong>Format:</strong> Use WebP (70% smaller) or JPEG. Avoid large PNGs unless transparency needed</li>
                  <li><strong>File Size:</strong> Target under 200KB per image (5MB Supabase limit, 1GB total free tier)</li>
                  <li><strong>Compression Tools:</strong>
                    <a href="https://tinypng.com" target="_blank" rel="noopener" style={{ color: '#92400E', marginLeft: '0.25rem' }}>TinyPNG</a> •
                    <a href="https://squoosh.app" target="_blank" rel="noopener" style={{ color: '#92400E', marginLeft: '0.25rem' }}>Squoosh</a> •
                    <a href="https://imageoptim.com" target="_blank" rel="noopener" style={{ color: '#92400E', marginLeft: '0.25rem' }}>ImageOptim</a>
                  </li>
                  <li><strong>SEO:</strong> Featured images appear in social shares (Facebook, Twitter, LinkedIn)</li>
                  <li><strong>Performance:</strong> Compressed images = faster load times = better Core Web Vitals</li>
                </ul>
              </div>
            )}

            <ImageUploader
              onUploadComplete={(url) => setFormData({ ...formData, featured_image_url: url })}
              bucket="article-images"
              maxSizeMB={5}
              buttonText="Upload Featured Image"
            />

            <div style={{ marginTop: '1rem' }}>
              <label htmlFor="featured_image_url" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
                Image URL (or paste external URL)
              </label>
              <input
                type="url"
                id="featured_image_url"
                value={formData.featured_image_url}
                onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                placeholder="https://..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  border: '1px solid var(--neutral-300)',
                  borderRadius: '6px',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            {formData.featured_image_url && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Preview:</p>
                <img
                  src={formData.featured_image_url}
                  alt="Featured image preview"
                  style={{
                    maxWidth: '400px',
                    maxHeight: '300px',
                    borderRadius: '6px',
                    border: '1px solid var(--neutral-300)'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* SEO Section */}
          <div style={{ marginBottom: '1.5rem', border: '1px solid var(--neutral-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--neutral-50)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <label style={{ fontWeight: '600', color: 'var(--neutral-800)', fontSize: '1.125rem' }}>
                SEO & Social Sharing
              </label>
              <button
                type="button"
                onClick={() => setShowSEOSection(!showSEOSection)}
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--primary-blue)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {showSEOSection ? 'Collapse' : 'Expand'}
              </button>
            </div>

            {showSEOSection && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="meta_description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
                    Meta Description (appears in Google search results)
                  </label>
                  <textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    placeholder="Brief description for search engines (150-160 characters recommended)"
                    rows={2}
                    maxLength={160}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '0.875rem',
                      border: '1px solid var(--neutral-300)',
                      borderRadius: '6px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', marginTop: '0.25rem' }}>
                    {formData.meta_description.length}/160 characters
                    {!formData.meta_description && ' (will use excerpt if empty)'}
                  </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: '#DBEAFE', borderRadius: '6px', fontSize: '0.875rem' }}>
                  <p style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#1E40AF' }}>🔍 SEO Tips</p>
                  <ul style={{ marginLeft: '1.25rem', color: '#1E3A8A', lineHeight: '1.6' }}>
                    <li>Title should be under 60 characters for Google</li>
                    <li>Meta description should be 150-160 characters</li>
                    <li>Featured image becomes the Open Graph image for social sharing</li>
                    <li>Slug should be descriptive and include keywords</li>
                  </ul>
                </div>
              </>
            )}
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
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
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
              {status === 'saving' ? 'Saving...' : 'Save as Draft'}
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
              {status === 'saving' ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </form>
      </AdminLayout>
    </>
  );
}

export default withAuth(NewArticlePage);
