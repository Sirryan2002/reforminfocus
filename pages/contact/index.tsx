import { useState } from 'react';
import Head from 'next/head';
import Navbar from '@/components/navbar';
import Button from '@/components/button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setResponseMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to send message');
      }

      setStatus('success');
      setResponseMessage('Thank you for your message! We&rsquo;ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
      setResponseMessage(
        err instanceof Error ? err.message : 'Failed to send message. Please try again.'
      );
    }
  };

  return (
    <>
      <Head>
        <title>Contact - Reform in Focus</title>
        <meta
          name="description"
          content="Get in touch with Reform in Focus. Share story ideas or reach out with questions."
        />
      </Head>
      <Navbar />

      <div className="container" style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 1rem' }}>
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" }}>
            Get in Touch
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--neutral-600)', lineHeight: '1.7' }}>
            Have a story idea or question about Michigan education reform? We&rsquo;d love to hear from you.
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
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor="name"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 'bold',
                  color: 'var(--neutral-800)',
                }}
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Your name"
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

            <div style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 'bold',
                  color: 'var(--neutral-800)',
                }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

            <div style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor="subject"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 'bold',
                  color: 'var(--neutral-800)',
                }}
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                placeholder="What is this about?"
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
                htmlFor="message"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: 'bold',
                  color: 'var(--neutral-800)',
                }}
              >
                Message
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                placeholder="Your message..."
                rows={6}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '1px solid var(--neutral-300)',
                  borderRadius: '6px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
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
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </Button>

            {responseMessage && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  borderRadius: '6px',
                  backgroundColor:
                    status === 'success' ? 'var(--accent-green)' : 'var(--accent-red)',
                  color: 'var(--white)',
                }}
                dangerouslySetInnerHTML={{ __html: responseMessage }}
              />
            )}
          </form>
        </div>
      </div>
    </>
  );
}
