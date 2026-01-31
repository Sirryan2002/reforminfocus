import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import type { Article } from '@/types';

export default function ResearchPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/getArticles');
        if (!res.ok) throw new Error('Failed to fetch articles');

        const response = await res.json();
        // Filter for 'research' type articles
        const researchArticles = (response.data || []).filter(
          (article: Article) => article.article_type === 'research'
        );
        setArticles(researchArticles);
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
        <title>Research - Reform in Focus</title>
        <meta
          name="description"
          content="In-depth original research on Michigan K-12 education reform. Data-driven analysis and policy investigation."
        />
      </Head>
      <Navbar />

      <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1rem' }}>
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" }}>
            Research
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--neutral-600)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.7' }}>
            In-depth original research and data-driven analysis on Michigan education reform policy.
          </p>
        </header>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading research...</p>
          </div>
        )}

        {!loading && articles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--neutral-50)', borderRadius: '8px' }}>
            <p style={{ fontSize: '1.125rem', color: 'var(--neutral-600)' }}>
              Research publications coming soon! Check back later.
            </p>
          </div>
        )}

        {!loading && articles.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
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
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.75rem',
                          backgroundColor: 'var(--accent-green)',
                          color: 'var(--white)',
                          borderRadius: '4px',
                          marginBottom: '1rem',
                          textTransform: 'uppercase',
                          fontWeight: 'bold',
                        }}
                      >
                        Research
                      </span>
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
                        {article.published_at && <span>Published {formatDate(article.published_at)}</span>}
                        {article.read_time_minutes && (
                          <>
                            <span> • </span>
                            <span>{article.read_time_minutes} min read</span>
                          </>
                        )}
                      </div>
                      <p style={{ color: 'var(--neutral-700)', lineHeight: '1.7', marginBottom: '1rem' }}>
                        {article.excerpt}
                      </p>
                      <span style={{ color: 'var(--accent-green)', fontWeight: 'bold', fontSize: '0.875rem' }}>
                        Read research →
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
