import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { withAuth } from '@/lib/withAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import type { Article } from '@/types';
import { supabase } from '@/lib/supabase';

function ArticlesListPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/admin/articles');
      if (!res.ok) throw new Error('Failed to fetch articles');

      const response = await res.json();
      setArticles(response.data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh list
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article');
    }
  };

  const handleTogglePublished = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ published: !currentStatus } as never)
        .eq('id', id);

      if (error) throw error;

      // Refresh list
      fetchArticles();
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Failed to update article');
    }
  };

  const filteredArticles = articles.filter(article => {
    if (filter === 'published' && !article.published) return false;
    if (filter === 'draft' && article.published) return false;
    if (typeFilter !== 'all' && article.article_type !== typeFilter) return false;
    return true;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <Head>
        <title>Articles - Admin - Reform in Focus</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminLayout title="Articles">
        {/* Actions Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Status Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'published' | 'draft')}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid var(--neutral-300)',
                borderRadius: '6px',
                backgroundColor: 'var(--white)',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Articles</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid var(--neutral-300)',
                borderRadius: '6px',
                backgroundColor: 'var(--white)',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Types</option>
              <option value="topic">Topic</option>
              <option value="research">Research</option>
              <option value="opinion">Opinion</option>
              <option value="understanding">Understanding</option>
            </select>
          </div>

          <Link
            href="/admin/articles/new"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--primary-blue)',
              color: 'var(--white)',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>➕</span> New Article
          </Link>
        </div>

        {/* Articles Count */}
        <div style={{ marginBottom: '1rem', color: 'var(--neutral-600)', fontSize: '0.875rem' }}>
          Showing {filteredArticles.length} of {articles.length} articles
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading articles...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && articles.length === 0 && (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            backgroundColor: 'var(--neutral-50)',
            borderRadius: '8px',
            border: '1px dashed var(--neutral-300)'
          }}>
            <p style={{ fontSize: '1.125rem', color: 'var(--neutral-600)', marginBottom: '1rem' }}>
              No articles yet
            </p>
            <Link
              href="/admin/articles/new"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--primary-blue)',
                color: 'var(--white)',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: '600',
                display: 'inline-block'
              }}
            >
              Create your first article
            </Link>
          </div>
        )}

        {/* Articles Table */}
        {!loading && filteredArticles.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.875rem'
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--neutral-200)' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Title</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Type</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Published</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr key={article.id} style={{ borderBottom: '1px solid var(--neutral-200)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                          {article.title}
                        </div>
                        {article.excerpt && (
                          <div style={{
                            color: 'var(--neutral-600)',
                            fontSize: '0.8rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '300px'
                          }}>
                            {article.excerpt}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor:
                          article.article_type === 'research' ? '#D1FAE5' :
                          article.article_type === 'understanding' ? '#DBEAFE' :
                          article.article_type === 'opinion' ? '#FEF3C7' :
                          '#F3F4F6',
                        color:
                          article.article_type === 'research' ? '#065F46' :
                          article.article_type === 'understanding' ? '#1E40AF' :
                          article.article_type === 'opinion' ? '#92400E' :
                          '#374151',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {article.article_type}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: article.published ? '#D1FAE5' : '#FEE2E2',
                        color: article.published ? '#065F46' : '#991B1B',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {article.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--neutral-600)' }}>
                      {formatDate(article.published_at)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => router.push(`/admin/articles/${article.id}/edit`)}
                          style={{
                            padding: '0.5rem 0.75rem',
                            backgroundColor: 'var(--white)',
                            border: '1px solid var(--neutral-300)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}
                          title="Edit"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleTogglePublished(article.id, article.published)}
                          style={{
                            padding: '0.5rem 0.75rem',
                            backgroundColor: 'var(--white)',
                            border: '1px solid var(--neutral-300)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}
                          title={article.published ? 'Unpublish' : 'Publish'}
                        >
                          {article.published ? '👁️' : '🚀'}
                        </button>
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
                          style={{
                            padding: '0.5rem 0.75rem',
                            backgroundColor: '#FEE2E2',
                            border: '1px solid #FCA5A5',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#991B1B'
                          }}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminLayout>
    </>
  );
}

export default withAuth(ArticlesListPage);
