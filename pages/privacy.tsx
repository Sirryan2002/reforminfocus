import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/navbar';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Reform in Focus</title>
        <meta
          name="description"
          content="Privacy Policy for Reform in Focus - How we collect, use, and protect your personal information."
        />
      </Head>
      <Navbar />

      <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1rem' }}>
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            marginBottom: '1rem',
            fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
          }}>
            Privacy Policy
          </h1>
          <p style={{ color: 'var(--neutral-600)', fontSize: '0.875rem' }}>
            Last Updated: January 31, 2026
          </p>
        </header>

        <div style={{
          backgroundColor: 'var(--white)',
          border: '1px solid var(--neutral-200)',
          borderRadius: '8px',
          padding: '2.5rem',
          lineHeight: '1.8'
        }}>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              1. Introduction
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Welcome to Reform in Focus (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
            <p>
              By using Reform in Focus, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              2. Information We Collect
            </h2>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', marginTop: '1rem' }}>
              2.1 Personal Information
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              We may collect the following types of personal information:
            </p>
            <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
              <li><strong>Email Address:</strong> When you subscribe to our newsletter or contact us</li>
              <li><strong>Name:</strong> When you submit a contact form</li>
              <li><strong>Google Account Information:</strong> When you sign in with Google OAuth (email, profile picture, name)</li>
            </ul>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', marginTop: '1rem' }}>
              2.2 Automatically Collected Information
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              When you visit our website, we automatically collect certain information about your device, including:
            </p>
            <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>IP address</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website</li>
            </ul>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', marginTop: '1rem' }}>
              2.3 Cookies and Tracking Technologies
            </h3>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              3. How We Use Your Information
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              We use the information we collect for the following purposes:
            </p>
            <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
              <li><strong>Newsletter Delivery:</strong> To send you our weekly newsletter and article alerts (only if you subscribe)</li>
              <li><strong>Communication:</strong> To respond to your inquiries and contact form submissions</li>
              <li><strong>Authentication:</strong> To provide secure access to admin features for authorized users</li>
              <li><strong>Website Improvement:</strong> To analyze usage patterns and improve our content and user experience</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights</li>
            </ul>
            <p>
              <strong>We will never sell your personal information to third parties.</strong>
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              4. Third-Party Services
            </h2>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', marginTop: '1rem' }}>
              4.1 Supabase
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              We use Supabase for database hosting and authentication services. Your data is stored securely on Supabase servers. Please review Supabase&apos;s Privacy Policy at{' '}
              <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-blue)' }}>
                https://supabase.com/privacy
              </a>
            </p>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', marginTop: '1rem' }}>
              4.2 Google OAuth
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              When you sign in with Google, we receive limited information from Google (email, name, profile picture) as permitted by your Google account settings. We only use this information for authentication purposes. Google&apos;s Privacy Policy is available at{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-blue)' }}>
                https://policies.google.com/privacy
              </a>
            </p>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', marginTop: '1rem' }}>
              4.3 Vercel (Hosting)
            </h3>
            <p>
              Our website is hosted on Vercel. Vercel may collect technical information about your visit. Review Vercel&apos;s Privacy Policy at{' '}
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-blue)' }}>
                https://vercel.com/legal/privacy-policy
              </a>
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              5. Data Security
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
              <li>Encryption of data in transit (HTTPS/SSL)</li>
              <li>Secure authentication mechanisms</li>
              <li>Regular security audits</li>
              <li>Access controls and permissions</li>
            </ul>
            <p>
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              6. Your Privacy Rights
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
              <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
            </ul>
            <p>
              To exercise these rights, please contact us at the email address provided below.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              7. Newsletter and Communications
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              If you subscribe to our newsletter, you can unsubscribe at any time by:
            </p>
            <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
              <li>Clicking the &quot;unsubscribe&quot; link in any email we send</li>
              <li>Contacting us directly at the email below</li>
            </ul>
            <p>
              We will process your request within 48 hours.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              8. Children&apos;s Privacy
            </h2>
            <p>
              Our website is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              9. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. Changes are effective immediately upon posting.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              10. Contact Us
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              If you have questions or concerns about this Privacy Policy, please contact us:
            </p>
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--neutral-50)',
              borderRadius: '6px',
              border: '1px solid var(--neutral-200)'
            }}>
              <p><strong>Reform in Focus</strong></p>
              <p>Email: <a href="mailto:reforminfocus@gmail.com" style={{ color: 'var(--primary-blue)' }}>reforminfocus@gmail.com</a></p>
              <p>Website: <Link href="/contact" style={{ color: 'var(--primary-blue)' }}>Contact Form</Link></p>
            </div>
          </section>

          <section>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              11. Michigan-Specific Privacy Rights
            </h2>
            <p>
              As a Michigan-based publication focusing on Michigan education, we respect the privacy rights of Michigan residents. Michigan residents have the right to request information about how we share their personal information with third parties for direct marketing purposes.
            </p>
          </section>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link
            href="/"
            style={{
              color: 'var(--primary-blue)',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
