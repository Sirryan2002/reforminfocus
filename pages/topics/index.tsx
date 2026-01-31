import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import type { Cluster, Tag } from '@/types';

type ClusterWithTags = Cluster & {
  tags: Tag[];
  article_count?: number;
};

export default function TopicsPage() {
  const [clusters, setClusters] = useState<ClusterWithTags[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const res = await fetch('/api/clusters');
        if (!res.ok) {
          throw new Error('Failed to fetch clusters');
        }
        const response = await res.json();
        setClusters(response.data || []);
      } catch (err) {
        console.error('Error fetching clusters:', err);
        setError('Failed to load topics');
      } finally {
        setLoading(false);
      }
    };

    fetchClusters();
  }, []);

  return (
    <>
      <Head>
        <title>Explore Topics - Reform in Focus</title>
        <meta
          name="description"
          content="Explore K-12 education reform topics in Michigan including literacy, funding, teacher pipeline, and school choice"
        />
      </Head>
      <Navbar />

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Explore Topics</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--neutral-600)', maxWidth: '700px', margin: '0 auto' }}>
            Dive into Michigan K-12 education reform by topic. Each area connects related initiatives and shows where reform is headed.
          </p>
        </header>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading topics...</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', color: 'var(--accent-red)' }}>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
            }}
          >
            {clusters.map((cluster) => (
              <ClusterCard key={cluster.id} cluster={cluster} />
            ))}
          </div>
        )}

        {!loading && !error && clusters.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '1.125rem', color: 'var(--neutral-600)' }}>
              No topics available yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function ClusterCard({ cluster }: { cluster: ClusterWithTags }) {
  // Determine cluster color based on name
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
    <Link
      href={`/topics/${cluster.slug}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div
        style={{
          border: '1px solid var(--neutral-200)',
          borderRadius: '8px',
          padding: '2rem',
          backgroundColor: 'var(--white)',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = accentColor;
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--neutral-200)';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <div
            style={{
              width: '40px',
              height: '4px',
              backgroundColor: accentColor,
              marginBottom: '1rem',
              borderRadius: '2px',
            }}
          />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" }}>
            {cluster.name}
          </h2>
        </div>

        {cluster.description && (
          <p style={{ color: 'var(--neutral-600)', marginBottom: '1.5rem', lineHeight: '1.6', flex: '1' }}>
            {cluster.description}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--neutral-500)' }}>
            {cluster.article_count || 0} {cluster.article_count === 1 ? 'article' : 'articles'}
          </span>
          <span style={{ color: accentColor, fontSize: '0.875rem', fontWeight: 'bold' }}>
            Explore →
          </span>
        </div>

        {cluster.tags && cluster.tags.length > 0 && (
          <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {cluster.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: 'var(--neutral-100)',
                  color: 'var(--neutral-700)',
                  borderRadius: '4px',
                }}
              >
                {tag.name}
              </span>
            ))}
            {cluster.tags.length > 3 && (
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  color: 'var(--neutral-500)',
                }}
              >
                +{cluster.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
