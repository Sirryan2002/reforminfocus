import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import type { Cluster, Tag, ApiResponse } from '@/types';

type ClusterWithTags = Cluster & {
  tags: Tag[];
  article_count?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ClusterWithTags[]>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all clusters ordered by display_order
    const { data: clusters, error: clustersError } = await supabase
      .from('clusters')
      .select('*')
      .order('display_order', { ascending: true });

    if (clustersError) {
      throw clustersError;
    }

    if (!clusters || clusters.length === 0) {
      return res.status(200).json({ data: [] });
    }

    // For each cluster, get its tags and article count
    const clustersWithData = await Promise.all(
      clusters.map(async (cluster: Cluster) => {
        // Get tags for this cluster
        const { data: clusterTags } = await supabase
          .from('cluster_tags')
          .select('tag_id')
          .eq('cluster_id', cluster.id);

        const tagIds = (clusterTags as Array<{ tag_id: number }> | null)?.map(ct => ct.tag_id) || [];

        let tags: Tag[] = [];
        if (tagIds.length > 0) {
          const { data: tagsData } = await supabase
            .from('tags')
            .select('*')
            .in('id', tagIds);
          tags = tagsData || [];
        }

        // Count articles in this cluster
        let articleCount = 0;
        if (tagIds.length > 0) {
          const { count } = await supabase
            .from('article_tags')
            .select('article_id', { count: 'exact', head: true })
            .in('tag_id', tagIds);
          articleCount = count || 0;
        }

        return {
          ...cluster,
          tags,
          article_count: articleCount,
        };
      })
    );

    res.status(200).json({
      message: 'Clusters retrieved successfully',
      data: clustersWithData,
    });
  } catch (error) {
    console.error('Error retrieving clusters:', error);
    res.status(500).json({
      error: 'Failed to retrieve clusters',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
