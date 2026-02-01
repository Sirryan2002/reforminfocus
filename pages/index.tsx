import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import SEOHead from '@/components/SEOHead';
import type { Article, Tag } from '@/types';

type ArticleWithTags = Article & {
  tags?: Tag[];
};

export default function Home() {
  const [articles, setArticles] = useState<ArticleWithTags[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/getArticles');
        if (!res.ok) {
          throw new Error('Failed to fetch articles');
        }
        const response = await res.json();
        setArticles(response.data || []);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const pinnedArticle = articles.find(a => a.pinned);
  const regularArticles = articles.filter(a => !a.pinned);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Structured data for homepage
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Reform in Focus",
    "url": "https://blog.ryanlongo.net",
    "logo": "https://blog.ryanlongo.net/logo.png",
    "description": "Michigan K-12 Education Reform Analysis - Connecting policy initiatives to show how they relate and where they're heading long-term.",
    "foundingDate": "2024",
    "areaServed": {
      "@type": "State",
      "name": "Michigan"
    },
    "knowsAbout": ["K-12 Education", "Education Reform", "Education Policy", "Michigan Schools"]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Reform in Focus",
    "url": "https://blog.ryanlongo.net",
    "description": "Michigan K-12 Education Reform Analysis",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://blog.ryanlongo.net/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <SEOHead
        title="Reform in Focus - Michigan K-12 Education Reform"
        description="Exploring K-12 education reform across Michigan. Connecting policy initiatives to understand where reform is heading long-term. Analysis for parents, school boards, and educators."
        canonical="/"
        ogType="website"
      />

      {/* Structured Data */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <header
        role="banner"
        aria-label="Site hero"
        style={{
          backgroundColor: 'var(--neutral-900)',
          color: 'var(--white)',
          padding: '4rem 1rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1
            style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
            }}
          >
            Reform in Focus
          </h1>
          <p style={{ fontSize: '1.25rem', lineHeight: '1.7', color: 'var(--neutral-300)' }}>
            Exploring K-12 education reform across Michigan
          </p>
          <p style={{ fontSize: '1.125rem', marginTop: '1rem', color: 'var(--neutral-400)' }}>
            Connecting policy initiatives to show how they relate and where they&rsquo;re heading long-term
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1rem' }}>
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading articles...</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', color: 'var(--accent-red)' }}>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
            {/* Main Column */}
            <div>
              {/* Featured Article */}
              {pinnedArticle && (
                <section style={{ marginBottom: '3rem' }}>
                  <h2
                    style={{
                      fontSize: '1.5rem',
                      marginBottom: '1.5rem',
                      fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
                    }}
                  >
                    Featured
                  </h2>
                  <FeaturedArticleCard article={pinnedArticle} />
                </section>
              )}

              {/* Latest Articles */}
              <section>
                <h2
                  style={{
                    fontSize: '1.5rem',
                    marginBottom: '1.5rem',
                    fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
                  }}
                >
                  Latest Articles
                </h2>
                {regularArticles.length === 0 ? (
                  <p style={{ color: 'var(--neutral-600)' }}>No articles available yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {regularArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} formatDate={formatDate} />
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar */}
            <aside>
              {/* New to Reform CTA */}
              <div
                style={{
                  backgroundColor: 'var(--primary-blue)',
                  color: 'var(--white)',
                  padding: '2rem',
                  borderRadius: '8px',
                  marginBottom: '2rem',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.25rem',
                    marginBottom: '1rem',
                    fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
                  }}
                >
                  New to Reform?
                </h3>
                <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  Start with our explainer guides to understand Michigan&rsquo;s education reform landscape.
                </p>
                <Link
                  href="/understanding-reform"
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'var(--white)',
                    color: 'var(--primary-blue)',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                  }}
                >
                  Get Started
                </Link>
              </div>

              {/* Topics CTA */}
              <div
                style={{
                  border: '1px solid var(--neutral-200)',
                  padding: '2rem',
                  borderRadius: '8px',
                  marginBottom: '2rem',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.25rem',
                    marginBottom: '1rem',
                    fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
                  }}
                >
                  Explore by Topic
                </h3>
                <p style={{ color: 'var(--neutral-600)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  Browse articles organized by policy area.
                </p>
                <Link
                  href="/topics"
                  style={{
                    display: 'inline-block',
                    color: 'var(--primary-blue)',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  View Topics →
                </Link>
              </div>

              {/* Subscribe CTA */}
              <div
                style={{
                  backgroundColor: 'var(--neutral-100)',
                  padding: '2rem',
                  borderRadius: '8px',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.25rem',
                    marginBottom: '1rem',
                    fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
                  }}
                >
                  Stay Informed
                </h3>
                <p style={{ color: 'var(--neutral-600)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  Get weekly reform updates and analysis delivered to your inbox.
                </p>
                <Link
                  href="/subscribe"
                  style={{
                    display: 'inline-block',
                    color: 'var(--primary-blue)',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  Subscribe →
                </Link>
              </div>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}

function FeaturedArticleCard({ article }: { article: ArticleWithTags }) {
  const articleUrl = article.slug ? `/articles/${article.slug}` : `/article/${article.id}`;

  return (
    <Link href={articleUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          border: '2px solid var(--primary-blue)',
          borderRadius: '8px',
          padding: '2rem',
          backgroundColor: 'var(--white)',
          transition: 'all 0.2s ease',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            fontSize: '0.75rem',
            padding: '0.25rem 0.75rem',
            backgroundColor: 'var(--primary-blue)',
            color: 'var(--white)',
            borderRadius: '4px',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            fontWeight: 'bold',
          }}
        >
          Featured
        </span>
        <h3
          style={{
            fontSize: '2rem',
            marginBottom: '1rem',
            fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
          }}
        >
          {article.title}
        </h3>
        <p style={{ color: 'var(--neutral-700)', lineHeight: '1.7', fontSize: '1.125rem' }}>
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
}

function ArticleCard({
  article,
  formatDate,
}: {
  article: ArticleWithTags;
  formatDate: (date: string | null) => string;
}) {
  const articleUrl = article.slug ? `/articles/${article.slug}` : `/article/${article.id}`;

  return (
    <article
      style={{
        borderBottom: '1px solid var(--neutral-200)',
        paddingBottom: '1.5rem',
      }}
    >
      <Link href={articleUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div>
          {article.article_type && (
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.75rem',
                padding: '0.25rem 0.5rem',
                backgroundColor: 'var(--neutral-100)',
                color: 'var(--neutral-700)',
                borderRadius: '4px',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                fontWeight: 'bold',
              }}
            >
              {article.article_type}
            </span>
          )}
          <h3
            style={{
              fontSize: '1.5rem',
              marginBottom: '0.5rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
              color: 'var(--neutral-900)',
            }}
          >
            {article.title}
          </h3>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--neutral-500)', marginBottom: '0.75rem' }}>
            {article.published_at && <span>{formatDate(article.published_at)}</span>}
            {article.read_time_minutes && (
              <>
                <span>•</span>
                <span>{article.read_time_minutes} min read</span>
              </>
            )}
          </div>
          <p style={{ color: 'var(--neutral-700)', lineHeight: '1.6' }}>{article.excerpt}</p>
        </div>
      </Link>
    </article>
  );
}
