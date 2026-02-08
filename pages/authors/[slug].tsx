import { GetServerSideProps } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import SEOHead from "@/components/SEOHead";
import Head from "next/head";
import type { Author, Article as ArticleType } from '@/types';
import { supabase } from "@/lib/supabase";

interface AuthorSocialLinks {
    twitter?: string;
    linkedin?: string;
    email?: string;
    website?: string;
}

interface AuthorWithArticles extends Author {
    articles: ArticleType[];
}

interface AuthorPageProps {
    author: AuthorWithArticles | null;
    error?: string;
}

export default function AuthorPage({ author, error }: AuthorPageProps) {
    if (error || !author) {
        return (
            <>
                <SEOHead
                    title="Author Not Found"
                    description="The author you're looking for doesn't exist."
                    noindex={true}
                />
                <Navbar />
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 1rem',
                    color: 'var(--neutral-700)'
                }}>
                    <h1 style={{
                        fontSize: '2rem',
                        marginBottom: '1rem',
                        fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
                    }}>
                        Author Not Found
                    </h1>
                    <p style={{ marginBottom: '2rem' }}>
                        {error || "The author you're looking for doesn't exist."}
                    </p>
                    <Link
                        href="/"
                        style={{
                            display: 'inline-block',
                            padding: '0.75rem 1.5rem',
                            backgroundColor: 'var(--primary-blue)',
                            color: 'var(--white)',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontWeight: '600'
                        }}
                    >
                        Back to Home
                    </Link>
                </div>
            </>
        );
    }

    // Parse social links
    const socialLinks = (author.social_links as AuthorSocialLinks) || {};

    // JSON-LD for author
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: author.name,
        url: `https://blog.ryanlongo.net/authors/${author.slug}`,
        description: author.bio,
        image: author.avatar_url,
        jobTitle: author.title,
        worksFor: {
            "@type": "Organization",
            name: "Reform in Focus",
            url: "https://blog.ryanlongo.net"
        },
        sameAs: [
            socialLinks.twitter,
            socialLinks.linkedin,
            socialLinks.website
        ].filter(Boolean)
    };

    return (
        <>
            <SEOHead
                title={`${author.name} - Author`}
                description={author.bio || `Articles by ${author.name} on Reform in Focus`}
                canonical={`/authors/${author.slug}`}
                ogImage={author.avatar_url || undefined}
            />

            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </Head>

            <Navbar />

            <main id="main-content" style={styles.main}>
                {/* Author Header */}
                <header style={styles.header}>
                    <div style={styles.headerContent}>
                        {author.avatar_url ? (
                            <img
                                src={author.avatar_url}
                                alt={author.name}
                                style={styles.avatar}
                            />
                        ) : (
                            <div style={styles.avatarPlaceholder}>
                                {author.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div style={styles.headerText}>
                            <h1 style={styles.name}>{author.name}</h1>
                            {author.title && (
                                <p style={styles.title}>{author.title}</p>
                            )}
                        </div>
                    </div>

                    {author.bio && (
                        <p style={styles.bio}>{author.bio}</p>
                    )}

                    {/* Social Links */}
                    {Object.keys(socialLinks).length > 0 && (
                        <div style={styles.socialLinks}>
                            {socialLinks.twitter && (
                                <a
                                    href={`https://twitter.com/${socialLinks.twitter.replace('@', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={styles.socialLink}
                                >
                                    Twitter/X
                                </a>
                            )}
                            {socialLinks.linkedin && (
                                <a
                                    href={socialLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={styles.socialLink}
                                >
                                    LinkedIn
                                </a>
                            )}
                            {socialLinks.email && (
                                <a
                                    href={`mailto:${socialLinks.email}`}
                                    style={styles.socialLink}
                                >
                                    Email
                                </a>
                            )}
                            {socialLinks.website && (
                                <a
                                    href={socialLinks.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={styles.socialLink}
                                >
                                    Website
                                </a>
                            )}
                        </div>
                    )}
                </header>

                {/* Articles by Author */}
                <section style={styles.articlesSection}>
                    <h2 style={styles.sectionTitle}>
                        Articles by {author.name}
                        <span style={styles.articleCount}>({author.articles.length})</span>
                    </h2>

                    {author.articles.length > 0 ? (
                        <div style={styles.articlesList}>
                            {author.articles.map(article => (
                                <article key={article.id} style={styles.articleCard}>
                                    {article.featured_image_url && (
                                        <Link href={`/articles/${article.slug}`}>
                                            <img
                                                src={article.featured_image_url}
                                                alt={article.title}
                                                style={styles.articleImage}
                                            />
                                        </Link>
                                    )}
                                    <div style={styles.articleContent}>
                                        <Link href={`/articles/${article.slug}`} style={styles.articleTitleLink}>
                                            <h3 style={styles.articleTitle}>{article.title}</h3>
                                        </Link>
                                        <p style={styles.articleExcerpt}>{article.excerpt}</p>
                                        <div style={styles.articleMeta}>
                                            {article.published_at && (
                                                <time dateTime={article.published_at} style={styles.articleDate}>
                                                    {new Date(article.published_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </time>
                                            )}
                                            {article.read_time_minutes && (
                                                <span style={styles.readTime}>
                                                    {article.read_time_minutes} min read
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p style={styles.noArticles}>No articles published yet.</p>
                    )}
                </section>
            </main>
        </>
    );
}

export const getServerSideProps: GetServerSideProps<AuthorPageProps> = async (context) => {
    const { slug } = context.params || {};

    if (!slug || typeof slug !== 'string') {
        return {
            props: {
                author: null,
                error: 'Invalid author slug'
            }
        };
    }

    try {
        // Fetch author
        const { data: authorData, error: authorError } = await supabase
            .from('authors')
            .select('*')
            .eq('slug', slug)
            .single();

        if (authorError || !authorData) {
            return {
                notFound: true
            };
        }

        const author = authorData as Author;

        // Fetch articles by this author
        let articles: ArticleType[] = [];

        try {
            const { data: articleLinks } = await supabase
                .from('article_authors')
                .select('article_id')
                .eq('author_id', author.id);

            if (articleLinks && articleLinks.length > 0) {
                // Cast to proper type
                const typedLinks = articleLinks as Array<{ article_id: number }>;
                const articleIds = typedLinks.map(link => link.article_id);

                const { data: articlesData } = await supabase
                    .from('articles')
                    .select('*')
                    .in('id', articleIds)
                    .eq('published', true)
                    .order('published_at', { ascending: false });

                if (articlesData) {
                    articles = articlesData as ArticleType[];
                }
            }
        } catch (articleErr) {
            console.log('Error fetching author articles:', articleErr);
        }

        // Set cache headers
        context.res.setHeader(
            'Cache-Control',
            'public, s-maxage=300, stale-while-revalidate=600'
        );

        return {
            props: {
                author: {
                    ...author,
                    articles
                }
            }
        };
    } catch (err) {
        console.error('Error fetching author:', err);
        return {
            props: {
                author: null,
                error: 'Failed to load author'
            }
        };
    }
};

const styles: { [key: string]: React.CSSProperties } = {
    main: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 1rem'
    },
    header: {
        marginBottom: '3rem',
        paddingBottom: '2rem',
        borderBottom: '1px solid var(--neutral-200)'
    },
    headerContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        marginBottom: '1.5rem'
    },
    avatar: {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        objectFit: 'cover' as const
    },
    avatarPlaceholder: {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-blue)',
        color: 'var(--white)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem',
        fontWeight: '600',
        fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
    },
    headerText: {
        flex: 1
    },
    name: {
        fontSize: '2.5rem',
        fontWeight: '700',
        fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
        color: 'var(--neutral-900)',
        margin: '0 0 0.5rem 0'
    },
    title: {
        fontSize: '1.125rem',
        color: 'var(--neutral-600)',
        margin: 0,
        fontFamily: "Georgia, 'Times New Roman', serif"
    },
    bio: {
        fontSize: '1.125rem',
        lineHeight: '1.7',
        color: 'var(--neutral-700)',
        fontFamily: "Georgia, 'Times New Roman', serif",
        margin: '0 0 1.5rem 0'
    },
    socialLinks: {
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap' as const
    },
    socialLink: {
        display: 'inline-block',
        padding: '0.5rem 1rem',
        backgroundColor: 'var(--neutral-100)',
        color: 'var(--neutral-700)',
        textDecoration: 'none',
        borderRadius: '4px',
        fontSize: '0.875rem',
        fontWeight: '500',
        transition: 'background-color 0.2s'
    },
    articlesSection: {
        marginTop: '2rem'
    },
    sectionTitle: {
        fontSize: '1.5rem',
        fontWeight: '700',
        fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
        color: 'var(--neutral-900)',
        marginBottom: '1.5rem'
    },
    articleCount: {
        fontWeight: '400',
        color: 'var(--neutral-500)',
        marginLeft: '0.5rem'
    },
    articlesList: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '2rem'
    },
    articleCard: {
        display: 'flex',
        gap: '1.5rem',
        paddingBottom: '2rem',
        borderBottom: '1px solid var(--neutral-200)'
    },
    articleImage: {
        width: '200px',
        height: '130px',
        objectFit: 'cover' as const,
        borderRadius: '4px',
        flexShrink: 0
    },
    articleContent: {
        flex: 1,
        minWidth: 0
    },
    articleTitleLink: {
        textDecoration: 'none'
    },
    articleTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
        color: 'var(--neutral-900)',
        margin: '0 0 0.75rem 0',
        lineHeight: '1.3'
    },
    articleExcerpt: {
        fontSize: '1rem',
        color: 'var(--neutral-600)',
        fontFamily: "Georgia, 'Times New Roman', serif",
        margin: '0 0 0.75rem 0',
        lineHeight: '1.5',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical' as const,
        overflow: 'hidden'
    },
    articleMeta: {
        display: 'flex',
        gap: '1rem',
        fontSize: '0.875rem',
        color: 'var(--neutral-500)'
    },
    articleDate: {
        color: 'var(--neutral-500)'
    },
    readTime: {
        color: 'var(--neutral-500)'
    },
    noArticles: {
        color: 'var(--neutral-600)',
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontStyle: 'italic'
    }
};
