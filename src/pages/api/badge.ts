import type { NextApiRequest, NextApiResponse } from 'next';
import { crawlBlog } from '../../lib/crawler';
import { getCachedPosts, cachePosts } from '../../lib/cache';
import { generateBadge, generateErrorBadge } from '../../lib/badge';
import { Theme } from '../../lib/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end('Method not allowed');
  }

  const { name, theme = 'default' } = req.query;
  
  if (!name || Array.isArray(name)) {
    return res.status(400).send(generateErrorBadge());
  }

  try {
    const cached = await getCachedPosts(name);
    if (cached) {
      res.setHeader('Content-Type', 'image/svg+xml');
      return res.send(generateBadge(cached, theme as Theme));
    }
    
    const posts = await crawlBlog(name);
    
    await cachePosts(name, posts);
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(generateBadge(posts, theme as Theme));
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(500).send(generateErrorBadge());
  }
}