import { describe, expect, it } from 'vitest';

import { CHINESE_BASICS_BATCH_SIZES, CHINESE_BASICS_CATEGORIES } from '@/constants';
import { ChineseBasicsEntry } from '@/types';
import { ChineseBasicsCategory } from '@/types/app';

import {
  getChineseBasicsScopeKey,
  isSameChineseBasicsEntry,
  pickChineseBasicsCategories,
} from './chineseBasicsLearning';

describe('中文基础学习内容', () => {
  it('全部模式只选择互不重复的实际分类', () => {
    const categories = pickChineseBasicsCategories(4, () => 0);

    expect(categories).toEqual(CHINESE_BASICS_CATEGORIES);
    expect(categories).not.toContain(ChineseBasicsCategory.All);
    expect(new Set(categories).size).toBe(categories.length);
  });

  it('缓存作用域按分类隔离', () => {
    expect(getChineseBasicsScopeKey({ category: ChineseBasicsCategory.Idiom })).toBe('idiom');
    expect(getChineseBasicsScopeKey({ category: ChineseBasicsCategory.Word })).toBe('word');
  });

  it('歇后语和词语每批展示四条，其他模式保持两条', () => {
    expect(CHINESE_BASICS_BATCH_SIZES[ChineseBasicsCategory.Xiehouyu]).toBe(4);
    expect(CHINESE_BASICS_BATCH_SIZES[ChineseBasicsCategory.Word]).toBe(4);
    expect(CHINESE_BASICS_BATCH_SIZES[ChineseBasicsCategory.Idiom]).toBe(2);
    expect(CHINESE_BASICS_BATCH_SIZES[ChineseBasicsCategory.Character]).toBe(2);
    expect(CHINESE_BASICS_BATCH_SIZES[ChineseBasicsCategory.All]).toBe(2);
  });

  it('分类和稳定键共同标识一条记录', () => {
    const idiom: ChineseBasicsEntry = {
      category: ChineseBasicsCategory.Idiom,
      key: '画龙点睛',
      title: '画龙点睛',
    };
    const same = { ...idiom, explanation: '释义' };
    const word: ChineseBasicsEntry = {
      category: ChineseBasicsCategory.Word,
      key: '画龙点睛',
      title: '画龙点睛',
    };

    expect(isSameChineseBasicsEntry(idiom, same)).toBe(true);
    expect(isSameChineseBasicsEntry(idiom, word)).toBe(false);
  });
});
