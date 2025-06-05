import { NEWS_URL, CACHE_KEYS } from '@/constants';
import { BilibiliHotResponse, NewsItem } from '@/types';

import { dateUtils } from '../base';
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
        time: dateUtils.formatDateTime(time),
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

export const bilibiliAllNews = createNewsManager(CACHE_KEYS.BILIBILI_ALL_NEWS, () => {
  return fetchBilibili(NEWS_URL.BILIBILI_ALL);
});

export const bilibiliRankNews = createNewsManager(CACHE_KEYS.BILIBILI_RANK_NEWS, () => {
  return fetchBilibili(`${NEWS_URL.BILIBILI_RANK}?rid=0&type=all`);
});

export const bilibiliRankDougaNews = createNewsManager(CACHE_KEYS.BILIBILI_RANK_DOUGA_NEWS, () => {
  return fetchBilibili(`${NEWS_URL.BILIBILI_RANK}?rid=1005&type=all`);
});

export const bilibiliRankSportsNews = createNewsManager(
  CACHE_KEYS.BILIBILI_RANK_SPORTS_NEWS,
  () => {
    return fetchBilibili(`${NEWS_URL.BILIBILI_RANK}?rid=1018&type=all`);
  }
);

export const bilibiliRankFoodNews = createNewsManager(CACHE_KEYS.BILIBILI_RANK_FOOD_NEWS, () => {
  return fetchBilibili(`${NEWS_URL.BILIBILI_RANK}?rid=1020&type=all`);
});

export const bilibiliRankTechNews = createNewsManager(CACHE_KEYS.BILIBILI_RANK_TECH_NEWS, () => {
  return fetchBilibili(`${NEWS_URL.BILIBILI_RANK}?rid=1012&type=all`);
});

export const bilibiliRankKnowledgeNews = createNewsManager(
  CACHE_KEYS.BILIBILI_RANK_KNOWLEDGE_NEWS,
  () => {
    return fetchBilibili(`${NEWS_URL.BILIBILI_RANK}?rid=1010&type=all`);
  }
);

export const bilibiliRankEntNews = createNewsManager(CACHE_KEYS.BILIBILI_RANK_ENT_NEWS, () => {
  return fetchBilibili(`${NEWS_URL.BILIBILI_RANK}?rid=1002&type=all`);
});

export const bilibiliRankMusicNews = createNewsManager(CACHE_KEYS.BILIBILI_RANK_MUSIC_NEWS, () => {
  return fetchBilibili(`${NEWS_URL.BILIBILI_RANK}?rid=1003&type=all`);
});

export const bilibiliRankKichikuNews = createNewsManager(
  CACHE_KEYS.BILIBILI_RANK_KICHIKU_NEWS,
  () => {
    return fetchBilibili(`${NEWS_URL.BILIBILI_RANK}?rid=1007&type=all`);
  }
);

export const bilibiliRankDanceNews = createNewsManager(CACHE_KEYS.BILIBILI_RANK_DANCE_NEWS, () => {
  return fetchBilibili(`${NEWS_URL.BILIBILI_RANK}?rid=1004&type=all`);
});

export const bilibiliRankCinephileNews = createNewsManager(
  CACHE_KEYS.BILIBILI_RANK_CINEPHILE_NEWS,
  () => {
    return fetchBilibili(`${NEWS_URL.BILIBILI_RANK}?rid=1001&type=all`);
  }
);
