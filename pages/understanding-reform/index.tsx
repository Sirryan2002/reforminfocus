import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import type { Article } from '@/types';

export default function UnderstandingReformPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/getArticles');
        if (!res.ok) throw new Error('Failed to fetch articles');

        const response = await res.json();
        // Filter for 'understanding' type articles
        const understandingArticles = (response.data || []).filter(
          (article: Article) => article.article_type === 'understanding'
        );
        setArticles(understandingArticles);
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

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
        <title>Understanding Reform - Reform in Focus</title>
        <meta
          name="description"
          content="Accessible guides to understanding Michigan K-12 education reform. Start here if you're new to reform policy."
        />
      </Head>
      <Navbar />

      <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1rem' }}>
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" }}>
            Understanding Reform
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--neutral-600)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.7' }}>
            Simple, accessible guides to help you understand Michigan&rsquo;s education reform landscape.
            Perfect for newcomers to reform policy.
          </p>
        </header>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading guides...</p>
          </div>
        )}

        {!loading && articles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--neutral-50)', borderRadius: '8px' }}>
            <p style={{ fontSize: '1.125rem', color: 'var(--neutral-600)' }}>
              Guides coming soon! Check back later.
            </p>
          </div>
        )}

        {!loading && articles.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {articles.map((article) => {
              const articleUrl = article.slug ? `/articles/${article.slug}` : `/article/${article.id}`;

              return (
                <article
                  key={article.id}
                  style={{
                    border: '1px solid var(--neutral-200)',
                    borderRadius: '8px',
                    padding: '2rem',
                    backgroundColor: 'var(--white)',
                  }}
                >
                  <Link href={articleUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div>
                      <h2
                        style={{
                          fontSize: '1.75rem',
                          marginBottom: '0.75rem',
                          fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
                        }}
                      >
                        {article.title}
                      </h2>
                      <div style={{ fontSize: '0.875rem', color: 'var(--neutral-500)', marginBottom: '1rem' }}>
                        {article.read_time_minutes && <span>{article.read_time_minutes} min read</span>}
                        {article.published_at && (
                          <>
                            <span> • </span>
                            <span>{formatDate(article.published_at)}</span>
                          </>
                        )}
                      </div>
                      <p style={{ color: 'var(--neutral-700)', lineHeight: '1.7', marginBottom: '1rem' }}>
                        {article.excerpt}
                      </p>
                      <span style={{ color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '0.875rem' }}>
                        Read guide →
                      </span>
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
