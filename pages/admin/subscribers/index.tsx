import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { withAuth } from '@/lib/withAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Subscriber = Database['public']['Tables']['subscribers']['Row'];

function SubscribersPage() {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<'loading' | 'idle' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, [filter]);

  const fetchSubscribers = async () => {
    try {
      setStatus('loading');
      let query = supabase
        .from('subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (filter === 'active') {
        query = query.eq('is_active', true);
      } else if (filter === 'inactive') {
        query = query.eq('is_active', false);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSubscribers(data || []);
      setStatus('idle');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load subscribers');
      console.error('Error loading subscribers:', error);
    }
  };

  const handleToggleStatus = async (subscriber: Subscriber) => {
    try {
      const { error } = await supabase
        .from('subscribers')
        .update({ is_active: !subscriber.is_active } as never)
        .eq('id', subscriber.id);

      if (error) throw error;
      fetchSubscribers();
      if (selectedSubscriber?.id === subscriber.id) {
        setSelectedSubscriber({ ...subscriber, is_active: !subscriber.is_active });
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update subscriber');
      console.error('Error updating subscriber:', error);
    }
  };

  const handleDelete = async (subscriber: Subscriber) => {
    if (!confirm(`Are you sure you want to delete ${subscriber.email} from the subscriber list?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('subscribers')
        .delete()
        .eq('id', subscriber.id);

      if (error) throw error;
      if (selectedSubscriber?.id === subscriber.id) {
        setSelectedSubscriber(null);
      }
      fetchSubscribers();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete subscriber');
      console.error('Error deleting subscriber:', error);
    }
  };

  const handleExportCSV = () => {
    const filteredSubscribers = subscribers.filter(sub =>
      sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const csvHeaders = ['Email', 'Status', 'Subscribed Date', 'Weekly Newsletter', 'Article Alerts', 'Research Updates'];
    const csvRows = filteredSubscribers.map(sub => {
      const prefs = sub.preferences as any || {};
      return [
        sub.email,
        sub.is_active ? 'Active' : 'Inactive',
        new Date(sub.subscribed_at).toLocaleDateString(),
        prefs.weekly_newsletter ? 'Yes' : 'No',
        prefs.article_alerts ? 'Yes' : 'No',
        prefs.research_updates ? 'Yes' : 'No'
      ].join(',');
    });

    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const filteredSubscribers = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = subscribers.filter(s => s.is_active).length;
  const inactiveCount = subscribers.filter(s => !s.is_active).length;

  if (status === 'loading') {
    return (
      <>
        <Head>
          <title>Subscribers - Admin - Reform in Focus</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <AdminLayout title="Newsletter Subscribers">
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: '1.125rem', color: 'var(--neutral-600)' }}>
              Loading subscribers...
            </div>
          </div>
        </AdminLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Subscribers - Admin - Reform in Focus</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminLayout title="Newsletter Subscribers">
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{
            backgroundColor: 'var(--white)',
            border: '1px solid var(--neutral-200)',
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-blue)', marginBottom: '0.25rem' }}>
              {subscribers.length}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--neutral-600)' }}>
              Total Subscribers
            </div>
          </div>
          <div style={{
            backgroundColor: 'var(--white)',
            border: '1px solid var(--neutral-200)',
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.25rem' }}>
              {activeCount}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--neutral-600)' }}>
              Active
            </div>
          </div>
          <div style={{
            backgroundColor: 'var(--white)',
            border: '1px solid var(--neutral-200)',
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--neutral-600)', marginBottom: '0.25rem' }}>
              {inactiveCount}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--neutral-600)' }}>
              Inactive
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Search */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by email..."
            style={{
              flex: 1,
              minWidth: '250px',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '1px solid var(--neutral-300)',
              borderRadius: '6px'
            }}
          />

          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: filter === 'all' ? 'var(--primary-blue)' : 'var(--white)',
                color: filter === 'all' ? 'var(--white)' : 'var(--neutral-700)',
                border: `1px solid ${filter === 'all' ? 'var(--primary-blue)' : 'var(--neutral-300)'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: filter === 'active' ? 'var(--primary-blue)' : 'var(--white)',
                color: filter === 'active' ? 'var(--white)' : 'var(--neutral-700)',
                border: `1px solid ${filter === 'active' ? 'var(--primary-blue)' : 'var(--neutral-300)'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('inactive')}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: filter === 'inactive' ? 'var(--primary-blue)' : 'var(--white)',
                color: filter === 'inactive' ? 'var(--white)' : 'var(--neutral-700)',
                border: `1px solid ${filter === 'inactive' ? 'var(--primary-blue)' : 'var(--neutral-300)'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              Inactive
            </button>
          </div>

          {/* Export */}
          <button
            onClick={handleExportCSV}
            disabled={filteredSubscribers.length === 0}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--accent-green)',
              color: 'var(--white)',
              border: 'none',
              borderRadius: '6px',
              cursor: filteredSubscribers.length === 0 ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              opacity: filteredSubscribers.length === 0 ? 0.5 : 1
            }}
          >
            Export CSV
          </button>
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

        {/* Subscribers Table */}
        {filteredSubscribers.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 1rem',
            backgroundColor: 'var(--neutral-50)',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '1.125rem', color: 'var(--neutral-600)' }}>
              {searchTerm ? 'No subscribers match your search' : filter === 'all' ? 'No subscribers yet' : `No ${filter} subscribers`}
            </p>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'var(--white)',
            border: '1px solid var(--neutral-200)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--neutral-50)', borderBottom: '1px solid var(--neutral-200)' }}>
                  <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>
                    Status
                  </th>
                  <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>
                    Email
                  </th>
                  <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>
                    Subscribed
                  </th>
                  <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>
                    Preferences
                  </th>
                  <th style={{ padding: '0.875rem 1rem', textAlign: 'right', fontWeight: '600', fontSize: '0.875rem' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.map((subscriber) => {
                  const prefs = subscriber.preferences as any || {};
                  return (
                    <tr key={subscriber.id} style={{ borderBottom: '1px solid var(--neutral-200)' }}>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: subscriber.is_active ? '#D1FAE5' : 'var(--neutral-200)',
                          color: subscriber.is_active ? '#065F46' : 'var(--neutral-600)'
                        }}>
                          {subscriber.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: '500' }}>
                        {subscriber.email}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--neutral-600)' }}>
                        {formatDate(subscriber.subscribed_at)}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          {prefs.weekly_newsletter && (
                            <span style={{ color: 'var(--neutral-700)' }}>📧 Weekly</span>
                          )}
                          {prefs.article_alerts && (
                            <span style={{ color: 'var(--neutral-700)' }}>🔔 Alerts</span>
                          )}
                          {prefs.research_updates && (
                            <span style={{ color: 'var(--neutral-700)' }}>📊 Research</span>
                          )}
                          {!prefs.weekly_newsletter && !prefs.article_alerts && !prefs.research_updates && (
                            <span style={{ color: 'var(--neutral-500)' }}>None</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => setSelectedSubscriber(subscriber)}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: 'var(--white)',
                              color: 'var(--primary-blue)',
                              border: '1px solid var(--primary-blue)',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '600'
                            }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleToggleStatus(subscriber)}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: 'var(--white)',
                              color: subscriber.is_active ? '#f59e0b' : '#10b981',
                              border: `1px solid ${subscriber.is_active ? '#f59e0b' : '#10b981'}`,
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '600'
                            }}
                          >
                            {subscriber.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDelete(subscriber)}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: 'var(--white)',
                              color: '#DC2626',
                              border: '1px solid #DC2626',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '600'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Detail Modal */}
        {selectedSubscriber && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem'
            }}
            onClick={() => setSelectedSubscriber(null)}
          >
            <div
              style={{
                backgroundColor: 'var(--white)',
                borderRadius: '8px',
                padding: '2rem',
                maxWidth: '600px',
                width: '100%'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--neutral-200)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
                  }}>
                    Subscriber Details
                  </h2>
                  <button
                    onClick={() => setSelectedSubscriber(null)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.5rem',
                      color: 'var(--neutral-600)'
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Details */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', marginBottom: '0.25rem' }}>
                    Email
                  </div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                    {selectedSubscriber.email}
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', marginBottom: '0.25rem' }}>
                    Status
                  </div>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    backgroundColor: selectedSubscriber.is_active ? '#D1FAE5' : 'var(--neutral-200)',
                    color: selectedSubscriber.is_active ? '#065F46' : 'var(--neutral-600)'
                  }}>
                    {selectedSubscriber.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', marginBottom: '0.25rem' }}>
                    Subscribed Date
                  </div>
                  <div style={{ fontSize: '1rem' }}>
                    {formatDate(selectedSubscriber.subscribed_at)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', marginBottom: '0.5rem' }}>
                    Email Preferences
                  </div>
                  {(() => {
                    const prefs = selectedSubscriber.preferences as any || {};
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="checkbox"
                            checked={prefs.weekly_newsletter || false}
                            readOnly
                            style={{ width: '18px', height: '18px' }}
                          />
                          <span>Weekly Newsletter</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="checkbox"
                            checked={prefs.article_alerts || false}
                            readOnly
                            style={{ width: '18px', height: '18px' }}
                          />
                          <span>Article Alerts</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="checkbox"
                            checked={prefs.research_updates || false}
                            readOnly
                            style={{ width: '18px', height: '18px' }}
                          />
                          <span>Research Updates</span>
                        </label>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => handleToggleStatus(selectedSubscriber)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'var(--white)',
                    color: 'var(--neutral-700)',
                    border: '1px solid var(--neutral-300)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  {selectedSubscriber.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => setSelectedSubscriber(null)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'var(--primary-blue)',
                    color: 'var(--white)',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}

export default withAuth(SubscribersPage);
