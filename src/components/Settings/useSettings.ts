
import { DataType, Theme, NeckMode, Settings } from '@/types/app';
import { useEffect, useState } from 'react';

import { CACHE_KEYS } from '@/constants';
import { CacheManager } from '@/utils/cacheManager';


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
const settingsStorage = new SettingsStorage(); 

export function useSettings() {
    const [settings, setSettings] = useState<Settings>({
        theme: Theme.Light,
        neckMode: NeckMode.Normal,
        dataType: DataType.History,
    });;
  
    // 组件挂载时从存储中加载设置
    useEffect(() => {
      const loadSettings = async () => {
        const savedSettings = await settingsStorage.get();
        if (savedSettings) {
            setSettings(savedSettings);
        }
      };
      loadSettings();
    }, []);
  
    // 当设置发生变化时保存到存储中
    useEffect(() => {
      const saveSettings = async () => {
        await settingsStorage.set(settings);
      };
      saveSettings();
    }, [settings]);

    return { settings, setSettings };
}