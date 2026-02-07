import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { searchRateLimiter } from '@/lib/rateLimit';
import type { ApiResponse, Article } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Article[]>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting: 30 requests per minute per IP
  try {
    await searchRateLimiter.check(req, res, 30);
  } catch {
    return; // Rate limiter already sent response
  }

  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const searchTerm = q.trim();

  if (searchTerm.length < 2) {
    return res.status(400).json({ error: 'Search query must be at least 2 characters' });
  }

  try {
    // Search across title, excerpt, and content
    // Using ilike for case-insensitive pattern matching
    const searchPattern = `%${searchTerm}%`;

    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .or(`title.ilike.${searchPattern},excerpt.ilike.${searchPattern},content.ilike.${searchPattern}`)
      .order('published_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      data: articles as Article[],
      message: `Found ${articles?.length || 0} results`,
    });
  } catch (error) {
    console.error('Error searching articles:', error);
    res.status(500).json({
      error: 'Failed to search articles',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
