import { useState } from 'react';
import Head from 'next/head';
import Navbar from '@/components/navbar';
import Button from '@/components/button';

export default function SubscribePage() {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState({
    weekly_newsletter: true,
    article_alerts: false,
    research_updates: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, preferences }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to subscribe');
      }

      setStatus('success');
      setMessage('Successfully subscribed! Check your email to confirm.');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Failed to subscribe. Please try again.');
    }
  };

  return (
    <>
      <Head>
        <title>Subscribe - Reform in Focus</title>
        <meta
          name="description"
          content="Subscribe to Reform in Focus for weekly education reform updates and analysis."
        />
      </Head>
      <Navbar />

      <div className="container" style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 1rem' }}>
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" }}>
            Stay Informed
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--neutral-600)', lineHeight: '1.7' }}>
            Get Michigan education reform updates delivered to your inbox.
          </p>
        </header>

        <div
          style={{
            backgroundColor: 'var(--white)',
            border: '1px solid var(--neutral-200)',
            borderRadius: '8px',
            padding: '2.5rem',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '2rem' }}>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 'bold',
                  color: 'var(--neutral-800)',
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@example.com"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '1px solid var(--neutral-300)',
                  borderRadius: '6px',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '1rem', color: 'var(--neutral-800)' }}>
                Subscription Preferences
              </p>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={preferences.weekly_newsletter}
                  onChange={(e) =>
                    setPreferences({ ...preferences, weekly_newsletter: e.target.checked })
                  }
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <div>
                  <strong>Weekly Newsletter</strong>
                  <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', marginTop: '0.25rem' }}>
                    Reform roundup every Tuesday morning
                  </p>
                </div>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={preferences.article_alerts}
                  onChange={(e) =>
                    setPreferences({ ...preferences, article_alerts: e.target.checked })
                  }
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <div>
                  <strong>Article Alerts</strong>
                  <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', marginTop: '0.25rem' }}>
                    Notifications when new articles are published
                  </p>
                </div>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={preferences.research_updates}
                  onChange={(e) =>
                    setPreferences({ ...preferences, research_updates: e.target.checked })
                  }
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <div>
                  <strong>Research Updates</strong>
                  <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', marginTop: '0.25rem' }}>
                    Alerts for new research publications
                  </p>
                </div>
              </label>
            </div>

            <Button
              type="submit"
              disabled={status === 'loading'}
              style={{
                width: '100%',
                padding: '0.875rem',
                fontSize: '1rem',
                backgroundColor: 'var(--primary-blue)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </Button>

            {message && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  borderRadius: '6px',
                  backgroundColor: status === 'success' ? 'var(--accent-green)' : 'var(--accent-red)',
                  color: 'var(--white)',
                }}
              >
                {message}
              </div>
            )}
          </form>

          <p style={{ fontSize: '0.875rem', color: 'var(--neutral-500)', marginTop: '1.5rem', textAlign: 'center' }}>
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </>
  );
}
