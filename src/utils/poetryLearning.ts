import { CACHE_KEYS } from '@/constants';
import { Poetry } from '@/types';

import { getNextRecord } from './generateNext';

const SELECTED_POEMS_COUNT = 4;
const REVIEW_COUNT = 30; // 复习天数

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

// 获取下一首诗词
export const getNextPoem = async (): Promise<Poetry[] | null> => {
  return getNextRecord({
    cacheKey: CACHE_KEYS.POETRY_LEARNING_RECORD, // 缓存key
    compareFn: (a, b) => a.title === b.title && a.author === b.author, // 比较函数
    getData: getPoetryData, // 数据源
    unitCount: SELECTED_POEMS_COUNT, // 每次选择的数量
    reviewDays: REVIEW_COUNT, // 复习天数
    batchSize: 2,
  });
};
