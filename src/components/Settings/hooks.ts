import { useEffect, useState, useMemo } from 'react';

import { CACHE_KEYS } from '@/constants';
import { DataType, Theme, NeckMode, Settings, KnowledgeMode } from '@/types/app';
import { LocalManager } from '@/utils/cacheManager';

/**
 * 设置存储类
 * 继承自CacheManager，用于管理设置的持久化存储
 */
class SettingsStorage extends LocalManager<Settings> {
  constructor() {
    super(CACHE_KEYS.EXTENSION_SETTINGS);
  }

  // 重写过期检查方法，设置项永不过期
  isExpired(_timestamp: string, _data?: Settings): boolean {
    return false;
  }
}

// 导出设置存储实例
const settingsStorage = new SettingsStorage();

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(
    settingsStorage.get() || {
      theme: Theme.System,
      neck: {
        mode: NeckMode.Training,
        rotate: 0,
        duration: 0,
        cusDuration: 15,
        cusMaxRotate: 180,
      },
      dataType: DataType.History,
      knowledge: KnowledgeMode.Wiki,
    }
  );

  // 系统主题状态
  const [systemTheme, setSystemTheme] = useState<Theme.Dark | Theme.Light>(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDark ? Theme.Dark : Theme.Light;
  });

  // 计算当前实际应用的主题
  const currentTheme = useMemo(() => {
    return settings.theme === Theme.System ? systemTheme : settings.theme;
  }, [settings.theme, systemTheme]);

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemTheme(e.matches ? Theme.Dark : Theme.Light);
    };

    // 监听系统主题变化
    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  // 当设置发生变化时保存到存储中
  useEffect(() => {
    settingsStorage.set(settings);
  }, [settings]);

  return { settings, setSettings, currentTheme };
}
