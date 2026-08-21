import { PengZuEarthBranch, PengZuHeavenStem, SolarTerm, Taboo, Zodiac } from 'tyme4ts';
import { describe, expect, it } from 'vitest';

import en from '@/extension/_locales/en/messages.json';
import zhCN from '@/extension/_locales/zh_CN/messages.json';
import { AppLanguage } from '@/types/app';

import { getLunarInfo } from './lunar';
import {
  formatLunarDate,
  formatLunarGanZhiDate,
  formatSolarTerm,
  translateHolidayName,
  translateLunarActivity,
  translatePengZuTaboo,
} from './lunarI18n';

type Catalog = Record<string, { message: string }>;

const enCatalog = en as Catalog;
const zhCatalog = zhCN as Catalog;
const enT = (key: string) => enCatalog[key]?.message ?? key;
const zhT = (key: string) => zhCatalog[key]?.message ?? key;

describe('lunar i18n catalogs', () => {
  it('keeps every tyme4ts activity aligned with its bilingual English message', () => {
    Taboo.NAMES.forEach((name, index) => {
      expect(zhT(`lunar_activity_${index}`)).toBe(name);
      expect(enT(`lunar_activity_${index}`).endsWith(`「${name}」`)).toBe(true);
    });
  });

  it('keeps the official solar terms and zodiac translations aligned by source index', () => {
    SolarTerm.NAMES.forEach((name, index) => {
      expect(zhT(`lunar_solar_term_${index}`)).toBe(name);
      expect(enT(`lunar_solar_term_${index}`)).not.toBe(`lunar_solar_term_${index}`);
    });

    Zodiac.NAMES.forEach((name, index) => {
      expect(zhT(`lunar_zodiac_${index}`)).toBe(name);
      expect(enT(`lunar_zodiac_${index}`)).not.toBe(`lunar_zodiac_${index}`);
    });
  });

  it('keeps every Peng Zu taboo aligned with its bilingual English message', () => {
    PengZuHeavenStem.NAMES.forEach((name, index) => {
      expect(zhT(`lunar_pengzu_heaven_${index}`)).toBe(name);
      expect(enT(`lunar_pengzu_heaven_${index}`).endsWith(`「${name}」`)).toBe(true);
    });

    PengZuEarthBranch.NAMES.forEach((name, index) => {
      expect(zhT(`lunar_pengzu_earth_${index}`)).toBe(name);
      expect(enT(`lunar_pengzu_earth_${index}`).endsWith(`「${name}」`)).toBe(true);
    });
  });
});

describe('lunar i18n formatting', () => {
  const info = getLunarInfo(new Date(2026, 7, 21));

  it('uses official English formats for the lunar date, Gan-Zhi, zodiac, and solar term', () => {
    expect(formatLunarDate(info, AppLanguage.En, enT)).toBe(
      '9th day of the 7th Lunar Month, Bing-wu year of the Horse'
    );
    expect(formatLunarGanZhiDate(info, AppLanguage.En, enT)).toBe(
      'Bing-wu (Horse) Year · Bing-shen Month · Ding-mao Day'
    );
    expect(formatSolarTerm(info.term, info.termDayIndex, AppLanguage.En, enT)).toBe(
      'Beginning of Autumn · Day 14'
    );
  });

  it('adds the Chinese source text to English activity and Peng Zu translations', () => {
    expect(translateLunarActivity('嫁娶', AppLanguage.En, enT)).toBe('Marriage「嫁娶」');
    expect(translatePengZuTaboo('丁不剃头头必生疮', AppLanguage.En, enT)).toBe(
      'On Ding days, do not shave the head, or sores will develop「丁不剃头头必生疮」'
    );
  });

  it('keeps the original Chinese output and unknown source values unchanged', () => {
    expect(formatLunarDate(info, AppLanguage.ZhCN, zhT)).toBe('农历丙午年七月初九');
    expect(translateLunarActivity('未知事项', AppLanguage.En, enT)).toBe('未知事项');
    expect(translatePengZuTaboo('未知百忌', AppLanguage.En, enT)).toBe('未知百忌');
  });

  it('uses official weekday and public holiday names when available', () => {
    expect(translateHolidayName('周六', AppLanguage.En, enT)).toBe('Saturday');
    expect(translateHolidayName('国庆节', AppLanguage.En, enT)).toBe('National Day');
    expect(translateHolidayName('未知节日', AppLanguage.En, enT)).toBe('未知节日');
  });
});
