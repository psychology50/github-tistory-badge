import { BlogPost, Theme } from './types';

const themeColors = {
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

export function generateBadge(posts: BlogPost[], theme: Theme = 'default'): string {
  const colors = themeColors[theme];
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250">
    <rect width="400" height="250" rx="10" fill="${colors.bg}" stroke="${colors.border}" stroke-width="2"/>
    
    <!-- Header -->
    <g transform="translate(20, 30)">
      <text font-family="Arial" font-size="16" font-weight="bold" fill="${colors.text}">
        Recent Blog Posts
      </text>
    </g>
    
    <!-- Posts List -->
    <g transform="translate(20, 60)">
      ${posts.map((post, index) => `
        <g transform="translate(0, ${index * 45})">
          <a href="${post.url}" target="_blank">
            <text font-family="Arial" font-size="14" fill="${colors.link}">
              <tspan x="0" dy="0">${post.title}</tspan>
              <tspan x="0" dy="20" font-size="12" fill="${colors.text}">
                ${post.date} · ${post.category}
              </tspan>
            </text>
          </a>
        </g>
      `).join('')}
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