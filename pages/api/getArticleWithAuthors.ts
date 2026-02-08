import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import type { Article, AuthorSummary, ArticleWithAuthors } from '@/types';

type ResponseData = {
  data?: ArticleWithAuthors;
  error?: string;
  message?: string;
};

/**
 * API route to fetch a single article with its authors
 * POST /api/getArticleWithAuthors
 * Body: { slug: string } or { id: number }
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug, id } = req.body;

  if (!slug && !id) {
    return res.status(400).json({ error: 'Missing slug or id parameter' });
  }

  try {
    // Build query based on slug or id
    let query = supabase
      .from('articles')
      .select('*')
      .eq('published', true);

    if (slug) {
      query = query.eq('slug', slug);
    } else if (id) {
      query = query.eq('easyid', id);
    }

    const { data: articleData, error: articleError } = await query.single();

    if (articleError || !articleData) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Cast to Article type
    const article = articleData as Article;

    // Fetch authors for this article
    let authors: AuthorSummary[] = [];

    try {
      const { data: authorLinks, error: authorLinksError } = await supabase
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

      // Extract authors from the join result
      if (!authorLinksError && authorLinks && authorLinks.length > 0) {
        authors = (authorLinks as Array<{ author_order: number; authors: AuthorSummary | null }>)
          .filter(link => link.authors !== null)
          .map(link => link.authors as AuthorSummary);
      }
    } catch (authorErr) {
      // Authors table might not exist yet
      console.log('Authors not available:', authorErr);
    }

    // Combine article with authors
    const articleWithAuthors: ArticleWithAuthors = {
      ...article,
      authors
    };

    // Set cache headers for Vercel Edge
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    return res.status(200).json({
      message: 'Article retrieved successfully',
      data: articleWithAuthors
    });

  } catch (err) {
    console.error('Error fetching article with authors:', err);
    return res.status(500).json({
      error: 'Failed to retrieve article',
    });
  }
}
