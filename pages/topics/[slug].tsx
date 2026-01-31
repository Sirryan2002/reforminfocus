import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import type { Article, Cluster, Tag } from '@/types';

type ArticleWithTags = Article & {
  tags: Tag[];
};

type ClusterWithArticles = Cluster & {
  articles: ArticleWithTags[];
};

export default function ClusterPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [cluster, setCluster] = useState<ClusterWithArticles | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady || !slug) return;

    const fetchCluster = async () => {
      try {
        const res = await fetch(`/api/topics/${slug}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('Topic not found');
          } else {
            throw new Error('Failed to fetch topic');
          }
          return;
        }
        const response = await res.json();
        setCluster(response.data);
      } catch (err) {
        console.error('Error fetching cluster:', err);
        setError('Failed to load topic');
      } finally {
        setLoading(false);
      }
    };

    fetchCluster();
  }, [router.isReady, slug]);

  if (!router.isReady || loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading topic...</p>
        </div>
      </>
    );
  }

  if (error || !cluster) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem', textAlign: 'center' }}>
          <h1>{error || 'Topic not found'}</h1>
          <Link href="/topics" style={{ color: 'var(--primary-blue)', textDecoration: 'underline' }}>
            ← Back to Topics
          </Link>
        </div>
      </>
    );
  }

  // Determine cluster color
  const getClusterColor = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('literacy') || lowerName.includes('reading')) {
      return 'var(--neutral-900)';
    } else if (lowerName.includes('funding') || lowerName.includes('finance')) {
      return 'var(--accent-green)';
    } else if (lowerName.includes('teacher') || lowerName.includes('pipeline')) {
      return 'var(--accent-orange)';
    }
    return 'var(--neutral-900)';
  };

  const accentColor = getClusterColor(cluster.name);

  return (
    <>
      <Head>
        <title>{cluster.name} - Reform in Focus</title>
        <meta
          name="description"
          content={cluster.description || `Explore articles about ${cluster.name} in Michigan K-12 education`}
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
          <span>{cluster.name}</span>
        </div>

        {/* Cluster Header */}
        <header style={{ marginBottom: '3rem' }}>
          <div
            style={{
              width: '60px',
              height: '4px',
              backgroundColor: accentColor,
              marginBottom: '1rem',
              borderRadius: '2px',
            }}
          />
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" }}>
            {cluster.name}
          </h1>
          {cluster.description && (
            <p style={{ fontSize: '1.125rem', color: 'var(--neutral-600)', lineHeight: '1.7' }}>
              {cluster.description}
            </p>
          )}
          <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--neutral-500)' }}>
            {cluster.articles.length} {cluster.articles.length === 1 ? 'article' : 'articles'}
          </div>
        </header>

        {/* Articles List */}
        {cluster.articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--neutral-50)', borderRadius: '8px' }}>
            <p style={{ fontSize: '1.125rem', color: 'var(--neutral-600)' }}>
              No articles in this topic yet. Check back soon!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {cluster.articles.map((article) => (
              <ArticleCard key={article.id} article={article} accentColor={accentColor} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function ArticleCard({ article, accentColor }: { article: ArticleWithTags; accentColor: string }) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Use slug if available, otherwise fall back to id
  const articleUrl = article.slug ? `/articles/${article.slug}` : `/article/${article.id}`;

  return (
    <article
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
              {article.tags.map((tag) => (
                <span
                  key={tag.id}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: tag.color || 'var(--neutral-100)',
                    color: tag.color ? 'var(--white)' : 'var(--neutral-700)',
                    borderRadius: '4px',
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div style={{ marginTop: '1rem' }}>
            <span style={{ color: accentColor, fontSize: '0.875rem', fontWeight: 'bold' }}>
              Read more →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
