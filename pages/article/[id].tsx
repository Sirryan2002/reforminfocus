import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Article, { ArticleHeader, ArticleBody, articleType } from "@/components/article";
import Navbar from "@/components/navbar";

export default function Page() {
    const router = useRouter();
    const { id } = router.query;

    // Don't try to use id until router is ready
    if (!router.isReady) {
        return (
            <>
                <Navbar />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading...</p>
                </div>
            </>
        );
    }

    const articleID = id ? Number(id) : null;

    console.log('Article ID from URL:', articleID);

    return (
        <>
            <Navbar />
            {articleID !== null && <ArticleContainer articleId={articleID} />}
        </>
    );
}

const ArticleContainer = ({ articleId }: { articleId: number }) => {
    const [article, setArticle] = useState<articleType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Don't fetch if articleId is invalid
        if (!articleId || isNaN(articleId)) {
            setLoading(false);
            setError('Invalid article ID');
            return;
        }

        const fetchArticle = async () => {
            try {
                console.log('Fetching article with ID:', articleId);
                
                const res = await fetch('/api/getArticle', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ articleId: articleId }),
                });
                
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                
                const response = await res.json();
                console.log('Fetched article:', response);
                
                setArticle(response.data);

            } catch (error) {
                console.error('Error fetching article:', error);
                setError('Failed to load article');
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [articleId]); // Add articleId as dependency

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading Article...</p>
            </div>
        );
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!article) {
        return <p>Article not found.</p>;
    }

    return (
        <Article>
            <ArticleHeader title={article.title} subtitle={article.slug} />
            <ArticleBody articleContent={article.content} />
        </Article>
    );
}