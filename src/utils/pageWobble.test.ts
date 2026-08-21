import { describe, expect, it } from 'vitest';

import {
  DEFAULT_PAGE_WOBBLE_CONFIG,
  getPageWobbleDomainAccess,
  getPageWobbleCyclePosition,
  getPageWobbleCycleSeconds,
  getPageWobbleRemainingSeconds,
  isPageWobbleSupportedUrl,
  normalizePageWobbleDomain,
  normalizePageWobbleConfig,
  normalizePageWobbleDomainRules,
  PAGE_WOBBLE_CYCLE_SLIDER_MAX,
} from './pageWobble';

describe('页面摇摆配置', () => {
  it('应该补全非法配置并限制角度与周期范围', () => {
    expect(normalizePageWobbleConfig(null)).toEqual(DEFAULT_PAGE_WOBBLE_CONFIG);
    expect(normalizePageWobbleConfig({ angle: -10, cycleSeconds: 5000 })).toEqual({
      angle: 0,
      cycleSeconds: 3600,
      randomAngle: false,
    });
    expect(normalizePageWobbleConfig({ angle: 220, cycleSeconds: 60, randomAngle: true })).toEqual({
      angle: 180,
      cycleSeconds: 60,
      randomAngle: true,
    });
    expect(normalizePageWobbleConfig({ angle: 14.6, cycleSeconds: 29 })).toEqual({
      angle: 15,
      cycleSeconds: 29,
      randomAngle: false,
    });
  });

  it('应该把旧版分钟配置迁移为秒', () => {
    expect(normalizePageWobbleConfig({ angle: 20, cycleMinutes: 5 })).toEqual({
      angle: 20,
      cycleSeconds: 300,
      randomAngle: false,
    });
  });

  it('应该按时间范围使用 1 秒、5 秒、15 秒、30 秒和 1 分钟精度', () => {
    const position1Minute = getPageWobbleCyclePosition(60);
    const position3Minutes = getPageWobbleCyclePosition(180);
    const position5Minutes = getPageWobbleCyclePosition(300);
    const position15Minutes = getPageWobbleCyclePosition(900);

    expect(getPageWobbleCycleSeconds(position1Minute - 1)).toBe(59);
    expect(getPageWobbleCycleSeconds(position1Minute + 1)).toBe(65);
    expect(getPageWobbleCycleSeconds(position3Minutes - 1)).toBe(175);
    expect(getPageWobbleCycleSeconds(position3Minutes + 1)).toBe(195);
    expect(getPageWobbleCycleSeconds(position5Minutes - 1)).toBe(285);
    expect(getPageWobbleCycleSeconds(position5Minutes + 1)).toBe(330);
    expect(getPageWobbleCycleSeconds(position15Minutes - 1)).toBe(870);
    expect(getPageWobbleCycleSeconds(position15Minutes + 1)).toBe(960);
  });

  it('每个滑杆位置都应该对应唯一且递增的周期', () => {
    const values = Array.from({ length: PAGE_WOBBLE_CYCLE_SLIDER_MAX + 1 }, (_, position) =>
      getPageWobbleCycleSeconds(position)
    );

    expect(values[0]).toBe(1);
    expect(values.at(-1)).toBe(3600);
    expect(values.every((value, index) => index === 0 || value > values[index - 1])).toBe(true);
  });

  it('周期值与滑杆位置应该能够近似双向转换', () => {
    [0, 20, 50, 80, PAGE_WOBBLE_CYCLE_SLIDER_MAX].forEach((position) => {
      const seconds = getPageWobbleCycleSeconds(position);
      expect(getPageWobbleCyclePosition(seconds)).toBe(position);
    });
  });

  it('应该根据下一次变化时间生成循环倒计时', () => {
    expect(getPageWobbleRemainingSeconds(70_000, 60, 10_000)).toBe(60);
    expect(getPageWobbleRemainingSeconds(70_000, 60, 69_200)).toBe(1);
    expect(getPageWobbleRemainingSeconds(70_000, 60, 70_000)).toBe(60);
    expect(getPageWobbleRemainingSeconds(null, 60, 10_000)).toBeNull();
  });

  it('只允许控制普通 HTTP 和 HTTPS 页面', () => {
    expect(isPageWobbleSupportedUrl('https://example.com/article')).toBe(true);
    expect(isPageWobbleSupportedUrl('http://localhost:5173')).toBe(true);
    expect(isPageWobbleSupportedUrl('chrome://extensions/')).toBe(false);
    expect(isPageWobbleSupportedUrl('chrome-extension://extension-id/page.html')).toBe(false);
  });

  it('应该归一化域名和黑白名单', () => {
    expect(normalizePageWobbleDomain(' HTTPS://WWW.Example.com/path ')).toBe('www.example.com');
    expect(normalizePageWobbleDomain('*.example.com')).toBe('example.com');
    expect(
      normalizePageWobbleDomainRules({
        whitelist: ['Example.com', 'https://example.com/path', ''],
        blacklist: ['ads.example.com', 'ADS.EXAMPLE.COM'],
      })
    ).toEqual({
      whitelist: ['example.com'],
      blacklist: ['ads.example.com'],
    });
  });

  it('黑名单优先且父域名规则应该匹配子域名', () => {
    const rules = {
      whitelist: ['example.com'],
      blacklist: ['ads.example.com'],
    };

    expect(getPageWobbleDomainAccess('www.example.com', rules)).toBe('allowed');
    expect(getPageWobbleDomainAccess('news.ads.example.com', rules)).toBe('blacklisted');
    expect(getPageWobbleDomainAccess('other.com', rules)).toBe('not-whitelisted');
    expect(getPageWobbleDomainAccess('other.com', { whitelist: [], blacklist: [] })).toBe(
      'allowed'
    );
  });
});
