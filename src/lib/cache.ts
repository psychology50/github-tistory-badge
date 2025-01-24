import { BlogPost } from './types';
// import { kv } from '@vercel/kv';

// const CACHE_TTL = 3600; // 1 hour

// export async function getCachedPosts(blogName: string): Promise<BlogPost[] | null> {
//     try {
//         return await kv.get(`blog-posts:${blogName}`);
//     } catch (error) {
//         console.error("❌ 캐시 데이터 조회 오류: ", error);
//         return null;
//     }
// }

// export async function cachePosts(blogName: string, posts: BlogPost[]): Promise<void> {
//     try {
//         await kv.set(`blog-posts:${blogName}`, posts, { ex: CACHE_TTL });
//     } catch (error) {
//         console.error("❌ 캐시 데이터 저장 오류: ", error);
//     }
// }

const cache: Record<string, { data: BlogPost[]; expiresAt: number }> = {};

const CACHE_TTL = 3600 * 1000; // 1시간 (밀리초 단위)

export async function getCachedPosts(blogName: string): Promise<BlogPost[] | null> {
  try {
    const cacheKey = `blog-posts:${blogName}`;
    const cached = cache[cacheKey];
    
    if (!cached) {
      return null;
    }
    
    // 캐시 만료 체크
    if (Date.now() > cached.expiresAt) {
      delete cache[cacheKey];
      return null;
    }
    
    return cached.data;
  } catch (error) {
    console.error('Cache error:', error);
    return null;
  }
}

export async function cachePosts(blogName: string, posts: BlogPost[]): Promise<void> {
  try {
    const cacheKey = `blog-posts:${blogName}`;
    cache[cacheKey] = {
      data: posts,
      expiresAt: Date.now() + CACHE_TTL
    };
  } catch (error) {
    console.error('Cache set error:', error);
  }
}