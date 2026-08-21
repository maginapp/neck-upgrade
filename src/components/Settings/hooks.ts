import { useEffect, useState, useMemo } from 'react';

import { CACHE_KEYS } from '@/constants';
import { PoetrySourceCategory } from '@/constants/poetry';
import { AppLanguage, DataType, Theme, NeckMode, Settings, KnowledgeMode } from '@/types/app';
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

const getBrowserLanguage = (): AppLanguage => {
  if (typeof navigator === 'undefined') {
    return AppLanguage.En;
  }

  const browserLanguage = navigator.language.toLowerCase();
  if (/^zh(?:-|_)(?:tw|hk|mo|hant)/.test(browserLanguage)) {
    return AppLanguage.ZhTW;
  }
  if (browserLanguage.startsWith('zh')) {
    return AppLanguage.ZhCN;
  }
  if (browserLanguage.startsWith('ru')) {
    return AppLanguage.Ru;
  }
  return browserLanguage.startsWith('fr') ? AppLanguage.Fr : AppLanguage.En;
};

const createDefaultSettings = (): Settings => {
  return {
    language: getBrowserLanguage(),
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
    poetry: {
      category: PoetrySourceCategory.All,
      sources: [],
    },
  };
};

const normalizeSettings = (storedSettings: Settings | null): Settings => {
  const defaultSettings = createDefaultSettings();

  if (!storedSettings) {
    return defaultSettings;
  }

  return {
    ...defaultSettings,
    ...storedSettings,
    language:
      storedSettings.language === AppLanguage.ZhCN ||
      storedSettings.language === AppLanguage.ZhTW ||
      storedSettings.language === AppLanguage.En ||
      storedSettings.language === AppLanguage.Ru ||
      storedSettings.language === AppLanguage.Fr
        ? storedSettings.language
        : defaultSettings.language,
    neck: {
      ...defaultSettings.neck,
      ...storedSettings.neck,
    },
    poetry: {
      ...defaultSettings.poetry,
      ...storedSettings.poetry,
    },
  };
};

const parseStoredSettings = (value: string | null): Settings | null => {
  if (!value) {
    return null;
  }

  try {
    const stored = JSON.parse(value) as { data?: Settings };
    return stored.data ?? null;
  } catch (error) {
    console.error('localStorage 设置同步数据解析失败', error);
    return null;
  }
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() =>
    normalizeSettings(settingsStorage.get())
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

  // 同步其他扩展页面写入的设置，例如 Popup 与新标签页之间的语言和主题切换。
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.storageArea !== localStorage || event.key !== CACHE_KEYS.EXTENSION_SETTINGS) {
        return;
      }

      const nextSettings = normalizeSettings(parseStoredSettings(event.newValue));
      setSettings((currentSettings) =>
        JSON.stringify(currentSettings) === JSON.stringify(nextSettings)
          ? currentSettings
          : nextSettings
      );
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 当设置发生变化时保存到存储中
  useEffect(() => {
    settingsStorage.set(settings);
  }, [settings]);

  return { settings, setSettings, currentTheme };
}
