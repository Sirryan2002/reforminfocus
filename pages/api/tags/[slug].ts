import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import type { Article, Tag, ApiResponse } from '@/types';

type ArticleWithTags = Article & {
  tags: Tag[];
};

type TagWithArticles = Tag & {
  articles: ArticleWithTags[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TagWithArticles>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Tag slug is required' });
  }

  try {
    // Get tag by slug
    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .select('*')
      .eq('slug', slug)
      .single();

    if (tagError || !tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    const typedTag = tag as Tag;

    // Get article IDs with this tag
    const { data: articleTags } = await supabase
      .from('article_tags')
      .select('article_id')
      .eq('tag_id', typedTag.id);

    const articleIds = (articleTags as Array<{ article_id: number }> | null)?.map(at => at.article_id) || [];

    if (articleIds.length === 0) {
      return res.status(200).json({
        message: 'Tag retrieved successfully',
        data: { ...typedTag, articles: [] },
      });
    }

    // Get published articles
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('*')
      .in('id', articleIds)
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (articlesError) {
      throw articlesError;
    }

    // For each article, get its tags
    const articlesWithTags = await Promise.all(
      (articles as Article[] || []).map(async (article) => {
        const { data: articleTagsData } = await supabase
          .from('article_tags')
          .select('tag_id')
          .eq('article_id', article.id);

        const articleTagIds = (articleTagsData as Array<{ tag_id: number }> | null)?.map(at => at.tag_id) || [];

        let tags: Tag[] = [];
        if (articleTagIds.length > 0) {
          const { data: tagsData } = await supabase
            .from('tags')
            .select('*')
            .in('id', articleTagIds);
          tags = (tagsData as Tag[] | null) || [];
        }

        return {
          ...article,
          tags,
        };
      })
    );

    res.status(200).json({
      message: 'Tag retrieved successfully',
      data: {
        ...typedTag,
        articles: articlesWithTags,
      },
    });
  } catch (error) {
    console.error('Error retrieving tag:', error);
    res.status(500).json({
      error: 'Failed to retrieve tag',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
