import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import type { ApiResponse, Article } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Article[]>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch ALL articles (including unpublished) for admin
    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      data: articles as Article[],
      message: `Found ${articles?.length || 0} articles`,
    });
  } catch (error) {
    console.error('Error fetching admin articles:', error);
    res.status(500).json({
      error: 'Failed to fetch articles',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
