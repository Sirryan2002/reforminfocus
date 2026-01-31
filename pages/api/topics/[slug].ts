import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import type { Article, Cluster, Tag, ApiResponse } from '@/types';

type ArticleWithTags = Article & {
  tags: Tag[];
};

type ClusterWithArticles = Cluster & {
  articles: ArticleWithTags[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ClusterWithArticles>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Cluster slug is required' });
  }

  try {
    // Get cluster by slug
    const { data: cluster, error: clusterError } = await supabase
      .from('clusters')
      .select('*')
      .eq('slug', slug)
      .single();

    if (clusterError || !cluster) {
      return res.status(404).json({ error: 'Cluster not found' });
    }

    const typedCluster = cluster as Cluster;

    // Get tag IDs for this cluster
    const { data: clusterTags } = await supabase
      .from('cluster_tags')
      .select('tag_id')
      .eq('cluster_id', typedCluster.id);

    const tagIds = (clusterTags as Array<{ tag_id: number }> | null)?.map(ct => ct.tag_id) || [];

    if (tagIds.length === 0) {
      return res.status(200).json({
        message: 'Cluster retrieved successfully',
        data: { ...typedCluster, articles: [] },
      });
    }

    // Get articles with these tags
    const { data: articleTags } = await supabase
      .from('article_tags')
      .select('article_id, tag_id')
      .in('tag_id', tagIds);

    const articleIds = [...new Set((articleTags as Array<{ article_id: number; tag_id: number }> | null)?.map(at => at.article_id) || [])];

    if (articleIds.length === 0) {
      return res.status(200).json({
        message: 'Cluster retrieved successfully',
        data: { ...typedCluster, articles: [] },
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
          tags = tagsData || [];
        }

        return {
          ...article,
          tags,
        };
      })
    );

    res.status(200).json({
      message: 'Cluster retrieved successfully',
      data: {
        ...typedCluster,
        articles: articlesWithTags,
      },
    });
  } catch (error) {
    console.error('Error retrieving cluster:', error);
    res.status(500).json({
      error: 'Failed to retrieve cluster',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
