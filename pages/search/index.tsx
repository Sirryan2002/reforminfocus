import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import SEOHead from '@/components/SEOHead';
import type { Article } from '@/types';

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (router.isReady && router.query.q) {
      const query = router.query.q as string;
      setSearchQuery(query);
      performSearch(query);
    }
  }, [router.isReady, router.query.q]);

  const performSearch = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setError('Please enter at least 2 characters');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to search');
      }

      const response = await res.json();
      setArticles(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search articles');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const pageTitle = router.query.q
    ? `Search results for "${router.query.q}"`
    : 'Search Articles';
  const pageDescription = router.query.q
    ? `Search results for "${router.query.q}" - Find Michigan K-12 education reform articles and analysis.`
    : 'Search Reform in Focus articles on Michigan K-12 education reform, policy initiatives, and analysis.';

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        canonical="/search"
        noindex={router.query.q ? true : false}
      />
      <Navbar />

      <main id="main-content" className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1rem' }}>
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" }}>
            Search Articles
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--neutral-600)', lineHeight: '1.7' }}>
            Search across titles, excerpts, and full article content
          </p>
        </header>

        {/* Search Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '3rem' }} role="search" aria-label="Article search">
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              style={{
                flex: 1,
                padding: '0.875rem 1rem',
                fontSize: '1rem',
                border: '1px solid var(--neutral-300)',
                borderRadius: '6px',
                fontFamily: 'inherit',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.875rem 2rem',
                fontSize: '1rem',
                backgroundColor: 'var(--primary-blue)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--accent-red)',
              color: 'var(--white)',
              borderRadius: '6px',
              marginBottom: '2rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Searching...</p>
          </div>
        )}

        {/* Results */}
        {!loading && hasSearched && (
          <>
            <div style={{ marginBottom: '2rem', color: 'var(--neutral-600)' }}>
              {articles.length === 0 ? (
                <p>No articles found for &quot;{router.query.q}&quot;</p>
              ) : (
                <p>
                  Found {articles.length} {articles.length === 1 ? 'article' : 'articles'} for &quot;{router.query.q}&quot;
                </p>
              )}
            </div>

            {articles.length > 0 && (
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
                          {article.article_type && (
                            <span
                              style={{
                                display: 'inline-block',
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.75rem',
                                backgroundColor:
                                  article.article_type === 'research'
                                    ? 'var(--accent-green)'
                                    : article.article_type === 'understanding'
                                    ? 'var(--primary-blue)'
                                    : 'var(--neutral-600)',
                                color: 'var(--white)',
                                borderRadius: '4px',
                                marginBottom: '1rem',
                                textTransform: 'uppercase',
                                fontWeight: 'bold',
                              }}
                            >
                              {article.article_type}
                            </span>
                          )}
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
                          <span style={{ color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '0.875rem' }}>
                            Read article →
                          </span>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* No Search Yet */}
        {!loading && !hasSearched && (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--neutral-50)', borderRadius: '8px' }}>
            <p style={{ fontSize: '1.125rem', color: 'var(--neutral-600)' }}>
              Enter a search term above to find articles
            </p>
          </div>
        )}
      </main>
    </>
  );
}
