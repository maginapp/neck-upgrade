import { Poetry } from '@/types/poetry';
import poetryData from '@/data/poetry.json';
import { CACHE_KEYS } from '@/constants';
import { getNextRecord } from './generateNext';

const SELECTED_POEMS_COUNT = 4;
const REVIEW_COUNT = 30; // 复习天数

// 获取下一首诗词
export const getNextPoem = async (): Promise<Poetry[] | null> => {
  return getNextRecord({
    cacheKey: CACHE_KEYS.POETRY_LEARNING_RECORD, // 缓存key
    compareFn: (a, b) => a.title === b.title && a.author === b.author, // 比较函数
    getData: () => poetryData, // 数据源
    unitCount: SELECTED_POEMS_COUNT, // 每次选择的数量
    reviewDays: REVIEW_COUNT, // 复习天数
  });
};
