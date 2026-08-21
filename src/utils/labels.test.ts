import { describe, expect, it } from 'vitest';

import { MOD_CONFIG } from '@/constants';
import { AppLanguage, ChineseBasicsCategory, DataType, NeckMode, Theme } from '@/types/app';

import {
  getChineseBasicsCategoryLabel,
  getDataTypeLabel,
  getNeckModeLabel,
  getNewsLabel,
  getThemeLabel,
} from './labels';

describe('颈椎阅读模式', () => {
  it('应该提供阅读标签并保持页面不旋转', () => {
    expect(getNeckModeLabel(NeckMode.Reading)).toBe('阅读');
    expect(MOD_CONFIG[NeckMode.Reading]).toEqual({
      min: 0,
      max: 0,
      duration: 0,
    });
  });

  it('应该按主动选择的语言返回界面标签', () => {
    expect(getThemeLabel(Theme.Dark, AppLanguage.En)).toBe('Dark');
    expect(getNeckModeLabel(NeckMode.Reading, AppLanguage.En)).toBe('Reading');
    expect(getDataTypeLabel(DataType.News, AppLanguage.En)).toBe('Trending');
    expect(getNewsLabel('美食', AppLanguage.En)).toBe('Food');
    expect(getNewsLabel('Bilibili', AppLanguage.En)).toBe('Bilibili');
  });

  it('应该返回繁体中文界面标签', () => {
    expect(getThemeLabel(Theme.System, AppLanguage.ZhTW)).toBe('系統');
    expect(getNeckModeLabel(NeckMode.Reading, AppLanguage.ZhTW)).toBe('閱讀');
    expect(getDataTypeLabel(DataType.News, AppLanguage.ZhTW)).toBe('熱榜');
    expect(getNewsLabel('社会', AppLanguage.ZhTW)).toBe('社會');
  });

  it('应该返回俄语和法语界面标签', () => {
    expect(getThemeLabel(Theme.System, AppLanguage.Ru)).toBe('Системная');
    expect(getNeckModeLabel(NeckMode.Reading, AppLanguage.Ru)).toBe('Чтение');
    expect(getNewsLabel('社会', AppLanguage.Ru)).toBe('Общество');

    expect(getThemeLabel(Theme.System, AppLanguage.Fr)).toBe('Système');
    expect(getDataTypeLabel(DataType.News, AppLanguage.Fr)).toBe('Tendances');
    expect(getNewsLabel('美食', AppLanguage.Fr)).toBe('Cuisine');
  });

  it('应该提供中文基础内容及分类标签', () => {
    expect(getDataTypeLabel(DataType.ChineseBasics, AppLanguage.ZhCN)).toBe('中文基础');
    expect(getDataTypeLabel(DataType.ChineseBasics, AppLanguage.En)).toBe('Chinese Basics');
    expect(getChineseBasicsCategoryLabel(ChineseBasicsCategory.Idiom, AppLanguage.ZhTW)).toBe(
      '成語'
    );
    expect(getChineseBasicsCategoryLabel(ChineseBasicsCategory.Xiehouyu, AppLanguage.Fr)).toBe(
      'Proverbes à chute'
    );
  });
});
