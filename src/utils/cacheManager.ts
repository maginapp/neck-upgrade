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
  protected isExpired(timestamp: string): boolean {
    const cacheDate = new Date(timestamp);
    const now = new Date();
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
        if (data && !this.isExpired(data.timestamp)) {
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
      timestamp: new Date().toISOString(),
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

  /**
   * 获取缓存状态
   * @returns 包含缓存存在状态、是否过期和时间戳的对象
   */
  async getStatus(): Promise<{ exists: boolean; isExpired: boolean; timestamp?: string }> {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.key], (result) => {
        const data = result[this.key] as { data: T; timestamp: string } | undefined;
        if (!data) {
          resolve({ exists: false, isExpired: false });
          return;
        }
        resolve({
          exists: true,
          isExpired: this.isExpired(data.timestamp),
          timestamp: data.timestamp,
        });
      });
    });
  }
}
