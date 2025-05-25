import { NewsItem } from '@/types';
import { fetchWithTimeout } from '../fetch';
import { NEWS_URL, CACHE_KEYS } from '@/constants';
import { createNewsManager } from './newsManager';

const fetchGoogleNews = async (url: string) => {
  try {
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
    const articles = doc.querySelectorAll('article');

    articles.forEach((article) => {
      const linkElement: HTMLAnchorElement | null = article.querySelector('a[data-n-tid]');
      const sourceElement = article.querySelector('div[data-n-tid]');
      const timeElement = article.querySelector('time');

      if (linkElement) {
        // 处理相对链接
        const link = linkElement.href.startsWith('/')
          ? `https://news.google.com${linkElement.href}`
          : linkElement.href;

        newsItems.push({
          title: linkElement.textContent?.trim() || '',
          link,
          source: sourceElement?.textContent?.trim() || '',
          time: timeElement?.getAttribute('datetime') || '',
        });
      }
    });

    return newsItems;
  } catch (error) {
    console.error('获取新闻失败:', error);
    return [];
  }
};

export const ggEnForYouNews = createNewsManager(CACHE_KEYS.GOOGLE_EN_FOR_YOU_NEWS, () => {
  return fetchGoogleNews(NEWS_URL.GOOGLE_EN_FOR_YOU);
});

export const ggZhForYouNews = createNewsManager(CACHE_KEYS.GOOGLE_ZH_FOR_YOU_NEWS, () => {
  return fetchGoogleNews(NEWS_URL.GOOGLE_ZH_FOR_YOU);
});

export const ggEnGlobalNews = createNewsManager(CACHE_KEYS.GOOGLE_EN_GLOBAL_NEWS, () => {
  return fetchGoogleNews(NEWS_URL.GOOGLE_EN_GLOBAL);
});

export const ggZhGlobalNews = createNewsManager(CACHE_KEYS.GOOGLE_ZH_GLOBAL_NEWS, () => {
  return fetchGoogleNews(NEWS_URL.GOOGLE_ZH_GLOBAL);
});
