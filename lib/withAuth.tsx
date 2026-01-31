import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser, checkIsAdmin } from './auth';

/**
 * Higher-Order Component to protect admin routes
 * Redirects to login if user is not authenticated or not an admin
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const user = await getCurrentUser();

          if (!user) {
            router.push('/admin/login');
            return;
          }

          const isAdmin = await checkIsAdmin();

          if (!isAdmin) {
            router.push('/admin/login?error=unauthorized');
            return;
          }

          setIsAuthorized(true);
        } catch (error) {
          console.error('Auth check failed:', error);
          router.push('/admin/login');
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();
    }, [router]);

    if (isLoading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Verifying authentication...</p>
          </div>
        </div>
      );
    }

    if (!isAuthorized) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
