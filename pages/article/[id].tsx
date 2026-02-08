import { GetServerSideProps } from "next";
import Link from "next/link";
import Article, { ArticleHeader, ArticleBody } from "@/components/article";
import Navbar from "@/components/navbar";
import SEOHead from "@/components/SEOHead";
import AuthorByline, { AuthorBylineLegacy } from "@/components/AuthorByline";
import Head from "next/head";
import type { Article as ArticleType, AuthorSummary } from '@/types';
import { supabase } from "@/lib/supabase";

interface ArticleWithAuthors extends ArticleType {
    authors?: AuthorSummary[];
}

interface ArticlePageProps {
    article: ArticleWithAuthors | null;
    error?: string;
}

export default function Page({ article, error }: ArticlePageProps) {
    if (error || !article) {
        return (
            <>
                <SEOHead
                    title="Article Not Found"
                    description="The article you're looking for doesn't exist or has been removed."
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
                        Article Not Found
                    </h1>
                    <p style={{ marginBottom: '2rem' }}>
                        {error || "The article you're looking for doesn't exist."}
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

    // Get author names for SEO
    const authorNames = article.authors && article.authors.length > 0
        ? article.authors.map(a => a.name).join(', ')
        : article.author_name || "Reform in Focus";

    // Generate JSON-LD structured data for article
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.excerpt,
        author: article.authors && article.authors.length > 0
            ? article.authors.map(author => ({
                "@type": "Person",
                name: author.name,
                url: `https://blog.ryanlongo.net/authors/${author.slug}`
            }))
            : {
                "@type": "Person",
                name: article.author_name || "Reform in Focus"
            },
        publisher: {
            "@type": "Organization",
            name: "Reform in Focus",
            logo: {
                "@type": "ImageObject",
                url: "https://blog.ryanlongo.net/logo.png"
            }
        },
        datePublished: article.published_at || article.created_at,
        dateModified: article.updated_at || article.published_at || article.created_at,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://blog.ryanlongo.net/articles/${article.slug}`
        },
        image: article.featured_image_url || "https://blog.ryanlongo.net/og-default.png",
        articleSection: "Education",
        keywords: "Michigan education reform, K-12 policy, education analysis"
    };

    return (
        <>
            <SEOHead
                title={article.title}
                description={article.excerpt}
                canonical={`/articles/${article.slug}`}
                ogType="article"
                ogImage={article.featured_image_url || undefined}
                ogImageAlt={article.title}
                article={{
                    publishedTime: article.published_at || article.created_at,
                    modifiedTime: article.updated_at,
                    author: authorNames
                }}
            />

            {/* JSON-LD Structured Data */}
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </Head>

            <Navbar />

            <Article>
                <ArticleHeader title={article.title} subtitle={article.excerpt} />

                {/* Author Byline */}
                {article.authors && article.authors.length > 0 ? (
                    <AuthorByline
                        authors={article.authors}
                        publishedAt={article.published_at}
                        updatedAt={article.updated_at}
                    />
                ) : article.author_name ? (
                    <AuthorBylineLegacy
                        authorName={article.author_name}
                        publishedAt={article.published_at}
                    />
                ) : null}

                {article.featured_image_url && (
                    <div className="ArticleFeaturedImage">
                        <img
                            src={article.featured_image_url}
                            alt={article.title}
                            style={{
                                width: '100%',
                                height: 'auto',
                                marginBottom: '2.5rem'
                            }}
                        />
                    </div>
                )}
                <ArticleBody articleContent={article.content} />
            </Article>
        </>
    );
}

export const getServerSideProps: GetServerSideProps<ArticlePageProps> = async (context) => {
    const { id } = context.params || {};

    if (!id || isNaN(Number(id))) {
        return {
            props: {
                article: null,
                error: 'Invalid article ID'
            }
        };
    }

    try {
        // Fetch article
        const { data: articleData, error: articleError } = await supabase
            .from('articles')
            .select('*')
            .eq('easyid', Number(id))
            .single();

        if (articleError || !articleData) {
            return {
                notFound: true
            };
        }

        // Cast to ArticleType for proper typing
        const article = articleData as ArticleType;

        // Fetch authors for this article
        let authors: AuthorSummary[] = [];

        try {
            const { data: authorLinks, error: authorError } = await supabase
                .from('article_authors')
                .select(`
                    author_order,
                    authors (
                        id,
                        name,
                        slug,
                        avatar_url,
                        title
                    )
                `)
                .eq('article_id', article.id)
                .order('author_order', { ascending: true });

            if (!authorError && authorLinks && authorLinks.length > 0) {
                authors = (authorLinks as Array<{ author_order: number; authors: AuthorSummary | null }>)
                    .filter(link => link.authors !== null)
                    .map(link => link.authors as AuthorSummary);
            }
        } catch (authorErr) {
            // If authors table doesn't exist yet, just continue without authors
            console.log('Authors not available:', authorErr);
        }

        // Set cache headers
        context.res.setHeader(
            'Cache-Control',
            'public, s-maxage=60, stale-while-revalidate=300'
        );

        const articleWithAuthors: ArticleWithAuthors = {
            ...article,
            authors
        };

        return {
            props: {
                article: articleWithAuthors
            }
        };
    } catch (err) {
        console.error('Error fetching article:', err);
        return {
            props: {
                article: null,
                error: 'Failed to load article'
            }
        };
    }
};
