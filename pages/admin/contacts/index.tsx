import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { withAuth } from '@/lib/withAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row'];

function ContactsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [status, setStatus] = useState<'loading' | 'idle' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  const fetchSubmissions = async () => {
    try {
      setStatus('loading');
      let query = supabase
        .from('contact_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (filter === 'unread') {
        query = query.eq('is_read', false);
      } else if (filter === 'read') {
        query = query.eq('is_read', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSubmissions(data || []);
      setStatus('idle');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load submissions');
      console.error('Error loading submissions:', error);
    }
  };

  const handleMarkAsRead = async (submission: ContactSubmission, isRead: boolean) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ is_read: isRead } as never)
        .eq('id', submission.id);

      if (error) throw error;
      fetchSubmissions();
      if (selectedSubmission?.id === submission.id) {
        setSelectedSubmission({ ...submission, is_read: isRead });
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update submission');
      console.error('Error updating submission:', error);
    }
  };

  const handleDelete = async (submission: ContactSubmission) => {
    if (!confirm(`Are you sure you want to delete this message from ${submission.name}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', submission.id);

      if (error) throw error;
      if (selectedSubmission?.id === submission.id) {
        setSelectedSubmission(null);
      }
      fetchSubmissions();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete submission');
      console.error('Error deleting submission:', error);
    }
  };

  const openSubmission = async (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    if (!submission.is_read) {
      handleMarkAsRead(submission, true);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const unreadCount = submissions.filter(s => !s.is_read).length;

  if (status === 'loading') {
    return (
      <>
        <Head>
          <title>Contact Submissions - Admin - Reform in Focus</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <AdminLayout title="Contact Submissions">
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: '1.125rem', color: 'var(--neutral-600)' }}>
              Loading submissions...
            </div>
          </div>
        </AdminLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Contact Submissions - Admin - Reform in Focus</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminLayout title="Contact Submissions">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <p style={{ color: 'var(--neutral-600)' }}>
            {submissions.length} {submissions.length === 1 ? 'submission' : 'submissions'}
            {unreadCount > 0 && (
              <span style={{ marginLeft: '0.5rem', fontWeight: '600', color: 'var(--primary-blue)' }}>
                ({unreadCount} unread)
              </span>
            )}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '0.5rem 1rem',
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
              onClick={() => setFilter('unread')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: filter === 'unread' ? 'var(--primary-blue)' : 'var(--white)',
                color: filter === 'unread' ? 'var(--white)' : 'var(--neutral-700)',
                border: `1px solid ${filter === 'unread' ? 'var(--primary-blue)' : 'var(--neutral-300)'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('read')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: filter === 'read' ? 'var(--primary-blue)' : 'var(--white)',
                color: filter === 'read' ? 'var(--white)' : 'var(--neutral-700)',
                border: `1px solid ${filter === 'read' ? 'var(--primary-blue)' : 'var(--neutral-300)'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              Read
            </button>
          </div>
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

        {/* Submissions List */}
        {submissions.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 1rem',
            backgroundColor: 'var(--neutral-50)',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '1.125rem', color: 'var(--neutral-600)' }}>
              {filter === 'all' ? 'No contact submissions yet' : `No ${filter} submissions`}
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
                  <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem', width: '50px' }}>
                    Status
                  </th>
                  <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>
                    Name
                  </th>
                  <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>
                    Email
                  </th>
                  <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>
                    Subject
                  </th>
                  <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>
                    Date
                  </th>
                  <th style={{ padding: '0.875rem 1rem', textAlign: 'right', fontWeight: '600', fontSize: '0.875rem' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr
                    key={submission.id}
                    style={{
                      borderBottom: '1px solid var(--neutral-200)',
                      cursor: 'pointer',
                      backgroundColor: submission.is_read ? 'var(--white)' : 'var(--neutral-50)'
                    }}
                    onClick={() => openSubmission(submission)}
                  >
                    <td style={{ padding: '1rem' }}>
                      {submission.is_read ? (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--neutral-400)'
                        }} />
                      ) : (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary-blue)'
                        }} />
                      )}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: submission.is_read ? 'normal' : '600' }}>
                      {submission.name}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--neutral-600)' }}>
                      {submission.email}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: submission.is_read ? 'normal' : '600' }}>
                      {submission.subject}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--neutral-600)' }}>
                      {formatDate(submission.submitted_at)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => openSubmission(submission)}
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
                          onClick={() => handleDelete(submission)}
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
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Detail Modal */}
        {selectedSubmission && (
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
            onClick={() => setSelectedSubmission(null)}
          >
            <div
              style={{
                backgroundColor: 'var(--white)',
                borderRadius: '8px',
                padding: '2rem',
                maxWidth: '700px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--neutral-200)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
                  }}>
                    {selectedSubmission.subject}
                  </h2>
                  <button
                    onClick={() => setSelectedSubmission(null)}
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
                <div style={{ fontSize: '0.875rem', color: 'var(--neutral-600)' }}>
                  <p><strong>From:</strong> {selectedSubmission.name}</p>
                  <p><strong>Email:</strong> <a href={`mailto:${selectedSubmission.email}`} style={{ color: 'var(--primary-blue)' }}>{selectedSubmission.email}</a></p>
                  <p><strong>Date:</strong> {formatDate(selectedSubmission.submitted_at)}</p>
                </div>
              </div>

              {/* Message */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Message</h3>
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'var(--neutral-50)',
                  borderRadius: '6px',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6'
                }}>
                  {selectedSubmission.message}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => handleMarkAsRead(selectedSubmission, !selectedSubmission.is_read)}
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
                  Mark as {selectedSubmission.is_read ? 'Unread' : 'Read'}
                </button>
                <a
                  href={`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject}`}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'var(--primary-blue)',
                    color: 'var(--white)',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}

export default withAuth(ContactsPage);
