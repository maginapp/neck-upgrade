import { DEFAULT_PAGE_INFO, NEWS_CACHE_EXPIRY } from '@/constants';
import { NewsItem, NewsDisplay, NewsErrorInfo } from '@/types';
import { PageInfo } from '@/types/app';

import { dateUtils } from '../base';
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

export const createNewsManager = (
  cacheKey: string,
  fetchSiteData: () => Promise<NewsItem[] | NewsErrorInfo>
) => {
  const manager = new CrawlerManager<NewsItem[] | NewsErrorInfo, NewsDisplay>(
    cacheKey,
    fetchSiteData,
    (data: NewsItem[] | NewsErrorInfo, pageInfo?: PageInfo) => {
      if (Array.isArray(data)) {
        return selectRandom(data, pageInfo);
      } else {
        return {
          news: [],
          pageInfo: DEFAULT_PAGE_INFO,
          loginUrl: data.loginUrl,
        };
      }
    }
  );
  // 重写过期判断
  manager.cache.isExpired = (timestamp: string, data?: NewsItem[] | NewsErrorInfo) => {
    if (data && 'loginUrl' in data && data.loginUrl) {
      return true;
    }
    const cacheDate = new Date(timestamp);
    const now = dateUtils.getNow();
    return !cacheDate || now.getTime() - cacheDate.getTime() > NEWS_CACHE_EXPIRY;
  };
  return manager;
};
