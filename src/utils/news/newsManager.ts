import { DEFAULT_PAGE_INFO, NEWS_CACHE_EXPIRY } from '@/constants';
import { NewsItem, NewsDisplay } from '@/types';
import { PageInfo } from '@/types/app';

import { CrawlerManager } from '../crawlerManager';

const selectRandom = (list: NewsItem[], pageInfo: PageInfo = DEFAULT_PAGE_INFO): NewsDisplay => {
  const { page, pageSize } = pageInfo;
  const start = page * pageSize;
  const end = (page + 1) * pageSize;
  if (start >= list.length) {
    return {
      news: list.slice(0, pageSize),
      pageInfo: {
        pageSize,
        page: 0,
      },
    };
  }

  return {
    news: list.slice(start, end),
    pageInfo: {
      pageSize,
      page,
    },
  };
};

export const createNewsManager = (cacheKey: string, fetchSiteData: () => Promise<NewsItem[]>) => {
  const manager = new CrawlerManager<NewsItem[], NewsDisplay>(
    cacheKey,
    fetchSiteData,
    (data: NewsItem[], pageInfo?: PageInfo) => {
      return selectRandom(data, pageInfo);
    }
  );
  // 重写过期判断
  manager.cache.isExpired = (timestamp: string) => {
    const cacheDate = new Date(timestamp);
    const now = new Date();
    return !cacheDate || now.getTime() - cacheDate.getTime() > NEWS_CACHE_EXPIRY;
  };
  return manager;
};
