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

const getParagraphSampleIndexes = (paragraphCount: number) => {
  return [...new Set([0, Math.floor((paragraphCount - 1) / 2), paragraphCount - 1])].filter(
    (index) => index >= 0
  );
};

const getParagraphText = (paragraph: unknown): string => {
  if (typeof paragraph === 'string') {
    return paragraph;
  }
  if (Array.isArray(paragraph)) {
    return paragraph.map(getParagraphText).join('');
  }
  if (paragraph && typeof paragraph === 'object' && 'paragraphs' in paragraph) {
    return getParagraphText((paragraph as { paragraphs?: unknown }).paragraphs);
  }
  return '';
};

const getParagraphPrefix = (paragraph: unknown) => {
  return Array.from(getParagraphText(paragraph).replace(/\s/gu, '')).slice(0, 3).join('');
};

export const isSamePoetry = (first: Poetry, second: Poetry) => {
  return (
    first.title === second.title &&
    first.author === second.author &&
    first.paragraphs.length === second.paragraphs.length &&
    getParagraphSampleIndexes(first.paragraphs.length).every(
      (index) =>
        getParagraphPrefix(first.paragraphs[index]) === getParagraphPrefix(second.paragraphs[index])
    )
  );
};

// 获取下一首诗词
export const getNextPoem = async (
  config: PoetrySourceConfig = DEFAULT_POETRY_SOURCE_CONFIG
): Promise<Poetry[] | null> => {
  const scopeKey = getPoetryScopeKey(config);

  return getNextRecord({
    cacheKey: `${CACHE_KEYS.POETRY_LEARNING_RECORD}:${scopeKey}`, // 按来源隔离学习记录
    // 同一书籍的分段可能共用标题和作者，通过正文行数及首、中、末行前三个非空字符区分。
    compareFn: isSamePoetry,
    getData: async () => filterPoetryData(await getPoetryData(), config), // 数据源
    unitCount: POEM_SELECTED_POEMS_COUNT, // 每次选择的数量
    reviewDays: POEM_REVIEW_COUNT, // 复习天数
    batchSize: 2,
  });
};
