import { PageInfo } from '@/types/app';

import { CacheManager } from './cacheManager';

export class CrawlerManager<T, R> {
  cache: CacheManager<T>;
  cacheKey: string;
  fetchSiteData: () => Promise<T>;
  formatDisplay: (data: T, pageInfo?: PageInfo) => R;
  constructor(
    cacheKey: string,
    fetchSiteData: () => Promise<T>,
    formatDisplay: (data: T, pageInfo?: PageInfo) => R
  ) {
    this.cacheKey = cacheKey;
    this.cache = new CacheManager<T>(cacheKey);
    this.fetchSiteData = fetchSiteData;
    this.formatDisplay = formatDisplay;
  }

  async getAvailableSites(): Promise<T> {
    try {
      // 检查缓存
      const cacheData = await this.cache.get();
      if (cacheData) {
        console.log(`${this.cacheKey}: 使用缓存数据`);
        return cacheData;
      }

      // 缓存未命中，请求新数据
      const response = await this.fetchSiteData();

      console.log(`${this.cacheKey}: 缓存数据成功`);

      await this.cache.set(response);

      return response;
    } catch (error) {
      console.error('Error fetching wiki page:', error);
      throw error;
    }
  }

  async getDisplayData(pageInfo?: PageInfo): Promise<R | null> {
    try {
      const data = await this.getAvailableSites();

      // 返回随机选择的记录
      return this.formatDisplay(data, pageInfo);
    } catch (error) {
      console.error('Error fetching historical events:', error);
      return null;
    }
  }

  clearCache() {
    this.cache.clear();
  }
}
