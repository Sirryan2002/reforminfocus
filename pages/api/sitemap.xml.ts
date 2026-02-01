import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import type { Article, Cluster, Tag } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const siteUrl = 'https://blog.ryanlongo.net';

    // Fetch all published articles
    const { data: articles } = await supabase
      .from('articles')
      .select('slug, updated_at, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false });

    // Fetch all clusters
    const { data: clusters } = await supabase
      .from('clusters')
      .select('slug, created_at')
      .order('display_order');

    // Fetch all tags
    const { data: tags } = await supabase
      .from('tags')
      .select('slug, created_at');

    // Static pages
    const staticPages = [
      { url: '', changefreq: 'daily', priority: '1.0' },
      { url: '/topics', changefreq: 'weekly', priority: '0.9' },
      { url: '/understanding-reform', changefreq: 'monthly', priority: '0.8' },
      { url: '/research', changefreq: 'weekly', priority: '0.8' },
      { url: '/subscribe', changefreq: 'monthly', priority: '0.7' },
      { url: '/search', changefreq: 'monthly', priority: '0.6' },
      { url: '/contact', changefreq: 'monthly', priority: '0.6' },
      { url: '/privacy', changefreq: 'yearly', priority: '0.3' },
      { url: '/terms', changefreq: 'yearly', priority: '0.3' },
    ];

    // Build sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  ${staticPages
    .map(
      (page) => `<url>
    <loc>${siteUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('\n  ')}

  ${(articles as Article[] || [])
    .map(
      (article) => `<url>
    <loc>${siteUrl}/articles/${article.slug}</loc>
    <lastmod>${new Date(article.updated_at || article.published_at || '').toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('\n  ')}

  ${(clusters as Cluster[] || [])
    .map(
      (cluster) => `<url>
    <loc>${siteUrl}/topics/${cluster.slug}</loc>
    <lastmod>${new Date(cluster.created_at || '').toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('\n  ')}

  ${(tags as Tag[] || [])
    .map(
      (tag) => `<url>
    <loc>${siteUrl}/tags/${tag.slug}</loc>
    <lastmod>${new Date(tag.created_at || '').toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join('\n  ')}
</urlset>`;

    // Set appropriate headers
    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
}
