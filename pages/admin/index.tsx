import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { withAuth } from '@/lib/withAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalSubscribers: 0,
    activeSubscribers: 0,
    unreadContacts: 0,
    totalTags: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch article stats
        const { count: totalArticles } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true });

        const { count: publishedArticles } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('published', true);

        const { count: draftArticles } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('published', false);

        // Fetch subscriber stats
        const { count: totalSubscribers } = await supabase
          .from('subscribers')
          .select('*', { count: 'exact', head: true });

        const { count: activeSubscribers } = await supabase
          .from('subscribers')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        // Fetch contact stats
        const { count: unreadContacts } = await supabase
          .from('contact_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false);

        // Fetch tag count
        const { count: totalTags } = await supabase
          .from('tags')
          .select('*', { count: 'exact', head: true });

        setStats({
          totalArticles: totalArticles || 0,
          publishedArticles: publishedArticles || 0,
          draftArticles: draftArticles || 0,
          totalSubscribers: totalSubscribers || 0,
          activeSubscribers: activeSubscribers || 0,
          unreadContacts: unreadContacts || 0,
          totalTags: totalTags || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, subtitle, icon, href }: {
    title: string;
    value: number | string;
    subtitle?: string;
    icon: string;
    href?: string;
  }) => {
    const card = (
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'var(--white)',
        border: '1px solid var(--neutral-200)',
        borderRadius: '8px',
        cursor: href ? 'pointer' : 'default',
        transition: 'border-color 0.2s, box-shadow 0.2s'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', marginBottom: '0.5rem' }}>
              {title}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--neutral-900)' }}>
              {value}
            </div>
            {subtitle && (
              <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', marginTop: '0.25rem' }}>
                {subtitle}
              </div>
            )}
          </div>
          <div style={{ fontSize: '2rem', opacity: 0.5 }}>
            {icon}
          </div>
        </div>
      </div>
    );

    if (href) {
      return <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>{card}</Link>;
    }

    return card;
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard - Reform in Focus</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminLayout title="Dashboard">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem'
            }}>
              <StatCard
                title="Total Articles"
                value={stats.totalArticles}
                subtitle={`${stats.publishedArticles} published, ${stats.draftArticles} drafts`}
                icon="📝"
                href="/admin/articles"
              />
              <StatCard
                title="Subscribers"
                value={stats.totalSubscribers}
                subtitle={`${stats.activeSubscribers} active`}
                icon="📧"
                href="/admin/subscribers"
              />
              <StatCard
                title="Unread Messages"
                value={stats.unreadContacts}
                subtitle="Contact submissions"
                icon="✉️"
                href="/admin/contacts"
              />
              <StatCard
                title="Tags"
                value={stats.totalTags}
                subtitle="Content tags"
                icon="🏷️"
                href="/admin/tags"
              />
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
              }}>
                Quick Actions
              </h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  href="/admin/articles/new"
                  style={{
                    padding: '0.875rem 1.5rem',
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
                <Link
                  href="/admin/tags"
                  style={{
                    padding: '0.875rem 1.5rem',
                    backgroundColor: 'var(--white)',
                    color: 'var(--neutral-700)',
                    border: '1px solid var(--neutral-300)',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>🏷️</span> Manage Tags
                </Link>
                <Link
                  href="/admin/contacts"
                  style={{
                    padding: '0.875rem 1.5rem',
                    backgroundColor: 'var(--white)',
                    color: 'var(--neutral-700)',
                    border: '1px solid var(--neutral-300)',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>✉️</span> View Messages
                </Link>
              </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
              }}>
                Recent Activity
              </h2>
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: 'var(--neutral-50)',
                borderRadius: '8px',
                border: '1px dashed var(--neutral-300)'
              }}>
                <p style={{ color: 'var(--neutral-600)' }}>
                  Activity feed coming soon
                </p>
              </div>
            </div>
          </>
        )}
      </AdminLayout>
    </>
  );
}

export default withAuth(AdminDashboard);
