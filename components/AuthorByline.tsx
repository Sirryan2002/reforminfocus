import Link from 'next/link';
import type { AuthorSummary } from '@/types';

interface AuthorBylineProps {
  authors: AuthorSummary[];
  publishedAt?: string | null;
  updatedAt?: string | null;
  showAvatars?: boolean;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Formats a date string for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * AuthorByline component - displays article author(s) with avatars and dates
 * Supports single or multiple authors with links to author pages
 */
export default function AuthorByline({
  authors,
  publishedAt,
  updatedAt,
  showAvatars = true,
  size = 'medium'
}: AuthorBylineProps) {
  // Handle case where no authors exist (fall back to legacy author_name)
  if (!authors || authors.length === 0) {
    return null;
  }

  const avatarSizes = {
    small: 32,
    medium: 48,
    large: 64
  };

  const avatarSize = avatarSizes[size];

  // Check if article was updated after publication
  const wasUpdated = updatedAt && publishedAt &&
    new Date(updatedAt).getTime() > new Date(publishedAt).getTime() + 86400000; // More than 24 hours later

  return (
    <div className="author-byline" style={styles.container}>
      {/* Author Avatars */}
      {showAvatars && (
        <div style={styles.avatarContainer}>
          {authors.map((author, index) => (
            <Link
              key={author.id}
              href={`/authors/${author.slug}`}
              style={{
                ...styles.avatarLink,
                marginLeft: index > 0 ? '-12px' : '0',
                zIndex: authors.length - index
              }}
            >
              {author.avatar_url ? (
                <img
                  src={author.avatar_url}
                  alt={author.name}
                  width={avatarSize}
                  height={avatarSize}
                  style={{
                    ...styles.avatar,
                    width: avatarSize,
                    height: avatarSize
                  }}
                />
              ) : (
                <div
                  style={{
                    ...styles.avatarPlaceholder,
                    width: avatarSize,
                    height: avatarSize,
                    fontSize: avatarSize * 0.4
                  }}
                >
                  {author.name.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Author Info */}
      <div style={styles.info}>
        {/* Author Names */}
        <div style={styles.names}>
          <span style={styles.byText}>by </span>
          {authors.map((author, index) => (
            <span key={author.id}>
              <Link href={`/authors/${author.slug}`} style={styles.authorLink}>
                {author.name}
              </Link>
              {index < authors.length - 2 && ', '}
              {index === authors.length - 2 && ' and '}
            </span>
          ))}
        </div>

        {/* Publication Date */}
        {publishedAt && (
          <div style={styles.dates}>
            <time dateTime={publishedAt} style={styles.date}>
              {formatDate(publishedAt)}
            </time>
            {wasUpdated && updatedAt && (
              <span style={styles.updated}>
                {' '}(Updated <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>)
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Compact author byline for article cards
 */
export function AuthorBylineCompact({ authors }: { authors: AuthorSummary[] }) {
  if (!authors || authors.length === 0) {
    return null;
  }

  const authorNames = authors.map(a => a.name).join(', ');

  return (
    <span style={styles.compact}>
      By {authorNames}
    </span>
  );
}

/**
 * Legacy fallback for articles without author relations
 */
export function AuthorBylineLegacy({
  authorName,
  publishedAt
}: {
  authorName: string | null;
  publishedAt?: string | null;
}) {
  if (!authorName) {
    return null;
  }

  return (
    <div className="author-byline-legacy" style={styles.container}>
      <div style={styles.info}>
        <div style={styles.names}>
          <span style={styles.byText}>by </span>
          <span style={styles.legacyName}>{authorName}</span>
        </div>
        {publishedAt && (
          <div style={styles.dates}>
            <time dateTime={publishedAt} style={styles.date}>
              {formatDate(publishedAt)}
            </time>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid var(--neutral-200)'
  },
  avatarContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatarLink: {
    display: 'block',
    position: 'relative',
    borderRadius: '50%',
    border: '2px solid var(--white)',
    overflow: 'hidden'
  },
  avatar: {
    borderRadius: '50%',
    objectFit: 'cover' as const,
    display: 'block'
  },
  avatarPlaceholder: {
    borderRadius: '50%',
    backgroundColor: 'var(--primary-blue)',
    color: 'var(--white)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
  },
  info: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem'
  },
  names: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: '1rem',
    color: 'var(--neutral-800)'
  },
  byText: {
    color: 'var(--neutral-600)'
  },
  authorLink: {
    color: 'var(--neutral-900)',
    textDecoration: 'none',
    fontWeight: '600'
  },
  dates: {
    fontSize: '0.875rem',
    color: 'var(--neutral-600)',
    fontFamily: "Georgia, 'Times New Roman', serif"
  },
  date: {
    color: 'var(--neutral-600)'
  },
  updated: {
    color: 'var(--neutral-500)',
    fontStyle: 'italic'
  },
  compact: {
    fontSize: '0.875rem',
    color: 'var(--neutral-600)',
    fontFamily: "Georgia, 'Times New Roman', serif"
  },
  legacyName: {
    color: 'var(--neutral-900)',
    fontWeight: '600'
  }
};
