import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import type { Article, Tag } from '@/types';

type ArticleWithTags = Article & {
  tags: Tag[];
};

type TagWithArticles = Tag & {
  articles: ArticleWithTags[];
};

export default function TagPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [tag, setTag] = useState<TagWithArticles | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady || !slug) return;

    const fetchTag = async () => {
      try {
        const res = await fetch(`/api/tags/${slug}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('Tag not found');
          } else {
            throw new Error('Failed to fetch tag');
          }
          return;
        }
        const response = await res.json();
        setTag(response.data);
      } catch (err) {
        console.error('Error fetching tag:', err);
        setError('Failed to load tag');
      } finally {
        setLoading(false);
      }
    };

    fetchTag();
  }, [router.isReady, slug]);

  if (!router.isReady || loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tag...</p>
        </div>
      </>
    );
  }

  if (error || !tag) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem', textAlign: 'center' }}>
          <h1>{error || 'Tag not found'}</h1>
          <Link href="/topics" style={{ color: 'var(--primary-blue)', textDecoration: 'underline' }}>
            ← Back to Topics
          </Link>
        </div>
      </>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Head>
        <title>{tag.name} - Reform in Focus</title>
        <meta
          name="description"
          content={tag.description || `Articles about ${tag.name} in Michigan K-12 education reform`}
        />
      </Head>
      <Navbar />

      <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '2rem', fontSize: '0.875rem', color: 'var(--neutral-500)' }}>
          <Link href="/topics" style={{ color: 'var(--primary-blue)', textDecoration: 'none' }}>
            Topics
          </Link>
          {' '}/{' '}
          <span>{tag.name}</span>
        </div>

        {/* Tag Header */}
        <header style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                backgroundColor: tag.color || 'var(--neutral-900)',
                color: 'var(--white)',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            >
              {tag.name}
            </span>
          </div>
          {tag.description && (
            <p style={{ fontSize: '1.125rem', color: 'var(--neutral-600)', lineHeight: '1.7', marginBottom: '1rem' }}>
              {tag.description}
            </p>
          )}
          <div style={{ fontSize: '0.875rem', color: 'var(--neutral-500)' }}>
            {tag.articles.length} {tag.articles.length === 1 ? 'article' : 'articles'}
          </div>
        </header>

        {/* Articles List */}
        {tag.articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--neutral-50)', borderRadius: '8px' }}>
            <p style={{ fontSize: '1.125rem', color: 'var(--neutral-600)' }}>
              No articles with this tag yet. Check back soon!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {tag.articles.map((article) => {
              const articleUrl = article.slug ? `/articles/${article.slug}` : `/article/${article.id}`;

              return (
                <article
                  key={article.id}
                  style={{
                    border: '1px solid var(--neutral-200)',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    backgroundColor: 'var(--white)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Link
                    href={articleUrl}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <div>
                      {/* Article Type Badge */}
                      {article.article_type && (
                        <span
                          style={{
                            display: 'inline-block',
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.5rem',
                            backgroundColor: 'var(--neutral-100)',
                            color: 'var(--neutral-700)',
                            borderRadius: '4px',
                            marginBottom: '0.75rem',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                          }}
                        >
                          {article.article_type}
                        </span>
                      )}

                      <h2
                        style={{
                          fontSize: '1.5rem',
                          marginBottom: '0.5rem',
                          fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
                          color: 'var(--neutral-900)',
                        }}
                      >
                        {article.title}
                      </h2>

                      {/* Meta information */}
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--neutral-500)', marginBottom: '1rem' }}>
                        {article.published_at && <span>{formatDate(article.published_at)}</span>}
                        {article.read_time_minutes && (
                          <>
                            <span>•</span>
                            <span>{article.read_time_minutes} min read</span>
                          </>
                        )}
                      </div>

                      {/* Excerpt */}
                      <p style={{ color: 'var(--neutral-700)', lineHeight: '1.6', marginBottom: '1rem' }}>
                        {article.excerpt}
                      </p>

                      {/* Tags */}
                      {article.tags && article.tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                          {article.tags.map((t) => (
                            <span
                              key={t.id}
                              style={{
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.5rem',
                                backgroundColor: t.color || 'var(--neutral-100)',
                                color: t.color ? 'var(--white)' : 'var(--neutral-700)',
                                borderRadius: '4px',
                              }}
                            >
                              {t.name}
                            </span>
                          ))}
                        </div>
                      )}

                      <div style={{ marginTop: '1rem' }}>
                        <span style={{ color: 'var(--primary-blue)', fontSize: '0.875rem', fontWeight: 'bold' }}>
                          Read more →
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
