import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, signInWithGoogle, getCurrentUser, checkIsAdmin } from '@/lib/auth';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Check if already logged in
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (user) {
        const isAdmin = await checkIsAdmin();
        if (isAdmin) {
          router.push('/admin');
        }
      }
    };

    checkAuth();

    // Check for error in URL
    if (router.query.error === 'unauthorized') {
      setErrorMessage('You do not have admin access.');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const { user } = await signIn(email, password);

      if (!user) {
        throw new Error('Login failed');
      }

      // Check if user is admin
      const isAdmin = await checkIsAdmin();

      if (!isAdmin) {
        setStatus('error');
        setErrorMessage('You do not have admin access to this system.');
        return;
      }

      // Redirect to admin dashboard
      router.push('/admin');
    } catch (error) {
      setStatus('error');
      if (error instanceof Error) {
        setErrorMessage(error.message === 'Invalid login credentials'
          ? 'Invalid email or password'
          : error.message);
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setStatus('loading');
      setErrorMessage('');
      await signInWithGoogle();
      // Redirect will be handled by OAuth flow
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to sign in with Google'
      );
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login - Reform in Focus</title>
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
              Admin Login
            </h1>
            <p style={{ color: 'var(--neutral-600)', fontSize: '0.875rem' }}>
              Reform in Focus Admin Panel
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
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

            <div style={{ marginBottom: '2rem' }}>
              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: 'var(--neutral-800)',
                  fontSize: '0.875rem'
                }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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
              {status === 'loading' ? 'Signing in...' : 'Sign In'}
            </button>

            <div style={{
              marginTop: '1rem',
              textAlign: 'center',
              fontSize: '0.875rem'
            }}>
              <Link
                href="/admin/forgot-password"
                style={{
                  color: 'var(--primary-blue)',
                  textDecoration: 'none'
                }}
              >
                Forgot password?
              </Link>
            </div>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '1.5rem 0',
            color: 'var(--neutral-400)',
            fontSize: '0.875rem'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--neutral-300)' }} />
            <span style={{ padding: '0 1rem' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--neutral-300)' }} />
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={status === 'loading'}
            style={{
              width: '100%',
              padding: '0.875rem',
              fontSize: '1rem',
              fontWeight: '600',
              backgroundColor: 'var(--white)',
              color: 'var(--neutral-700)',
              border: '1px solid var(--neutral-300)',
              borderRadius: '6px',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'background-color 0.2s'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'var(--neutral-600)'
          }}>
            <Link
              href="/"
              style={{
                color: 'var(--primary-blue)',
                textDecoration: 'none'
              }}
            >
              ← Back to site
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
