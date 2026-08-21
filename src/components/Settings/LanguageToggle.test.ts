import { describe, expect, it } from 'vitest';

import { APP_LANGUAGE_SEQUENCE, getNextAppLanguage } from '@/i18n/languages';
import { AppLanguage } from '@/types/app';

describe('language toggle', () => {
  it('cycles languages in the configured order', () => {
    expect(APP_LANGUAGE_SEQUENCE).toEqual([
      AppLanguage.ZhCN,
      AppLanguage.ZhTW,
      AppLanguage.En,
      AppLanguage.Ru,
      AppLanguage.Fr,
    ]);
    expect(APP_LANGUAGE_SEQUENCE.map(getNextAppLanguage)).toEqual([
      AppLanguage.ZhTW,
      AppLanguage.En,
      AppLanguage.Ru,
      AppLanguage.Fr,
      AppLanguage.ZhCN,
    ]);
  });
});
