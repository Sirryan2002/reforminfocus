import { useState, useEffect } from 'react';
import Head from 'next/head';
import { withAuth } from '@/lib/withAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/ImageUploader';
import { supabase } from '@/lib/supabase';

type StorageFile = {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, any>;
};

function ImageManagerPage() {
  const [images, setImages] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBucket, setSelectedBucket] = useState<'article-images' | 'og-images'>('article-images');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [deletingImage, setDeletingImage] = useState<string | null>(null);
  const [showGuidelines, setShowGuidelines] = useState(false);

  useEffect(() => {
    loadImages();
  }, [selectedBucket]);

  const loadImages = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error: listError } = await supabase.storage
        .from(selectedBucket)
        .list('uploads', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (listError) throw listError;

      setImages(data || []);
    } catch (err) {
      console.error('Error loading images:', err);
      setError('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage
      .from(selectedBucket)
      .getPublicUrl(`uploads/${fileName}`);
    return data.publicUrl;
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const deleteImage = async (fileName: string) => {
    if (!confirm(`Delete ${fileName}? This cannot be undone.`)) return;

    setDeletingImage(fileName);

    try {
      const { error: deleteError } = await supabase.storage
        .from(selectedBucket)
        .remove([`uploads/${fileName}`]);

      if (deleteError) throw deleteError;

      // Reload images
      await loadImages();
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Failed to delete image');
    } finally {
      setDeletingImage(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalSize = images.reduce((sum, img) => sum + (img.metadata?.size || 0), 0);

  return (
    <>
      <Head>
        <title>Image Manager - Admin - Reform in Focus</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminLayout title="Image Manager">
        {/* Guidelines Section */}
        <div style={{ marginBottom: '2rem', border: '1px solid var(--neutral-300)', borderRadius: '8px', padding: '1.5rem', backgroundColor: 'var(--neutral-50)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>📸 Image Optimization Guidelines</h2>
            <button
              onClick={() => setShowGuidelines(!showGuidelines)}
              style={{
                fontSize: '0.875rem',
                color: 'var(--primary-blue)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {showGuidelines ? 'Hide' : 'Show'} Guidelines
            </button>
          </div>

          {showGuidelines && (
            <div style={{ fontSize: '0.875rem', lineHeight: '1.7' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Recommended Sizes:</h3>
                <ul style={{ marginLeft: '1.25rem' }}>
                  <li><strong>Featured/OG Images:</strong> 1200x630px (optimal for social sharing)</li>
                  <li><strong>Inline Article Images:</strong> Max 800px wide</li>
                  <li><strong>Thumbnails:</strong> 400x300px</li>
                </ul>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>File Formats:</h3>
                <ul style={{ marginLeft: '1.25rem' }}>
                  <li><strong>WebP:</strong> Best choice - 70-80% smaller than JPEG, excellent quality</li>
                  <li><strong>JPEG:</strong> Good for photos - use 80-85% quality</li>
                  <li><strong>PNG:</strong> Only for graphics needing transparency - compress aggressively</li>
                  <li><strong>GIF:</strong> Avoid unless animation needed - use video instead</li>
                </ul>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Compression Tools (Use Before Upload):</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <a href="https://tinypng.com" target="_blank" rel="noopener noreferrer" style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--primary-blue)',
                    color: 'var(--white)',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    TinyPNG →
                  </a>
                  <a href="https://squoosh.app" target="_blank" rel="noopener noreferrer" style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--primary-blue)',
                    color: 'var(--white)',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    Squoosh →
                  </a>
                  <a href="https://imageoptim.com" target="_blank" rel="noopener noreferrer" style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--primary-blue)',
                    color: 'var(--white)',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    ImageOptim (Mac) →
                  </a>
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#FEF3C7', borderRadius: '6px' }}>
                <p style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#92400E' }}>💾 Storage Limits (Supabase Free Tier):</p>
                <ul style={{ marginLeft: '1.25rem', color: '#78350F' }}>
                  <li><strong>Total Storage:</strong> 1 GB (current: {formatFileSize(totalSize)})</li>
                  <li><strong>Per File:</strong> 5 MB max</li>
                  <li><strong>Bandwidth:</strong> 2 GB/month</li>
                  <li><strong>Target per image:</strong> Under 200 KB for fast loading</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div style={{ marginBottom: '2rem', border: '1px solid var(--neutral-300)', borderRadius: '8px', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Upload New Image</h2>

          {/* Bucket Selector */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
              Upload to:
            </label>
            <select
              value={selectedBucket}
              onChange={(e) => setSelectedBucket(e.target.value as typeof selectedBucket)}
              style={{
                padding: '0.75rem',
                fontSize: '1rem',
                border: '1px solid var(--neutral-300)',
                borderRadius: '6px',
                backgroundColor: 'var(--white)',
                cursor: 'pointer'
              }}
            >
              <option value="article-images">Article Images (general use)</option>
              <option value="og-images">OG Images (social sharing 1200x630)</option>
            </select>
          </div>

          <ImageUploader
            onUploadComplete={(url) => {
              console.log('Uploaded:', url);
              loadImages(); // Reload the list
            }}
            bucket={selectedBucket}
            maxSizeMB={5}
          />
        </div>

        {/* Images List */}
        <div style={{ border: '1px solid var(--neutral-300)', borderRadius: '8px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
              {selectedBucket === 'article-images' ? 'Article Images' : 'OG Images'} ({images.length})
            </h2>
            <button
              onClick={loadImages}
              disabled={loading}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--neutral-700)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {error && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#FEE2E2',
              borderRadius: '6px',
              color: '#991B1B',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="loading-spinner"></div>
              <p style={{ marginTop: '1rem', color: 'var(--neutral-600)' }}>Loading images...</p>
            </div>
          )}

          {!loading && images.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--neutral-50)', borderRadius: '8px' }}>
              <p style={{ fontSize: '1.125rem', color: 'var(--neutral-600)' }}>
                No images uploaded yet. Upload your first image above!
              </p>
            </div>
          )}

          {!loading && images.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {images.map((image) => {
                const publicUrl = getPublicUrl(image.name);
                return (
                  <div
                    key={image.id}
                    style={{
                      border: '1px solid var(--neutral-300)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: 'var(--white)'
                    }}
                  >
                    <div style={{ position: 'relative', paddingTop: '66.67%', backgroundColor: 'var(--neutral-100)' }}>
                      <img
                        src={publicUrl}
                        alt={image.name}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', wordBreak: 'break-all' }}>
                        {image.name}
                      </p>
                      <div style={{ fontSize: '0.75rem', color: 'var(--neutral-600)', marginBottom: '0.5rem' }}>
                        <div>{formatFileSize(image.metadata?.size || 0)}</div>
                        <div>{formatDate(image.created_at)}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                        <button
                          onClick={() => copyToClipboard(publicUrl)}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            backgroundColor: copiedUrl === publicUrl ? 'var(--accent-green)' : 'var(--primary-blue)',
                            color: 'var(--white)',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          {copiedUrl === publicUrl ? '✓ Copied!' : 'Copy URL'}
                        </button>
                        <button
                          onClick={() => deleteImage(image.name)}
                          disabled={deletingImage === image.name}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: 'var(--accent-red)',
                            color: 'var(--white)',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: deletingImage === image.name ? 'not-allowed' : 'pointer',
                            opacity: deletingImage === image.name ? 0.6 : 1
                          }}
                        >
                          {deletingImage === image.name ? '...' : '🗑️'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}

export default withAuth(ImageManagerPage);
