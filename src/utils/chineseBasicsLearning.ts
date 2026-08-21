import {
  CACHE_KEYS,
  CHINESE_BASICS_BATCH_SIZES,
  CHINESE_BASICS_CATEGORIES,
  CHINESE_BASICS_DATA_PATHS,
  CHINESE_BASICS_REVIEW_COUNT,
  CHINESE_BASICS_UNIT_COUNT,
} from '@/constants';
import { ChineseBasicsEntry } from '@/types';
import { ChineseBasicsCategory, ChineseBasicsConfig } from '@/types/app';

import { getNextRecord } from './generateNext';

type ConcreteCategory = (typeof CHINESE_BASICS_CATEGORIES)[number];

const dataCache = new Map<ConcreteCategory, Promise<ChineseBasicsEntry[]>>();

export const DEFAULT_CHINESE_BASICS_CONFIG: ChineseBasicsConfig = {
  category: ChineseBasicsCategory.All,
};

const loadCategoryData = (category: ConcreteCategory): Promise<ChineseBasicsEntry[]> => {
  const cached = dataCache.get(category);
  if (cached) {
    return cached;
  }

  const request = fetch(chrome.runtime.getURL(CHINESE_BASICS_DATA_PATHS[category])).then(
    async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to load Chinese basics data: ${category}`);
      }
      return response.json() as Promise<ChineseBasicsEntry[]>;
    }
  );
  dataCache.set(category, request);
  request.catch(() => dataCache.delete(category));
  return request;
};

export const isSameChineseBasicsEntry = (first: ChineseBasicsEntry, second: ChineseBasicsEntry) =>
  first.category === second.category && first.key === second.key;

export const pickChineseBasicsCategories = (
  count: number,
  random: () => number = Math.random
): ConcreteCategory[] => {
  const pool = [...CHINESE_BASICS_CATEGORIES];
  const selected: ConcreteCategory[] = [];

  while (selected.length < count && pool.length > 0) {
    const index = Math.floor(random() * pool.length);
    selected.push(pool.splice(index, 1)[0]);
  }

  return selected;
};

const getNextFromCategory = (category: ConcreteCategory, batchSize: number) =>
  getNextRecord<ChineseBasicsEntry>({
    cacheKey: `${CACHE_KEYS.CHINESE_BASICS_LEARNING_RECORD}:${category}`,
    compareFn: isSameChineseBasicsEntry,
    unitCount: CHINESE_BASICS_UNIT_COUNT,
    reviewDays: CHINESE_BASICS_REVIEW_COUNT,
    getData: () => loadCategoryData(category),
    batchSize,
  });

export const getChineseBasicsScopeKey = (
  config: ChineseBasicsConfig = DEFAULT_CHINESE_BASICS_CONFIG
) => config.category;

export const getNextChineseBasics = async (
  config: ChineseBasicsConfig = DEFAULT_CHINESE_BASICS_CONFIG
): Promise<ChineseBasicsEntry[]> => {
  if (config.category !== ChineseBasicsCategory.All) {
    return getNextFromCategory(config.category, CHINESE_BASICS_BATCH_SIZES[config.category]);
  }

  const categories = pickChineseBasicsCategories(
    CHINESE_BASICS_BATCH_SIZES[ChineseBasicsCategory.All]
  );
  const batches = await Promise.all(categories.map((category) => getNextFromCategory(category, 1)));
  return batches.flat();
};
