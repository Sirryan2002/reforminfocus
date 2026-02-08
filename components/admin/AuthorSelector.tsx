import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Author } from '@/types';

interface AuthorSelectorProps {
  selectedAuthorIds: number[];
  onChange: (authorIds: number[]) => void;
  legacyAuthorName?: string;
  onLegacyAuthorNameChange?: (name: string) => void;
}

/**
 * AuthorSelector component for the article editor
 * Allows selecting multiple authors from the authors table
 * Falls back to legacy author_name field if no authors table exists
 */
export default function AuthorSelector({
  selectedAuthorIds,
  onChange,
  legacyAuthorName = '',
  onLegacyAuthorNameChange
}: AuthorSelectorProps) {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAuthorsTable, setHasAuthorsTable] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        // Table might not exist yet
        console.log('Authors table not available:', error.message);
        setHasAuthorsTable(false);
        setLoading(false);
        return;
      }

      setAuthors(data || []);
      setHasAuthorsTable(true);
    } catch (err) {
      console.error('Error fetching authors:', err);
      setHasAuthorsTable(false);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAuthor = (authorId: number) => {
    if (selectedAuthorIds.includes(authorId)) {
      onChange(selectedAuthorIds.filter(id => id !== authorId));
    } else {
      onChange([...selectedAuthorIds, authorId]);
    }
  };

  const handleRemoveAuthor = (authorId: number) => {
    onChange(selectedAuthorIds.filter(id => id !== authorId));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newIds = [...selectedAuthorIds];
    [newIds[index - 1], newIds[index]] = [newIds[index], newIds[index - 1]];
    onChange(newIds);
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedAuthorIds.length - 1) return;
    const newIds = [...selectedAuthorIds];
    [newIds[index], newIds[index + 1]] = [newIds[index + 1], newIds[index]];
    onChange(newIds);
  };

  const selectedAuthors = selectedAuthorIds
    .map(id => authors.find(a => a.id === id))
    .filter((a): a is Author => a !== undefined);

  const availableAuthors = authors.filter(a => !selectedAuthorIds.includes(a.id));

  // If authors table doesn't exist, show legacy input
  if (!hasAuthorsTable) {
    return (
      <div>
        <label
          htmlFor="author_name"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: 'var(--neutral-800)',
            fontSize: '0.875rem'
          }}
        >
          Author (Legacy)
        </label>
        <input
          type="text"
          id="author_name"
          value={legacyAuthorName}
          onChange={(e) => onLegacyAuthorNameChange?.(e.target.value)}
          placeholder="Author name"
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            border: '1px solid var(--neutral-300)',
            borderRadius: '6px'
          }}
        />
        <p style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', marginTop: '0.25rem' }}>
          Run the authors migration to enable author selection
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '0.75rem', color: 'var(--neutral-500)' }}>
        Loading authors...
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '600',
          color: 'var(--neutral-800)',
          fontSize: '0.875rem'
        }}
      >
        Authors
      </label>

      {/* Selected Authors */}
      {selectedAuthors.length > 0 && (
        <div style={{ marginBottom: '0.75rem' }}>
          {selectedAuthors.map((author, index) => (
            <div
              key={author.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--neutral-100)',
                borderRadius: '6px',
                marginBottom: '0.5rem'
              }}
            >
              {/* Avatar */}
              {author.avatar_url ? (
                <img
                  src={author.avatar_url}
                  alt={author.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-blue)',
                    color: 'var(--white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}
                >
                  {author.name.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Name and Title */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{author.name}</div>
                {author.title && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>{author.title}</div>
                )}
              </div>

              {/* Order indicator */}
              <span style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
                #{index + 1}
              </span>

              {/* Reorder buttons */}
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    border: '1px solid var(--neutral-300)',
                    borderRadius: '4px',
                    backgroundColor: index === 0 ? 'var(--neutral-100)' : 'var(--white)',
                    cursor: index === 0 ? 'not-allowed' : 'pointer',
                    color: index === 0 ? 'var(--neutral-400)' : 'var(--neutral-700)'
                  }}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === selectedAuthors.length - 1}
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    border: '1px solid var(--neutral-300)',
                    borderRadius: '4px',
                    backgroundColor: index === selectedAuthors.length - 1 ? 'var(--neutral-100)' : 'var(--white)',
                    cursor: index === selectedAuthors.length - 1 ? 'not-allowed' : 'pointer',
                    color: index === selectedAuthors.length - 1 ? 'var(--neutral-400)' : 'var(--neutral-700)'
                  }}
                  title="Move down"
                >
                  ↓
                </button>
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemoveAuthor(author.id)}
                style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.875rem',
                  color: '#DC2626',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer'
                }}
                title="Remove author"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Author Dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '0.875rem',
            border: '1px solid var(--neutral-300)',
            borderRadius: '6px',
            backgroundColor: 'var(--white)',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span style={{ color: availableAuthors.length === 0 ? 'var(--neutral-400)' : 'var(--neutral-700)' }}>
            {availableAuthors.length === 0
              ? (authors.length === 0 ? 'No authors available' : 'All authors selected')
              : 'Add author...'}
          </span>
          <span style={{ fontSize: '0.75rem' }}>{showDropdown ? '▲' : '▼'}</span>
        </button>

        {showDropdown && availableAuthors.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'var(--white)',
              border: '1px solid var(--neutral-300)',
              borderRadius: '6px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              zIndex: 100,
              maxHeight: '250px',
              overflowY: 'auto',
              marginTop: '0.25rem'
            }}
          >
            {availableAuthors.map(author => (
              <button
                key={author.id}
                type="button"
                onClick={() => {
                  handleToggleAuthor(author.id);
                  setShowDropdown(false);
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  border: 'none',
                  borderBottom: '1px solid var(--neutral-100)',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--neutral-50)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {author.avatar_url ? (
                  <img
                    src={author.avatar_url}
                    alt={author.name}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-blue)',
                      color: 'var(--white)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}
                  >
                    {author.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{author.name}</div>
                  {author.title && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>{author.title}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {showDropdown && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99
          }}
          onClick={() => setShowDropdown(false)}
        />
      )}

      {/* Helper text */}
      <p style={{ fontSize: '0.75rem', color: 'var(--neutral-500)', marginTop: '0.5rem' }}>
        {selectedAuthors.length === 0
          ? 'Select one or more authors. First author is the primary author.'
          : `${selectedAuthors.length} author${selectedAuthors.length > 1 ? 's' : ''} selected`}
      </p>
    </div>
  );
}
