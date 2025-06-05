import { NEWS_URL, CACHE_KEYS } from '@/constants';
import { NewsItem } from '@/types';

import { dateUtils } from '../base';
import { fetchUtils } from '../fetch';

import { createNewsManager } from './newsManager';

const fetchV2exPage = async (url: string) => {
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

    const needLogin = !!doc.querySelector('.Qrcode-img');
    if (needLogin) {
      return { loginUrl: url };
    }

    const newsItems: NewsItem[] = [];
    // 获取新闻列表
    const articles = doc.querySelectorAll('.cell.item');

    articles.forEach((article) => {
      const titleElement: HTMLAnchorElement | null = article.querySelector('.item_title a');
      const tagElement = article.querySelector('.topic_info .node');
      const avatarElement: HTMLImageElement | null = article.querySelector('.avatar');

      if (titleElement) {
        const title = titleElement.textContent?.trim() ?? '';
        const link = `https://www.v2ex.com${titleElement?.href ?? ''}`;

        newsItems.push({
          title,
          link,
          source: '',
          time: timeStr,
          tag: (tagElement?.textContent ?? '').trim(),
          newsImg: avatarElement?.src ?? '',
        });
      }
    });

    return newsItems;
  } catch (error) {
    console.error('获取新闻失败:', error);
    return [];
  }
};

export const v2exTechNews = createNewsManager(CACHE_KEYS.V2EX_TECH_NEWS, () => {
  return fetchV2exPage(`${NEWS_URL.V2EX}/?tab=tech`);
});

export const v2exHotNews = createNewsManager(CACHE_KEYS.V2EX_HOT_NEWS, () => {
  return fetchV2exPage(`${NEWS_URL.V2EX}/?tab=hot`);
});

export const v2exCreativeNews = createNewsManager(CACHE_KEYS.V2EX_CREATIVE_NEWS, () => {
  return fetchV2exPage(`${NEWS_URL.V2EX}/?tab=creative`);
});

export const v2exPlayNews = createNewsManager(CACHE_KEYS.V2EX_PLAY_NEWS, () => {
  return fetchV2exPage(`${NEWS_URL.V2EX}/?tab=play`);
});

export const v2exAllNews = createNewsManager(CACHE_KEYS.V2EX_ALL_NEWS, () => {
  return fetchV2exPage(`${NEWS_URL.V2EX}/?tab=all`);
});
