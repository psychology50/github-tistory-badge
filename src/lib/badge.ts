import { BlogPost, Theme } from './types';

interface ThemeColors {
  bg: string;
  border: string;
  text: string;
  link: string;
}

const ThemeColors: Record<Theme, ThemeColors> = {
    default: {
      bg: '#ffffff',
      border: '#e4e2e2',
      text: '#333333',
      link: '#0366d6'
    },
    dark: {
      bg: '#2f3542',
      border: '#4a4a4a',
      text: '#ffffff',
      link: '#58a6ff'
    },
    vue: {
        bg: '#42b883',
        border: '#35495e',
        text: '#35495e',
        link: '#35495e'
    },
    blue: {
        bg: '#007ec6',
        border: '#005a8d',
        text: '#ffffff',
        link: '#ffffff'
    },
    kakao: {
        bg: '#f9e000',
        border: '#ffcd00',
        text: '#3d3d3d',
        link: '#3d3d3d'
    }
};

function escapeXml(unsafe: string): string {
    return unsafe.replace(/[&<>"']/g, (char) => {
        switch (char) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&apos;';
            default: return char;
        }
    });
}

function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
}

function generatePostItem(post: BlogPost, index: number, colors: ThemeColors): string {
    const escapedTitle = escapeXml(truncateText(post.title, 65));
    const escapedCategory = escapeXml(truncateText(post.category, 35));
    
    return `<g transform="translate(0, ${index * 75})">
        <!-- 호버 배경 -->
        <rect x="-10" y="-20" width="830" height="65"
              fill="transparent" 
              rx="4">
            <animate attributeName="fill" 
                     from="transparent" to="${colors.border}22" 
                     begin="mouseover" dur="0.2s" fill="freeze"/>
            <animate attributeName="fill" 
                     from="${colors.border}22" to="transparent" 
                     begin="mouseout" dur="0.2s" fill="freeze"/>
        </rect>

        <!-- 카테고리 (상단) -->
        <text font-family="Arial" font-size="18" fill="${colors.text}" opacity="0.7"> 
            ${escapedCategory}
        </text>

        <!-- 날짜 (상단 우측) -->
        <text x="820" y="0" text-anchor="end" font-family="Arial" font-size="18"
              fill="${colors.text}" opacity="0.7">
            ${post.date}
        </text>

        <!-- 제목 (하단) -->
        <a href="${post.url}" target="_blank">
            <text font-family="Arial, sans-serif" font-size="20" fill="${colors.link}"
                  x="0" y="40">
                ${escapedTitle}
            </text>
        </a>
    </g>`;
}

export function generateBadge(posts: BlogPost[], theme: Theme = 'default'): string {
    const colors = ThemeColors[theme];
    
    return `<svg xmlns="http://www.w3.org/2000/svg" width="880" height="400"
          viewBox="0 0 880 400">
        <!-- 배경 -->
        <rect width="880" height="400" rx="10" fill="${colors.bg}" stroke="${colors.border}" stroke-width="1.5"/>
        
        <!-- 헤더 -->
        <text x="30" y="50" font-family="Arial" font-size="24" font-weight="bold" fill="${colors.text}">
            🔥 Recent Blog Posts
        </text>
        
        <!-- 구분선 -->
        <line x1="30" y1="70" x2="850" y2="70"
              stroke="${colors.border}" stroke-width="1.5" opacity="0.5"/>
        
        <!-- 포스트 목록 -->
        <g transform="translate(30, 110)">
            ${posts.map((post, index) => generatePostItem(post, index, colors)).join('')}
        </g>
    </svg>`;
}

export function generateErrorBadge(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="100">
        <rect width="400" height="100" rx="10" fill="#ff5555" stroke="#ff0000" stroke-width="2"/>
        <text x="200" y="55" text-anchor="middle" font-family="Arial" font-size="16" fill="#ffffff">
            Failed to load blog posts
        </text>
    </svg>`;
}