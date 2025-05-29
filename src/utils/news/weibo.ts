import { NEWS_URL, CACHE_KEYS } from '@/constants';
import { NewsItem } from '@/types';

import { dateUtils } from '../base';
import { fetchUtils } from '../fetch';

import { createNewsManager } from './newsManager';

const fetchWeiboNews = async (url: string) => {
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

    const needLogin = html.includes('Sina Visitor System');

    if (needLogin) {
      return { loginUrl: url };
    }

    const newsItems: NewsItem[] = [];
    // 获取新闻列表
    const articles = doc.querySelectorAll('table tr');

    articles.forEach((article) => {
      const linkElement: HTMLAnchorElement | null = article.querySelector('td:nth-child(2) a');
      const tagElement = article.querySelector('td:nth-child(3)');

      if (linkElement) {
        // 处理相对链接

        // chrome-extension://kpdpgpoiejgjmokoahnkpghfohdgifjm/weibo/
        // /weibo/

        const link = linkElement.href.replace(
          /^(chrome-extension:\/\/[a-z0-9A-Z]+)?\/weibo/,
          `https://s.weibo.com/weibo`
        );

        newsItems.push({
          title: linkElement.textContent?.trim() || '',
          link,
          source: '',
          time: timeStr,
          tag: tagElement?.textContent?.trim() || '',
        });
      }
    });

    return newsItems;
  } catch (error) {
    console.error('获取新闻失败:', error);
    return [];
  }
};

export const weiboAmuseNews = createNewsManager(CACHE_KEYS.WEIBO_AMUSE_NEWS, () => {
  return fetchWeiboNews(NEWS_URL.WEIBO_AMUSE);
});

export const weiboHotNews = createNewsManager(CACHE_KEYS.WEIBO_HOT_NEWS, () => {
  return fetchWeiboNews(NEWS_URL.WEIBO_HOT);
});

export const weiboMyNews = createNewsManager(CACHE_KEYS.WEIBO_MY_NEWS, () => {
  return fetchWeiboNews(NEWS_URL.WEIBO_MY);
});

export const weiboLifeNews = createNewsManager(CACHE_KEYS.WEIBO_LIFE_NEWS, () => {
  return fetchWeiboNews(NEWS_URL.WEIBO_LIFE);
});

export const weiboSocialNews = createNewsManager(CACHE_KEYS.WEIBO_SOCIAL_NEWS, () => {
  return fetchWeiboNews(NEWS_URL.WEIBO_SOCIAL);
});
