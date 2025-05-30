import { NEWS_URL, CACHE_KEYS } from '@/constants';
import { NewsItem } from '@/types';

import { dateUtils } from '../base';
import { fetchUtils } from '../fetch';

import { createNewsManager } from './newsManager';

const getHotIndex = (trendElement: Element | null) => {
  if (!trendElement) return '';
  const hotIndex = trendElement.textContent?.trim() ?? '';
  const num = Number(hotIndex);
  if (isNaN(num)) return '';
  if (num > 1e8) {
    return `${(num / 1e8).toFixed(1)}亿`;
  }
  if (num > 1e4) {
    return `${(num / 1e4).toFixed(1)}万`;
  }
  return num.toString();
};

const getTieBaIndex = (tagElement: Element | null) => {
  if (!tagElement) return '';
  const tag = tagElement.textContent?.trim() ?? '';
  const num = parseInt(tag);
  if (isNaN(num)) return '';
  if (tag.match(/^[0-9]+(w|W|万)/)) {
    return `${num}万`;
  }
  if (tag.match(/^[0-9]+(y|Y|亿)/)) {
    return `${num}亿`;
  } else {
    return tag.replace(/'实时讨论'/, '');
  }
};

const fetchBaiduTiebaPage = async (url: string) => {
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
    // 获取新闻列表
    const articles = doc.querySelectorAll('.topic-top-item');

    articles.forEach((article) => {
      const titleElement: HTMLAnchorElement | null = article.querySelector('.topic-text');
      const tagElement = article.querySelector('.topic-num');

      const imgElement: HTMLImageElement | null = article.querySelector('.topic-cover');

      if (titleElement) {
        const title = titleElement.textContent?.trim() ?? '';

        let link = titleElement?.href ?? '';

        link = link.replace(/^(chrome-extension:\/\/)/, `https://`);

        const tag = getTieBaIndex(tagElement);

        newsItems.push({
          title,
          link,
          source: '',
          time: timeStr,
          tag,
          newsImg: (imgElement?.src ?? '').replace(/^(chrome-extension:\/\/)/, `https://`),
        });
      }
    });

    return newsItems;
  } catch (error) {
    console.error('获取新闻失败:', error);
    return [];
  }
};
const fetchBaiduHotPage = async (url: string) => {
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
    // 获取新闻列表
    const articles = doc.querySelectorAll('[class*=category-wrap]');

    articles.forEach((article) => {
      const titleElement = article.querySelector('[class*=content_] .c-single-text-ellipsis');
      const tagElement = article.querySelector('[class*=content_]  [class*=tag]');
      const linkElement: HTMLAnchorElement | null = article.querySelector(
        '[class*=content_]  a[class*=title_] '
      );
      const imgElement: HTMLImageElement | null = article.querySelector(
        '[class*=img-wrapper] > img'
      );
      const trendElement = article.querySelector('[class*=trend_]  [class*=hot-index]');

      if (titleElement) {
        const title = titleElement.textContent?.trim() ?? '';

        let link = linkElement?.href ?? '';

        link = link.replace(/^(chrome-extension:\/\/)/, `https://`);

        const tag = tagElement?.textContent?.trim() ?? getHotIndex(trendElement);

        newsItems.push({
          title,
          link,
          source: '',
          time: timeStr,
          tag,
          newsImg: (imgElement?.src ?? '').replace(/^(chrome-extension:\/\/)/, `https://`),
        });
      }
    });

    return newsItems;
  } catch (error) {
    console.error('获取新闻失败:', error);
    return [];
  }
};

export const baiduHotNews = createNewsManager(CACHE_KEYS.BAIDU_HOT_NEWS, () => {
  return fetchBaiduHotPage(NEWS_URL.BAIDU_TOP);
});

export const baiduTiebaNews = createNewsManager(CACHE_KEYS.BAIDU_TIEBA_NEWS, () => {
  return fetchBaiduTiebaPage(NEWS_URL.BAIDU_TIEBA);
});
