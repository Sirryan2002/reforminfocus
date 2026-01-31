import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      marginTop: '4rem',
      padding: '2rem 1rem',
      backgroundColor: 'var(--neutral-900)',
      color: 'var(--neutral-300)',
      borderTop: '1px solid var(--neutral-800)'
    }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* About */}
          <div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: 'var(--white)',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              Reform in Focus
            </h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
              Exploring K-12 education reform across Michigan
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: 'var(--white)',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              Navigation
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.875rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/topics" style={{ color: 'var(--neutral-300)', textDecoration: 'none' }}>
                  Explore Topics
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/understanding-reform" style={{ color: 'var(--neutral-300)', textDecoration: 'none' }}>
                  Understanding Reform
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/research" style={{ color: 'var(--neutral-300)', textDecoration: 'none' }}>
                  Research
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/search" style={{ color: 'var(--neutral-300)', textDecoration: 'none' }}>
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: 'var(--white)',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              Connect
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.875rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/subscribe" style={{ color: 'var(--neutral-300)', textDecoration: 'none' }}>
                  Subscribe
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/contact" style={{ color: 'var(--neutral-300)', textDecoration: 'none' }}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: 'var(--white)',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              Legal
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.875rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/privacy" style={{ color: 'var(--neutral-300)', textDecoration: 'none' }}>
                  Privacy Policy
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/terms" style={{ color: 'var(--neutral-300)', textDecoration: 'none' }}>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--neutral-800)',
          textAlign: 'center',
          fontSize: '0.875rem'
        }}>
          <p>
            © {currentYear} Reform in Focus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
