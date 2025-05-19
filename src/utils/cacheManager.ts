/**
 * 通用缓存管理类
 * 支持数据缓存、过期检查、清除和状态查询
 */
export class CacheManager<T> {
  private key: string;
  private expiryTime: number; // 过期时间（毫秒）

  constructor(key: string, expiryTime: number = 24 * 60 * 60 * 1000) {
    this.key = key;
    this.expiryTime = expiryTime;
  }

  // 检查缓存是否过期
  private isExpired(timestamp: string): boolean {
    const now = new Date().getTime();
    const cacheTime = new Date(timestamp).getTime();
    return now - cacheTime > this.expiryTime;
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
      timestamp: new Date().toISOString()
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
          timestamp: data.timestamp
        });
      });
    });
  }
} 