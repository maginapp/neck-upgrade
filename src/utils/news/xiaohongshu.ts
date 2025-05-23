import { NewsItem } from '@/types';
import { fetchWithTimeout } from '../fetch';
import { NEWS_URL, CACHE_KEYS } from '@/constants';
import { createNewsManager } from './newsManager';

const fetchXhsNews = async (url: string) => {
  try {
    const timeStr = new Date().toISOString();
    // 通过 background 脚本获取新闻
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();

    // 创建临时 DOM 解析 HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const newsItems: NewsItem[] = [];
    // 获取新闻列表
    const articles =
      doc.querySelector('#exploreFeeds')?.querySelectorAll('.note-item, section') || [];

    articles.forEach((article) => {
      const titleElement: HTMLAnchorElement | null = article.querySelector('a.title');
      const linkElement: HTMLAnchorElement | null = article.querySelector('a.cover');
      const imgElement: HTMLImageElement | null = article.querySelector('img.author-avatar');
      const nameElement: HTMLImageElement | null = article.querySelector('span.name');

      if (titleElement) {
        const title = titleElement.textContent?.trim() ?? '';
        // 处理相对链接
        const link = linkElement?.href?.startsWith('/')
          ? `https://www.xiaohongshu.com${linkElement.href}`
          : (linkElement?.href ?? '');

        newsItems.push({
          title,
          link,
          source: '',
          time: timeStr,
          tag: '',
          avatar: imgElement?.src,
          username: nameElement?.textContent?.trim(),
        });
      }
    });

    return newsItems;
  } catch (error) {
    console.error('获取新闻失败:', error);
    return [];
  }
};

export const xhsNews = createNewsManager(CACHE_KEYS.XIAOHONGSHU_NEWS, () => {
  return fetchXhsNews(NEWS_URL.XIAOHONGSHU);
});
