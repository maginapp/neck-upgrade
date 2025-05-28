import { NEWS_URL, CACHE_KEYS } from '@/constants';
import { BilibiliHotResponse, NewsItem } from '@/types';

import { fetchUtils } from '../fetch';

import { createNewsManager } from './newsManager';

const fetchBilibili = async (url: string) => {
  try {
    const response = await fetchUtils(url, { cacheFetch: true });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: BilibiliHotResponse = await response.json();

    const newsItems: NewsItem[] = (result?.data?.list || [])?.map((item) => {
      const title = item.title;
      const newsImg = item.pic;
      const time = new Date(item.pubdate * 1000);
      const link = `https://www.bilibili.com/video/${item.bvid}`;

      return {
        title,
        link,
        source: '',
        time: time.toISOString(),
        tag: item.tnamev2,
        newsImg,
      };
    });

    return newsItems;
  } catch (error) {
    console.error('获取新闻失败:', error);
    return [];
  }
};

export const bilibiliAllNews = createNewsManager(CACHE_KEYS.BILIBILI_ALL, () => {
  return fetchBilibili(NEWS_URL.BILIBILI_ALL);
});

export const bilibiliRankNews = createNewsManager(CACHE_KEYS.BILIBILI_RANK, () => {
  return fetchBilibili(NEWS_URL.BILIBILI_RANK);
});
