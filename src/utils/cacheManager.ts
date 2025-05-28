import { dateUtils } from './base';

/**
 * 通用缓存管理类
 * 支持数据缓存、过期检查、清除和状态查询
 */
export class CacheManager<T> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  /**
   * 检查缓存是否过期
   * 通过比较日期判断是否在同一天
   * @param timestamp 缓存时间戳
   * @returns 是否过期
   */
  isExpired(timestamp: string, _data?: T): boolean {
    const cacheDate = new Date(timestamp);
    const now = dateUtils.getNow();
    return (
      cacheDate.getDate() !== now.getDate() ||
      cacheDate.getMonth() !== now.getMonth() ||
      cacheDate.getFullYear() !== now.getFullYear()
    );
  }

  /**
   * 获取缓存数据
   * 如果数据存在且未过期则返回数据，否则返回null
   */
  async get(): Promise<T | null> {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.key], (result) => {
        const data = result[this.key] as { data: T; timestamp: string } | undefined;
        if (data && !this.isExpired(data.timestamp, data.data)) {
          resolve(data.data);
        } else {
          resolve(null);
        }
      });
    });
  }

  /**
   * 设置缓存数据
   * 将数据和时间戳一起存储
   * @param data 要缓存的数据
   */
  async set(data: T): Promise<void> {
    const cacheData = {
      data,
      timestamp: dateUtils.getCurISOString(),
    };
    return new Promise((resolve) => {
      chrome.storage.local.set({ [this.key]: cacheData }, resolve);
    });
  }

  /**
   * 清除缓存数据
   */
  async clear(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.remove([this.key], resolve);
    });
  }
}

/**
 * 通用缓存管理类
 * 支持数据缓存、过期检查、清除和状态查询
 */
export class LocalManager<T> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  /**
   * 检查缓存是否过期
   * 通过比较日期判断是否在同一天
   * @param timestamp 缓存时间戳
   * @returns 是否过期
   */
  isExpired(timestamp: string): boolean {
    const cacheDate = new Date(timestamp);
    const now = dateUtils.getNow();
    return (
      cacheDate.getDate() !== now.getDate() ||
      cacheDate.getMonth() !== now.getMonth() ||
      cacheDate.getFullYear() !== now.getFullYear()
    );
  }

  /**
   * 获取缓存数据
   * 如果数据存在且未过期则返回数据，否则返回null
   */
  get(): T | null {
    try {
      const str = localStorage.getItem(this.key);
      const data =
        typeof str === 'string' ? (JSON.parse(str) as { data: T; timestamp: string }) : null;
      if (data && !this.isExpired(data.timestamp)) {
        return data.data;
      } else {
        return null;
      }
    } catch (e) {
      console.error('localStorage 获取数据失败', e);
      return null;
    }
  }

  /**
   * 设置缓存数据
   * 将数据和时间戳一起存储
   * @param data 要缓存的数据
   */
  set(data: T): void {
    const cacheData = {
      data,
      timestamp: dateUtils.getCurISOString(),
    };
    localStorage.setItem(this.key, JSON.stringify(cacheData));
  }

  /**
   * 清除缓存数据
   */
  clear(): void {
    localStorage.removeItem(this.key);
  }
}
