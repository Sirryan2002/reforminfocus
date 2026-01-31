import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/navbar';

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service - Reform in Focus</title>
        <meta
          name="description"
          content="Terms of Service for Reform in Focus - Legal terms and conditions for using our website."
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
            Terms of Service
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
              1. Agreement to Terms
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              By accessing or using Reform in Focus (&quot;the Service&quot;, &quot;our website&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of these terms, you may not access the Service.
            </p>
            <p>
              These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              2. Description of Service
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Reform in Focus is an educational blog providing analysis, commentary, and research on Michigan K-12 education reform. Our Service includes:
            </p>
            <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
              <li>Articles and analysis on education reform topics</li>
              <li>Research publications and data-driven content</li>
              <li>Newsletter subscriptions</li>
              <li>Contact forms for reader engagement</li>
              <li>Search functionality for discovering content</li>
            </ul>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of the Service at any time without notice.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              3. User Accounts
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Some features of the Service may require you to create an account (such as Google OAuth for admin access). When you create an account, you must:
            </p>
            <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Promptly update any information that becomes inaccurate</li>
              <li>Accept responsibility for all activities that occur under your account</li>
            </ul>
            <p>
              You may not use another person&apos;s account without permission. We reserve the right to terminate accounts that violate these Terms.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              4. Intellectual Property Rights
            </h2>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', marginTop: '1rem' }}>
              4.1 Our Content
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              The Service and its original content (excluding user-generated content), features, and functionality are owned by Reform in Focus and are protected by United States and international copyright, trademark, and other intellectual property laws.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              You may:
            </p>
            <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
              <li>Read and view our content for personal, non-commercial use</li>
              <li>Share links to our articles on social media</li>
              <li>Quote brief excerpts with proper attribution and a link back to the original article</li>
            </ul>
            <p style={{ marginBottom: '1rem' }}>
              You may NOT:
            </p>
            <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
              <li>Republish entire articles without written permission</li>
              <li>Use our content for commercial purposes without authorization</li>
              <li>Remove copyright notices or attribution</li>
              <li>Claim our content as your own</li>
            </ul>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', marginTop: '1rem' }}>
              4.2 Fair Use
            </h3>
            <p>
              We respect fair use principles. Educational institutions, researchers, and journalists may quote our work under fair use doctrine with proper citation: &quot;Reform in Focus, [Article Title], [URL]&quot;
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              5. User Conduct
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              By using the Service, you agree NOT to:
            </p>
            <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
              <li>Violate any applicable laws or regulations</li>
              <li>Impersonate any person or entity</li>
              <li>Submit false or misleading information</li>
              <li>Spam our contact forms or newsletter subscriptions</li>
              <li>Attempt to gain unauthorized access to any portion of the Service</li>
              <li>Use automated systems (bots, scrapers) without permission</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Transmit viruses, malware, or other harmful code</li>
              <li>Harass, abuse, or harm other users</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              6. Newsletter Subscriptions
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              By subscribing to our newsletter, you:
            </p>
            <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
              <li>Consent to receive email communications from us</li>
              <li>Agree that we may use your email address to send newsletters, article alerts, and updates</li>
              <li>Understand you can unsubscribe at any time using the link in any email</li>
            </ul>
            <p>
              We will never sell or share your email address with third parties for marketing purposes.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              7. Third-Party Links and Services
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Our Service may contain links to third-party websites or services that are not owned or controlled by Reform in Focus. We have no control over, and assume no responsibility for:
            </p>
            <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
              <li>The content of third-party websites</li>
              <li>Privacy policies of third-party services</li>
              <li>Practices of third-party providers</li>
            </ul>
            <p>
              When you use Google OAuth to sign in, Google&apos;s Terms of Service apply. We recommend reviewing Google&apos;s terms at{' '}
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-blue)' }}>
                https://policies.google.com/terms
              </a>
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              8. Disclaimers
            </h2>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', marginTop: '1rem' }}>
              8.1 Educational Content Only
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              The information provided on Reform in Focus is for educational and informational purposes only. It does not constitute:
            </p>
            <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
              <li>Legal advice</li>
              <li>Policy recommendations for specific situations</li>
              <li>Professional educational consulting</li>
              <li>Investment or financial advice</li>
            </ul>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', marginTop: '1rem' }}>
              8.2 &quot;As Is&quot; Service
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, either express or implied, including but not limited to:
            </p>
            <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
              <li>Accuracy or completeness of content</li>
              <li>Uninterrupted or error-free operation</li>
              <li>Fitness for a particular purpose</li>
            </ul>
            <p>
              We do not warrant that the Service will be available at all times or that defects will be corrected.
            </p>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', marginTop: '1rem' }}>
              8.3 Content Accuracy
            </h3>
            <p>
              While we strive for accuracy in our research and reporting, we make no guarantees about the accuracy, completeness, or timeliness of information. Education policy is complex and evolving. Always verify important information through official sources.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              9. Limitation of Liability
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              To the maximum extent permitted by applicable law, Reform in Focus shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
              <li>Loss of profits</li>
              <li>Loss of data</li>
              <li>Loss of use</li>
              <li>Business interruption</li>
            </ul>
            <p>
              This limitation applies whether the alleged liability is based on contract, tort, negligence, strict liability, or any other basis, even if we have been advised of the possibility of such damage.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              10. Indemnification
            </h2>
            <p>
              You agree to defend, indemnify, and hold harmless Reform in Focus from and against any claims, damages, obligations, losses, liabilities, costs, or expenses arising from:
            </p>
            <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any content you submit through the Service</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              11. Changes to Terms
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms taking effect.
            </p>
            <p>
              Your continued use of the Service after changes become effective constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              12. Termination
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including:
            </p>
            <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
              <li>Violation of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Request by law enforcement</li>
              <li>At our sole discretion</li>
            </ul>
            <p>
              Upon termination, your right to use the Service will cease immediately. If you wish to terminate your account, you may simply discontinue using the Service.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              13. Governing Law
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              These Terms shall be governed and construed in accordance with the laws of the State of Michigan, United States, without regard to its conflict of law provisions.
            </p>
            <p>
              Any disputes arising from these Terms or the Service shall be resolved in the courts located in Michigan.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              14. Severability
            </h2>
            <p>
              If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law, and the remaining provisions will continue in full force and effect.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              15. Entire Agreement
            </h2>
            <p>
              These Terms constitute the entire agreement between you and Reform in Focus regarding the Service and supersede all prior agreements and understandings, whether written or oral.
            </p>
          </section>

          <section>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
            }}>
              16. Contact Information
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              If you have questions about these Terms, please contact us:
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
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--neutral-50)', borderRadius: '6px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            By using Reform in Focus, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.875rem' }}>
            <Link href="/privacy" style={{ color: 'var(--primary-blue)', textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            <Link href="/" style={{ color: 'var(--primary-blue)', textDecoration: 'none' }}>
              Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
