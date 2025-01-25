import type { NextApiRequest, NextApiResponse } from 'next';
import { crawlBlog } from '../../lib/crawler';
import { generateBadge, generateErrorBadge } from '../../lib/badge';
import { Theme } from '../../lib/types';

function validateRequest(req: NextApiRequest): { name: string; theme: Theme } | null {
  if (req.method !== 'GET') return null;

  const name = req.query.name as string;
  const theme = (req.query.theme as Theme) || 'default';
  
  if (!name || Array.isArray(name)) return null;
  
  return { name, theme };
}

async function handleBadgeGeneration(name: string, theme: Theme) {
  const posts = await crawlBlog(name);
  return generateBadge(posts, theme);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const validation = validateRequest(req);
    if (!validation) {
      res.setHeader('Content-Type', 'image/svg+xml');
      return res.status(400).send(generateErrorBadge());
    }
    
    const { name, theme } = validation;
    const svg = await handleBadgeGeneration(name, theme);
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.send(svg);
    
  } catch (error) {
    console.error('뱃지 생성 중 ❌ 오류 발생:', error);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(500).send(generateErrorBadge());
  }
}