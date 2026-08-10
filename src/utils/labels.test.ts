import { describe, expect, it } from 'vitest';

import { MOD_CONFIG } from '@/constants';
import { NeckMode } from '@/types/app';

import { getNeckModeLabel } from './labels';

describe('颈椎阅读模式', () => {
  it('应该提供阅读标签和小角度定时切换配置', () => {
    expect(getNeckModeLabel(NeckMode.Reading)).toBe('阅读');
    expect(MOD_CONFIG[NeckMode.Reading]).toEqual({
      min: 15,
      max: 60,
      duration: 5,
    });
  });
});
