import { NEWS_URL, CACHE_KEYS } from '@/constants';
import { NewsItem } from '@/types';

import { dateUtils } from '../base';
import { fetchUtils } from '../fetch';

import { createNewsManager } from './newsManager';

const fetchKe36Page = async (url: string) => {
  try {
    const timeStr = dateUtils.getCurISOString();
    // 通过 background 脚本获取新闻
    const response = await fetchUtils(url, { cacheFetch: true });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();

    // 创建临时 DOM 解析 HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const newsItems: NewsItem[] = [];
    // document.querySelectorAll('.flow-item .item-title')
    // 获取新闻列表
    const articles = doc.querySelectorAll('.flow-item');

    articles.forEach((article) => {
      const titleElement: HTMLAnchorElement | null = article.querySelector('.item-title');

      const linkElement: HTMLAnchorElement | null = article.querySelector('.tem-desc a');

      if (titleElement) {
        const title = titleElement.textContent?.trim() ?? '';

        let link = linkElement?.href ?? titleElement?.href ?? '';

        link = link.replace(/^(chrome-extension:\/\/[a-z0-9A-Z]+)?\/news/, `https://36kr.com/news`);

        newsItems.push({
          title,
          link,
          source: '',
          time: timeStr,
        });
      }
    });

    return newsItems;
  } catch (error) {
    console.error('获取新闻失败:', error);
    return [];
  }
};

export const ke36NewsAll = createNewsManager(CACHE_KEYS.KR_36_NEWS, () => {
  return fetchKe36Page(NEWS_URL.KR_36 + '0');
});

export const ke36NewsHot = createNewsManager(CACHE_KEYS.KR_36_NEWS, () => {
  return fetchKe36Page(NEWS_URL.KR_36 + '1');
});

export const ke36NewsStock = createNewsManager(CACHE_KEYS.KR_36_NEWS, () => {
  return fetchKe36Page(NEWS_URL.KR_36 + '2');
});

export const ke36NewsMacro = createNewsManager(CACHE_KEYS.KR_36_NEWS, () => {
  return fetchKe36Page(NEWS_URL.KR_36 + '4');
});
