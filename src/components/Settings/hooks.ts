import { useEffect, useState, useMemo } from 'react';

import { CACHE_KEYS, DATA_TYPE_OPTIONS } from '@/constants';
import { PoetrySourceCategory } from '@/constants/poetry';
import {
  AppLanguage,
  ChineseBasicsCategory,
  ContentColumnCount,
  ContentPanelConfig,
  DataType,
  Theme,
  NeckMode,
  Settings,
  KnowledgeMode,
} from '@/types/app';
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

const DEFAULT_PANEL_DATA_TYPES = [DataType.History, DataType.Poetry, DataType.English] as const;

const createDefaultNeckConfig = (index = 0) => ({
  mode: index === 0 ? NeckMode.Training : NeckMode.Reading,
  rotate: 0,
  duration: 0,
  cusDuration: 15,
  cusMaxRotate: 180,
});

export const createContentPanelConfig = (index = 0): ContentPanelConfig => ({
  id: `panel-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
  neck: createDefaultNeckConfig(index),
  dataType: DEFAULT_PANEL_DATA_TYPES[index] ?? DataType.History,
  knowledge: KnowledgeMode.Wiki,
  poetry: {
    category: PoetrySourceCategory.All,
    sources: [],
  },
  chineseBasics: {
    category: ChineseBasicsCategory.All,
  },
});

export const createNextContentPanelConfig = (
  panels: ContentPanelConfig[],
  activePanelId: string
): ContentPanelConfig => {
  const activePanel =
    panels.find((panel) => panel.id === activePanelId) ?? panels[panels.length - 1];
  const usedDataTypes = new Set(panels.map((panel) => panel.dataType));
  const dataType =
    DATA_TYPE_OPTIONS.find((type) => !usedDataTypes.has(type)) ?? DATA_TYPE_OPTIONS[0];
  const panel = createContentPanelConfig(panels.length);

  return {
    ...panel,
    dataType,
    neck: activePanel ? { ...activePanel.neck } : panel.neck,
  };
};

export const duplicateContentPanelConfig = (
  panel: ContentPanelConfig,
  index: number
): ContentPanelConfig => ({
  ...panel,
  id: createContentPanelConfig(index).id,
  neck: { ...panel.neck },
  poetry: {
    ...panel.poetry,
    sources: [...panel.poetry.sources],
  },
  chineseBasics: { ...panel.chineseBasics },
});

export type PanelDropPosition = 'before' | 'after';

export const reorderContentPanels = (
  panels: ContentPanelConfig[],
  sourcePanelId: string,
  targetPanelId: string,
  position: PanelDropPosition
): ContentPanelConfig[] => {
  const sourceIndex = panels.findIndex((panel) => panel.id === sourcePanelId);
  const targetIndex = panels.findIndex((panel) => panel.id === targetPanelId);

  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
    return panels;
  }

  const reorderedPanels = [...panels];
  const [sourcePanel] = reorderedPanels.splice(sourceIndex, 1);
  const nextTargetIndex = reorderedPanels.findIndex((panel) => panel.id === targetPanelId);
  const insertionIndex = nextTargetIndex + (position === 'after' ? 1 : 0);
  reorderedPanels.splice(insertionIndex, 0, sourcePanel);

  return reorderedPanels;
};

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
  if (browserLanguage.startsWith('ja')) {
    return AppLanguage.Ja;
  }
  if (browserLanguage.startsWith('ar')) {
    return AppLanguage.Ar;
  }
  return browserLanguage.startsWith('fr') ? AppLanguage.Fr : AppLanguage.En;
};

const createDefaultSettings = (): Settings => {
  const firstPanel = createContentPanelConfig(0);
  return {
    language: getBrowserLanguage(),
    theme: Theme.System,
    columns: 1,
    activePanelId: firstPanel.id,
    panels: [firstPanel],
    neck: firstPanel.neck,
    dataType: firstPanel.dataType,
    knowledge: firstPanel.knowledge,
    poetry: firstPanel.poetry,
    chineseBasics: firstPanel.chineseBasics,
  };
};

const normalizeColumnCount = (value: unknown): ContentColumnCount =>
  typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 6
    ? (value as ContentColumnCount)
    : 1;

const normalizePanel = (
  panel: Partial<ContentPanelConfig>,
  fallback: ContentPanelConfig,
  id: string
): ContentPanelConfig => ({
  ...fallback,
  ...panel,
  id,
  neck: {
    ...fallback.neck,
    ...panel.neck,
  },
  poetry: {
    ...fallback.poetry,
    ...panel.poetry,
  },
  chineseBasics: {
    ...fallback.chineseBasics,
    ...panel.chineseBasics,
  },
});

const normalizeSettings = (storedSettings: Settings | null): Settings => {
  const defaultSettings = createDefaultSettings();

  if (!storedSettings) {
    return defaultSettings;
  }

  const legacyPanel: Partial<ContentPanelConfig> = {
    neck: storedSettings.neck,
    dataType: storedSettings.dataType,
    knowledge: storedSettings.knowledge,
    poetry: storedSettings.poetry,
    chineseBasics: storedSettings.chineseBasics,
  };
  const storedPanels = Array.isArray(storedSettings.panels) ? storedSettings.panels : [];
  const columns = storedPanels.length
    ? normalizeColumnCount(storedSettings.columns ?? storedPanels.length)
    : 1;
  const usedIds = new Set<string>();
  const panels = Array.from({ length: columns }, (_, index) => {
    const fallback = createContentPanelConfig(index);
    const storedPanel = storedPanels[index] ?? (index === 0 ? legacyPanel : {});
    const requestedId = typeof storedPanel.id === 'string' ? storedPanel.id : fallback.id;
    const id = usedIds.has(requestedId) ? fallback.id : requestedId;
    usedIds.add(id);
    return normalizePanel(storedPanel, fallback, id);
  });
  const firstPanel = panels[0];
  const activePanelId = panels.some((panel) => panel.id === storedSettings.activePanelId)
    ? storedSettings.activePanelId
    : firstPanel.id;

  return {
    ...defaultSettings,
    ...storedSettings,
    language:
      storedSettings.language === AppLanguage.ZhCN ||
      storedSettings.language === AppLanguage.ZhTW ||
      storedSettings.language === AppLanguage.En ||
      storedSettings.language === AppLanguage.Ru ||
      storedSettings.language === AppLanguage.Fr ||
      storedSettings.language === AppLanguage.Ja ||
      storedSettings.language === AppLanguage.Ar
        ? storedSettings.language
        : defaultSettings.language,
    columns,
    activePanelId,
    panels,
    neck: firstPanel.neck,
    dataType: firstPanel.dataType,
    knowledge: firstPanel.knowledge,
    poetry: firstPanel.poetry,
    chineseBasics: firstPanel.chineseBasics,
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
