import { GetServerSideProps } from "next";
import Link from "next/link";
import Article, { ArticleHeader, ArticleBody } from "@/components/article";
import Navbar from "@/components/navbar";
import SEOHead from "@/components/SEOHead";
import Head from "next/head";
import type { Article as ArticleType } from '@/types';
import { supabase } from "@/lib/supabase";

interface ArticlePageProps {
    article: ArticleType | null;
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

    // Generate JSON-LD structured data for article
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.excerpt,
        author: {
            "@type": "Organization",
            name: "Reform in Focus",
            url: "https://blog.ryanlongo.net"
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
                    author: article.author_name || "Reform in Focus"
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
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('easyid', Number(id))
            .single();

        if (error || !data) {
            return {
                notFound: true
            };
        }

        // Redirect to slug-based URL for SEO (optional but recommended)
        // Uncomment if you want to redirect /article/1 to /articles/the-slug
        // return {
        //     redirect: {
        //         destination: `/articles/${data.slug}`,
        //         permanent: true
        //     }
        // };

        return {
            props: {
                article: data as ArticleType
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
