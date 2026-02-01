import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  bucket?: string;
  maxSizeMB?: number;
  accept?: string;
  buttonText?: string;
  showPreview?: boolean;
}

/**
 * Reusable image upload component for Supabase Storage
 *
 * Usage:
 * <ImageUploader
 *   onUploadComplete={(url) => console.log('Uploaded:', url)}
 *   bucket="article-images"
 *   maxSizeMB={5}
 * />
 */
export default function ImageUploader({
  onUploadComplete,
  bucket = 'article-images',
  maxSizeMB = 5,
  accept = 'image/jpeg,image/png,image/webp,image/gif',
  buttonText = 'Upload Image',
  showPreview = true,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset state
    setError(null);
    setProgress(0);

    // Validate file type
    const validTypes = accept.split(',').map(t => t.trim());
    if (!validTypes.includes(file.type)) {
      setError(`Invalid file type. Accepted: ${accept}`);
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`File too large. Maximum size: ${maxSizeMB}MB`);
      return;
    }

    // Show preview
    if (showPreview) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Upload to Supabase
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setProgress(10);

    try {
      // Generate unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const randomString = Math.random().toString(36).substring(2, 8);
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${randomString}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      setProgress(30);

      // Upload file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      setProgress(70);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setProgress(100);

      // Return URL to parent
      onUploadComplete(urlData.publicUrl);

      // Reset form
      setTimeout(() => {
        setProgress(0);
        setUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1000);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
      setProgress(0);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={uploading}
      />

      {/* Upload button */}
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={uploading}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: uploading ? 'var(--neutral-400)' : 'var(--primary-blue)',
          color: 'var(--white)',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: uploading ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s',
        }}
      >
        {uploading ? `Uploading... ${progress}%` : buttonText}
      </button>

      {/* Progress bar */}
      {uploading && (
        <div
          style={{
            marginTop: '0.5rem',
            width: '100%',
            height: '4px',
            backgroundColor: 'var(--neutral-200)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: 'var(--primary-blue)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      )}

      {/* Preview */}
      {showPreview && previewUrl && !error && (
        <div style={{ marginTop: '1rem' }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              maxWidth: '300px',
              maxHeight: '200px',
              borderRadius: '8px',
              border: '1px solid var(--neutral-300)',
            }}
          />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div
          style={{
            marginTop: '0.5rem',
            padding: '0.75rem',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '6px',
            fontSize: '0.875rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Helper text */}
      {!uploading && !error && (
        <p
          style={{
            marginTop: '0.5rem',
            fontSize: '0.875rem',
            color: 'var(--neutral-500)',
          }}
        >
          Max size: {maxSizeMB}MB. Accepted: {accept.replace(/image\//g, '').toUpperCase()}
        </p>
      )}
    </div>
  );
}
