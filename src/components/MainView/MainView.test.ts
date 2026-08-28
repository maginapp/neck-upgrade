import { describe, expect, it } from 'vitest';

import { getPanelScale, getPanelTransform } from './MainView';

describe('MainView panel scale', () => {
  it('单栏不添加缩放', () => {
    expect(getPanelScale(1, 600, 600)).toBe(1);
    expect(getPanelTransform(35, 1, 600, 600)).toBe('rotate(35deg)');
  });

  it('多栏缩放只取决于容器宽高比', () => {
    expect(getPanelTransform(15, 3, 600, 600)).toBe('rotate(15deg) scale(0.679)');
    expect(getPanelTransform(75, 3, 600, 600)).toBe('rotate(75deg) scale(0.679)');
  });

  it('多栏缩放不低于 0.6', () => {
    expect(getPanelScale(4, 1000, 300)).toBe(0.6);
    expect(getPanelTransform(45, 4, 1000, 300)).toBe('rotate(45deg) scale(0.600)');
  });
});
