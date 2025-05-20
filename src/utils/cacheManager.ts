/**
 * 通用缓存管理类
 * 支持数据缓存、过期检查、清除和状态查询
 */
export class CacheManager<T> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  // 检查缓存是否过期（是否在同一天）
  private isExpired(timestamp: string): boolean {
    const cacheDate = new Date(timestamp);
    const now = new Date();
    return (
      cacheDate.getDate() !== now.getDate() ||
      cacheDate.getMonth() !== now.getMonth() ||
      cacheDate.getFullYear() !== now.getFullYear()
    );
  }

  // 获取缓存数据
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

  // 设置缓存数据
  async set(data: T): Promise<void> {
    const cacheData = {
      data,
      timestamp: new Date().toISOString(),
    };
    return new Promise((resolve) => {
      chrome.storage.local.set({ [this.key]: cacheData }, resolve);
    });
  }

  // 清除缓存
  async clear(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.remove([this.key], resolve);
    });
  }

  // 获取缓存状态
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
