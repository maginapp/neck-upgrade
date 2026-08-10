import { CACHE_KEYS, POEM_REVIEW_COUNT, POEM_SELECTED_POEMS_COUNT } from '@/constants';
import { PoetrySourceCategory } from '@/constants/poetry';
import { Poetry } from '@/types';
import { PoetrySourceConfig } from '@/types/app';

import { getNextRecord } from './generateNext';

/**
 * 加载JSON数据文件
 * @param path 数据文件路径
 * @returns 解析后的JSON数据
 */
async function loadJsonData<T>(path: string): Promise<T> {
  try {
    const response = await fetch(chrome.runtime.getURL(path));
    if (!response.ok) {
      throw new Error(`Failed to load data from ${path}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error loading data from ${path}:`, error);
    throw error;
  }
}

// 缓存加载的数据
let poetryDataCache: Poetry[] | null = null;

/**
 * 获取诗词数据
 */
export async function getPoetryData(): Promise<Poetry[]> {
  if (!poetryDataCache) {
    poetryDataCache = await loadJsonData<Poetry[]>('data/poetry.json');
  }
  return poetryDataCache;
}

export const DEFAULT_POETRY_SOURCE_CONFIG: PoetrySourceConfig = {
  category: PoetrySourceCategory.All,
  sources: [],
};

export const filterPoetryData = (
  poetry: Poetry[],
  config: PoetrySourceConfig = DEFAULT_POETRY_SOURCE_CONFIG
) => {
  return poetry.filter((item) => {
    const matchesCategory =
      config.category === PoetrySourceCategory.All || item.category === config.category;
    const matchesSource =
      config.sources.length === 0 || item.sources.some((source) => config.sources.includes(source));

    return matchesCategory && matchesSource;
  });
};

export const getPoetryScopeKey = (config: PoetrySourceConfig = DEFAULT_POETRY_SOURCE_CONFIG) => {
  const sources = [...config.sources].sort().join(',') || 'all';
  return `${config.category}:${sources}`;
};

// 获取下一首诗词
export const getNextPoem = async (
  config: PoetrySourceConfig = DEFAULT_POETRY_SOURCE_CONFIG
): Promise<Poetry[] | null> => {
  const scopeKey = getPoetryScopeKey(config);

  return getNextRecord({
    cacheKey: `${CACHE_KEYS.POETRY_LEARNING_RECORD}:${scopeKey}`, // 按来源隔离学习记录
    compareFn: (a, b) => a.title === b.title && a.author === b.author, // 比较函数
    getData: async () => filterPoetryData(await getPoetryData(), config), // 数据源
    unitCount: POEM_SELECTED_POEMS_COUNT, // 每次选择的数量
    reviewDays: POEM_REVIEW_COUNT, // 复习天数
    batchSize: 2,
  });
};
