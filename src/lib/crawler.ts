import { BlogPost } from './types';
import * as cheerio from 'cheerio';

export async function crawlBlog(name: string): Promise<BlogPost[]> {
    try {
        const url = `https://${name}.tistory.com`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`❌ 블로그 주소(${url})에 접근할 수 없습니다.`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const posts: BlogPost[] = [];

        $('.post').slice(0, 4).each((_, element) => {
            const $post = $(element);
            const link = $post.find('a.link').attr('href') || '';
            
            const post: BlogPost = {
                title: $post.find('div.tit').text(),
                url: link.startsWith('http') ? link : `${url}${link}`,
                date: $post.find('.date').text(),
                category: $post.find('.category').text(),
                summary: $post.find('.summary').text(),
            };

            posts.push(post);
        });

        return posts;

    } catch (error) {
        console.error("❌ 크롤링 중 오류 발생:", error);
        throw error;
    }
}