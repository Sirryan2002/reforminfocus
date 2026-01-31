import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { checkIsAdmin } from '@/lib/auth';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Completing sign in...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // The session is automatically handled by Supabase
        // Just need to check if user is admin
        const isAdmin = await checkIsAdmin();

        if (!isAdmin) {
          setStatus('error');
          setMessage('You do not have admin access to this system.');
          setTimeout(() => {
            router.push('/admin/login?error=unauthorized');
          }, 2000);
          return;
        }

        setStatus('success');
        setMessage('Sign in successful! Redirecting...');

        // Redirect to admin dashboard
        setTimeout(() => {
          router.push('/admin');
        }, 1000);
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage('Authentication failed. Redirecting to login...');
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <>
      <Head>
        <title>Signing In - Reform in Focus</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--neutral-50)'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: 'var(--white)',
          borderRadius: '8px',
          border: '1px solid var(--neutral-200)',
          maxWidth: '400px'
        }}>
          {status === 'loading' && (
            <>
              <div className="loading-container">
                <div className="loading-spinner"></div>
              </div>
              <p style={{ marginTop: '1rem', color: 'var(--neutral-600)' }}>{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
              <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--accent-green)' }}>
                {message}
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✗</div>
              <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--accent-red)' }}>
                {message}
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
