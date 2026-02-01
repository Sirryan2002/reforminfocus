import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, getCurrentUser } from '@/lib/auth';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };

    loadUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/articles', label: 'Articles', icon: '📝' },
    { href: '/admin/tags', label: 'Tags', icon: '🏷️' },
    { href: '/admin/clusters', label: 'Clusters', icon: '📁' },
    { href: '/admin/subscribers', label: 'Subscribers', icon: '📧' },
    { href: '/admin/contacts', label: 'Contact Inbox', icon: '✉️' },
      { href: '/admin/images', label: 'Image Manager', icon: '🖼️' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--neutral-50)' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '250px' : '70px',
        backgroundColor: 'var(--neutral-900)',
        color: 'var(--white)',
        padding: '1.5rem 0',
        transition: 'width 0.3s ease',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto'
      }}>
        {/* Logo */}
        <div style={{
          padding: '0 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {sidebarOpen && (
            <Link
              href="/"
              style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'var(--white)',
                textDecoration: 'none'
              }}
            >
              Reform in Focus
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--white)',
              cursor: 'pointer',
              fontSize: '1.25rem',
              padding: '0.25rem'
            }}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ backgroundColor: 'var(--neutral-900)' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.875rem 1.5rem',
                      color: 'var(--white)',
                      textDecoration: 'none',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      borderLeft: isActive ? '3px solid var(--primary-blue)' : '3px solid transparent',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <span style={{ fontSize: '1.25rem', marginRight: sidebarOpen ? '0.75rem' : '0' }}>
                      {item.icon}
                    </span>
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Menu */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {sidebarOpen && (
            <>
              <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.8 }}>
                {userEmail}
              </div>
              <button
                onClick={handleSignOut}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--white)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}
              >
                Sign Out
              </button>
            </>
          )}
          {!sidebarOpen && (
            <button
              onClick={handleSignOut}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--white)',
                cursor: 'pointer',
                fontSize: '1.5rem'
              }}
              title="Sign Out"
            >
              🚪
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginLeft: sidebarOpen ? '250px' : '70px',
        padding: '2rem',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Header */}
        <header style={{
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            {title && (
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
              }}>
                {title}
              </h1>
            )}
            {/* Breadcrumbs could go here */}
          </div>
          <div>
            <Link
              href="/"
              target="_blank"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--white)',
                border: '1px solid var(--neutral-300)',
                borderRadius: '4px',
                textDecoration: 'none',
                color: 'var(--neutral-700)',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              View Site →
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div style={{
          backgroundColor: 'var(--white)',
          borderRadius: '8px',
          border: '1px solid var(--neutral-200)',
          padding: '2rem'
        }}>
          {children}
        </div>
      </main>
    </div>
  );
}
