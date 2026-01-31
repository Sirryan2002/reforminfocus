import Navbar from "@/components/navbar";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Article, { ArticleHeader, ArticleBody, ArticleFigure, articleType } from "@/components/article";
import { useEffect, useState } from "react";



export default function Articles() {

    return (
    <>
        <Navbar />
        <ArticleList />
    </>);
}



const ArticleList = () => {
    const [articles, setArticles] = useState<articleType[]>([]);
    const [loading, setLoading] = useState(true);




    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await fetch('/api/getArticles');
                if (!res.ok) {
                    throw new Error('Failed to fetch articles');
                }
                const response = await res.json();
                console.log('Fetched articles:', response.data);
                setArticles(response.data);

            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        };

        fetchArticles().finally(() => setLoading(false));
    }, []);


    if (loading) {
        return (
            <>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading Articles...</p>
                </div>
            </>
        );
    }

    return (
        <div>
            <p>{articles.length} articles found</p>
            {articles.map((article: articleType) => (
                <ArticleCard 
                    key={article.id}
                    title={article.title}
                    subtitle={article.slug}
                    shortcontent={article.excerpt}
                />
            ))}
        </div>
    );
};

// 
// Article Header component
//
export const ArticleCard = ({ title, subtitle, shortcontent }: { title: string, subtitle: string, shortcontent: string }) => {
  return (
    <div>
        <header className='ArticleHeader'>
            <hgroup>
            <h3>{title}</h3>
            <p>{subtitle}</p>
            </hgroup>
        </header>
        <article className="">
            {shortcontent}
        </article>
    </div>
  );
}