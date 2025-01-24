import { BlogPost } from './types';
import { kv } from '@vercel/kv';

const CACHE_TTL = 3600; // 1 hour

export async function getCachedPosts(blogName: string): Promise<BlogPost[] | null> {
    try {
        return await kv.get(`blog-posts:${blogName}`);
    } catch (error) {
        console.error("❌ 캐시 데이터 조회 오류: ", error);
        return null;
    }
}

export async function cachePosts(blogName: string, posts: BlogPost[]): Promise<void> {
    try {
        await kv.set(`blog-posts:${blogName}`, posts, { ex: CACHE_TTL });
    } catch (error) {
        console.error("❌ 캐시 데이터 저장 오류: ", error);
    }
}