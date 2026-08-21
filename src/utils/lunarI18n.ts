import {
  LunarFestival,
  PengZuEarthBranch,
  PengZuHeavenStem,
  SolarFestival,
  SolarTerm,
  Taboo,
  Zodiac,
} from 'tyme4ts';

import { AppLanguage } from '@/types/app';

import type { LunarInfo } from './lunar';

type Translate = (key: string) => string;

const HEAVENLY_STEM_ROMANIZATION: Record<string, string> = {
  甲: 'Jia',
  乙: 'Yi',
  丙: 'Bing',
  丁: 'Ding',
  戊: 'Wu',
  己: 'Ji',
  庚: 'Geng',
  辛: 'Xin',
  壬: 'Ren',
  癸: 'Gui',
};

const EARTHLY_BRANCH_ROMANIZATION: Record<string, string> = {
  子: 'zi',
  丑: 'chou',
  寅: 'yin',
  卯: 'mao',
  辰: 'chen',
  巳: 'si',
  午: 'wu',
  未: 'wei',
  申: 'shen',
  酉: 'you',
  戌: 'xu',
  亥: 'hai',
};

const WEEKDAY_MESSAGE_KEYS: Record<string, string> = {
  周一: 'holiday_weekday_monday',
  周二: 'holiday_weekday_tuesday',
  周三: 'holiday_weekday_wednesday',
  周四: 'holiday_weekday_thursday',
  周五: 'holiday_weekday_friday',
  周六: 'holiday_weekday_saturday',
  周日: 'holiday_weekday_sunday',
  周天: 'holiday_weekday_sunday',
};

const HOLIDAY_MESSAGE_KEYS: Record<string, string> = {
  元旦: 'holiday_new_years_day',
  元旦节: 'holiday_new_years_day',
  春节: 'holiday_spring_festival',
  清明: 'holiday_qingming_festival',
  清明节: 'holiday_qingming_festival',
  劳动节: 'holiday_labor_day',
  端午: 'holiday_dragon_boat_festival',
  端午节: 'holiday_dragon_boat_festival',
  中秋: 'holiday_mid_autumn_festival',
  中秋节: 'holiday_mid_autumn_festival',
  国庆: 'holiday_national_day',
  国庆节: 'holiday_national_day',
};

const translateIndexedName = (
  name: string,
  names: string[],
  messagePrefix: string,
  t: Translate
) => {
  const index = names.indexOf(name);
  if (index < 0) {
    return name;
  }

  const key = `${messagePrefix}_${index}`;
  const translated = t(key);
  return translated === key ? name : translated;
};

const toOrdinal = (value: number) => {
  const remainder100 = value % 100;
  if (remainder100 >= 11 && remainder100 <= 13) {
    return `${value}th`;
  }

  switch (value % 10) {
    case 1:
      return `${value}st`;
    case 2:
      return `${value}nd`;
    case 3:
      return `${value}rd`;
    default:
      return `${value}th`;
  }
};

const romanizeSixtyCycle = (name: string) => {
  const stem = HEAVENLY_STEM_ROMANIZATION[name[0]];
  const branch = EARTHLY_BRANCH_ROMANIZATION[name[1]];
  return stem && branch ? `${stem}-${branch}` : name;
};

export const formatLunarDate = (info: LunarInfo, language: AppLanguage, t: Translate) => {
  if (language === AppLanguage.ZhCN) {
    return info.lunarDate;
  }

  if (language === AppLanguage.ZhTW) {
    return `${t('lunar_calendar_prefix')}${info.lunarDate
      .replace(/^农历/, '')
      .replace(/闰/g, '閏')}`;
  }

  const zodiac = translateIndexedName(info.zodiac, Zodiac.NAMES, 'lunar_zodiac', t);
  const monthNumber = Math.abs(info.lunarMonth);

  if (language === AppLanguage.Ru) {
    const month = `${info.isLeapMonth ? 'дополнительного ' : ''}${monthNumber}-го`;
    return `${info.lunarDay}-й день ${month} лунного месяца, год ${romanizeSixtyCycle(
      info.ganZhiYearName
    )} (${zodiac})`;
  }

  if (language === AppLanguage.Fr) {
    const month = `${monthNumber}e mois lunaire${info.isLeapMonth ? ' intercalaire' : ''}`;
    return `${info.lunarDay}e jour du ${month}, année ${romanizeSixtyCycle(
      info.ganZhiYearName
    )} (${zodiac})`;
  }

  const month = `${info.isLeapMonth ? 'Leap ' : ''}${toOrdinal(monthNumber)}`;

  return `${toOrdinal(info.lunarDay)} day of the ${month} Lunar Month, ${romanizeSixtyCycle(
    info.ganZhiYearName
  )} year of the ${zodiac}`;
};

export const formatLunarGanZhiDate = (info: LunarInfo, language: AppLanguage, t: Translate) => {
  if (language === AppLanguage.ZhCN) {
    return info.lunarDanZhiDate;
  }

  if (language === AppLanguage.ZhTW) {
    const zodiac = translateIndexedName(info.zodiac, Zodiac.NAMES, 'lunar_zodiac', t);
    return `${info.ganZhiYearName.replace(/年$/, '')}(${zodiac})年 ${info.ganZhiMonthName} ${
      info.ganZhiDayName
    }`;
  }

  const zodiac = translateIndexedName(info.zodiac, Zodiac.NAMES, 'lunar_zodiac', t);
  if (language === AppLanguage.Ru) {
    return `Год ${romanizeSixtyCycle(info.ganZhiYearName)} (${zodiac}) · месяц ${romanizeSixtyCycle(
      info.ganZhiMonthName
    )} · день ${romanizeSixtyCycle(info.ganZhiDayName)}`;
  }

  if (language === AppLanguage.Fr) {
    return `Année ${romanizeSixtyCycle(info.ganZhiYearName)} (${zodiac}) · mois ${romanizeSixtyCycle(
      info.ganZhiMonthName
    )} · jour ${romanizeSixtyCycle(info.ganZhiDayName)}`;
  }

  return `${romanizeSixtyCycle(info.ganZhiYearName)} (${zodiac}) Year · ${romanizeSixtyCycle(
    info.ganZhiMonthName
  )} Month · ${romanizeSixtyCycle(info.ganZhiDayName)} Day`;
};

export const formatSolarTerm = (
  term: string,
  dayIndex: number,
  language: AppLanguage,
  t: Translate
) => {
  if (language === AppLanguage.ZhCN || language === AppLanguage.ZhTW) {
    const translatedTerm = translateIndexedName(term, SolarTerm.NAMES, 'lunar_solar_term', t);
    return `${translatedTerm}${
      dayIndex ? `${t('header_term_day_prefix')}${dayIndex}${t('header_day')}` : ''
    }`;
  }

  const translatedTerm = translateIndexedName(term, SolarTerm.NAMES, 'lunar_solar_term', t);
  return `${translatedTerm}${dayIndex ? ` · ${t('header_term_day_prefix')}${dayIndex}` : ''}`;
};

export const translateLunarActivity = (name: string, language: AppLanguage, t: Translate) =>
  language === AppLanguage.ZhCN
    ? name
    : translateIndexedName(name, Taboo.NAMES, 'lunar_activity', t);

export const translateFestival = (name: string, language: AppLanguage, t: Translate) => {
  if (language !== AppLanguage.ZhTW) {
    return name;
  }

  if (LunarFestival.NAMES.includes(name)) {
    return translateIndexedName(name, LunarFestival.NAMES, 'lunar_festival', t);
  }

  return translateIndexedName(name, SolarFestival.NAMES, 'solar_festival', t);
};

export const translatePengZuTaboo = (name: string, language: AppLanguage, t: Translate) => {
  if (language === AppLanguage.ZhCN) {
    return name;
  }

  if (PengZuHeavenStem.NAMES.includes(name)) {
    return translateIndexedName(name, PengZuHeavenStem.NAMES, 'lunar_pengzu_heaven', t);
  }

  return translateIndexedName(name, PengZuEarthBranch.NAMES, 'lunar_pengzu_earth', t);
};

export const translateHolidayName = (name: string, language: AppLanguage, t: Translate) => {
  if (language === AppLanguage.ZhCN) {
    return name;
  }

  const weekdayKey = WEEKDAY_MESSAGE_KEYS[name];
  if (weekdayKey) {
    const translatedWeekday = t(weekdayKey);
    return translatedWeekday === weekdayKey ? name : translatedWeekday;
  }

  const key = HOLIDAY_MESSAGE_KEYS[name];
  if (!key) {
    return name;
  }

  const translated = t(key);
  return translated === key ? name : translated;
};
