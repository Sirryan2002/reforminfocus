import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { sendPasswordResetEmail } from '@/lib/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await sendPasswordResetEmail(email);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to send reset email. Please try again.'
      );
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password - Reform in Focus</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--neutral-50)',
        padding: '1rem'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'var(--white)',
          padding: '2.5rem',
          borderRadius: '8px',
          border: '1px solid var(--neutral-200)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              Forgot Password
            </h1>
            <p style={{ color: 'var(--neutral-600)', fontSize: '0.875rem' }}>
              Enter your email to receive a password reset link
            </p>
          </div>

          {status === 'success' ? (
            <>
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#D1FAE5',
                border: '1px solid #10b981',
                borderRadius: '6px',
                color: '#065F46',
                textAlign: 'center',
                marginBottom: '1.5rem'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
                <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Check your email!</p>
                <p style={{ fontSize: '0.875rem' }}>
                  We&rsquo;ve sent a password reset link to <strong>{email}</strong>
                </p>
              </div>
              <Link
                href="/admin/login"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '0.875rem',
                  backgroundColor: 'var(--primary-blue)',
                  color: 'var(--white)',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                Back to Login
              </Link>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '2rem' }}>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: 'var(--neutral-800)',
                    fontSize: '0.875rem'
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
                  autoComplete="email"
                  placeholder="admin@example.com"
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

              {errorMessage && (
                <div style={{
                  marginBottom: '1.5rem',
                  padding: '0.875rem',
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '6px',
                  color: '#991B1B',
                  fontSize: '0.875rem'
                }}>
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  backgroundColor: status === 'loading' ? 'var(--neutral-400)' : 'var(--primary-blue)',
                  color: 'var(--white)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'var(--neutral-600)'
          }}>
            <Link
              href="/admin/login"
              style={{
                color: 'var(--primary-blue)',
                textDecoration: 'none'
              }}
            >
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
