import { NewsItem } from '@/types';
import { fetchWithTimeout } from '../fetch';
import { NEWS_URL, CACHE_KEYS } from '@/constants';
import { createNewsManager } from './newsManager';
import { ToutiaoHotResponse } from '@/types/news';

export const fetchToutiaoPage = async (url: string) => {
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
    const articles = doc.querySelectorAll('.hot-list-item');

    articles.forEach((article) => {
      const titleElement: HTMLAnchorElement | null = article.querySelector('.list-item-title');
      const tagElement: HTMLImageElement | null = article.querySelector('.list-item-icon');

      if (titleElement) {
        const title = titleElement.textContent?.trim() ?? '';
        // 处理相对链接
        const link = `https://so.toutiao.com/search?keyword=${title}`;

        newsItems.push({
          title,
          link,
          source: '',
          time: timeStr,
          tag: tagElement?.src || '',
        });
      }
    });

    return newsItems;
  } catch (error) {
    console.error('获取新闻失败:', error);
    return [];
  }
};

const fetchToutiaoNews = async (url: string) => {
  try {
    const timeStr = new Date().toISOString();
    // 通过 background 脚本获取新闻
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: ToutiaoHotResponse = await response.json();

    const newsItems: NewsItem[] = result.data.map((item) => {
      const { Title: title, Url: link, LabelUrl: tag } = item;

      return {
        title,
        link,
        source: '',
        time: timeStr,
        tag: tag,
      };
    });

    return newsItems;
  } catch (error) {
    console.error('获取新闻失败:', error);
    return [];
  }
};

export const toutiaoNews = createNewsManager(CACHE_KEYS.TOUTIAO_NEWS, () => {
  return fetchToutiaoNews(NEWS_URL.TOUTIAO);
});
