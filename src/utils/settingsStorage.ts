import { CACHE_KEYS } from '@/constants';
import { CacheManager } from './cacheManager';
import { Theme, NeckMode, DataType } from '@/types/app';

/**
 * 设置项接口定义
 * 包含主题、颈椎模式和数据类型
 */
interface Settings {
  theme: Theme;
  neckMode: NeckMode;
  dataType: DataType;
}

/**
 * 设置存储类
 * 继承自CacheManager，用于管理设置的持久化存储
 */
class SettingsStorage extends CacheManager<Settings> {
  constructor() {
    super(CACHE_KEYS.EXTENSION_SETTINGS);
  }

  // 重写过期检查方法，设置项永不过期
  protected isExpired(): boolean {
    return false;
  }
}

// 导出设置存储实例
export const settingsStorage = new SettingsStorage(); 