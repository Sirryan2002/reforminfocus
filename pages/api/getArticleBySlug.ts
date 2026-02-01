import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

type ApiResponse = {
  data?: any;
  error?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { slug } = req.body;

    if (!slug) {
      return res.status(400).json({ error: 'Article slug is required' });
    }

    // Fetch article by slug
    const { data: article, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('published', true) // Only return published articles
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch article' });
    }

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    return res.status(200).json({
      data: article,
      message: 'Article fetched successfully'
    });

  } catch (error) {
    console.error('Error in getArticleBySlug:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
