import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import Article, { ArticleHeader, ArticleBody, articleType } from "@/components/article";
import Navbar from "@/components/navbar";
import Head from "next/head";

export default function ArticlePage() {
    const router = useRouter();
    const { slug } = router.query;

    // Don't try to use slug until router is ready
    if (!router.isReady) {
        return (
            <>
                <Head>
                    <title>Loading... - Reform in Focus</title>
                </Head>
                <Navbar />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading...</p>
                </div>
            </>
        );
    }

    const articleSlug = slug ? String(slug) : null;

    return (
        <>
            <Navbar />
            {articleSlug !== null && <ArticleContainer articleSlug={articleSlug} />}
        </>
    );
}

const ArticleContainer = ({ articleSlug }: { articleSlug: string }) => {
    const [article, setArticle] = useState<articleType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!articleSlug) {
            setLoading(false);
            setError('Invalid article slug');
            return;
        }

        const fetchArticle = async () => {
            try {
                const res = await fetch('/api/getArticleBySlug', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ slug: articleSlug }),
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const response = await res.json();

                if (response.error) {
                    throw new Error(response.error);
                }

                setArticle(response.data);

            } catch (error) {
                console.error('Error fetching article:', error);
                setError(error instanceof Error ? error.message : 'Failed to load article');
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [articleSlug]);

    if (loading) {
        return (
            <>
                <Head>
                    <title>Loading... - Reform in Focus</title>
                </Head>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading Article...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Head>
                    <title>Error - Reform in Focus</title>
                </Head>
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
                    <p style={{ marginBottom: '2rem' }}>{error}</p>
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

    if (!article) {
        return (
            <>
                <Head>
                    <title>Article Not Found - Reform in Focus</title>
                </Head>
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
                    <p style={{ marginBottom: '2rem' }}>The article you're looking for doesn't exist.</p>
                    <a
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
                    </a>
                </div>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>{article.title} - Reform in Focus</title>
                <meta name="description" content={article.excerpt} />
            </Head>
            <Article>
                <ArticleHeader title={article.title} subtitle={article.slug} />
                <ArticleBody articleContent={article.content} />
            </Article>
        </>
    );
}
