import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ResetPassword() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Validation
    if (newPassword.length < 6) {
      setStatus('error');
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus('error');
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setStatus('success');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to reset password. Please try again.'
      );
    }
  };

  return (
    <>
      <Head>
        <title>Reset Password - Reform in Focus</title>
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
              Reset Password
            </h1>
            <p style={{ color: 'var(--neutral-600)', fontSize: '0.875rem' }}>
              Enter your new password
            </p>
          </div>

          {status === 'success' ? (
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#D1FAE5',
              border: '1px solid #10b981',
              borderRadius: '6px',
              color: '#065F46',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
              <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Password reset successful!</p>
              <p style={{ fontSize: '0.875rem' }}>Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="newPassword"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: 'var(--neutral-800)',
                    fontSize: '0.875rem'
                  }}
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
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
                <label
                  htmlFor="confirmPassword"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: 'var(--neutral-800)',
                    fontSize: '0.875rem'
                  }}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
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
                {status === 'loading' ? 'Resetting...' : 'Reset Password'}
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
