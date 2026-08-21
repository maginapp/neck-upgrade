import { describe, expect, it } from 'vitest';

import { MOD_CONFIG } from '@/constants';
import { AppLanguage, DataType, NeckMode, Theme } from '@/types/app';

import { getDataTypeLabel, getNeckModeLabel, getNewsLabel, getThemeLabel } from './labels';

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
});
