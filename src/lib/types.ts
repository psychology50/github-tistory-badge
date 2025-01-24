export interface BlogPost {
    title: string;
    url: string;
    date: string;
    category: string;
    summary: string;
}

export type Theme = 'default' | 'dark' | 'vue' | 'blue' | 'kakao';