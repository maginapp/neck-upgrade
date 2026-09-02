import { describe, expect, it } from 'vitest';

import {
  ALL_POETRY_SOURCES,
  getPoetrySourceOptions,
  PoetrySource,
  PoetrySourceCategory,
} from './poetry';

describe('getPoetrySourceOptions', () => {
  it('一级分类为全部时平铺返回所有二级来源', () => {
    expect(getPoetrySourceOptions(PoetrySourceCategory.All).map((source) => source.value)).toEqual(
      ALL_POETRY_SOURCES
    );
  });

  it('一级分类确定时仅返回对应的二级来源', () => {
    expect(
      getPoetrySourceOptions(PoetrySourceCategory.Primer).map((source) => source.value)
    ).toEqual([PoetrySource.Zengguang, PoetrySource.Qianziwen]);
  });
});
