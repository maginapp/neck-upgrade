import { SolarDay } from 'tyme4ts';

export type LunarInfo = ReturnType<typeof getLunarInfo>;

// export interface LunarInfo {
//   lunarDate: string;
//   term: string; // 节气
//   termDayIndex: number; // 节气日索引
//   festivals: string[]; // 公历节日 & 农历节日
//   pengZu: string[]; // 彭祖百忌
//   daySuit: string[]; // 每日宜忌 宜
//   dayAvoid: string[]; // 每日宜忌 忌
//   rainDay: string; // 雨天
//   solar: any; // 阳历
// }

export const getLunarInfo = (date: Date) => {
  const solar = SolarDay.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const lunar = solar.getLunarDay();

  // 农历日期
  const lunarDate = lunar.toString();

  // 节气
  const solarTerm = solar.getTerm();
  const solarTermDay = solar.getTermDay();
  const solarTermDayIndex = solarTermDay.getDayIndex();

  // 公历节日 & 农历节日
  const festivals = [solar.getFestival()?.getName(), lunar.getFestival()?.getName()].filter(
    (item: string | undefined): item is string => !!item
  );

  // SixtyCycle
  const sixtyCycle = lunar.getSixtyCycle();

  // 彭祖百忌
  const pengZu = [
    sixtyCycle.getPengZu().getPengZuHeavenStem().getName(),
    sixtyCycle.getPengZu().getPengZuEarthBranch().getName(),
  ].filter((item) => item);

  // 每日宜忌
  const daySuit = lunar.getRecommends().map((item) => item.getName());
  const dayAvoid = lunar.getAvoids().map((item) => item.getName());

  return {
    lunarDate,
    term: solarTerm.getName(), // 节气
    termDayIndex: solarTermDayIndex, // 节气日索引
    festivals, // 公历节日 & 农历节日
    pengZu, // 彭祖百忌
    daySuit, // 每日宜忌 宜
    dayAvoid, // 每日宜忌 忌
    rainDay: solar.getPlumRainDay()?.toString() || '', // 雨天
    julianDay: solar.getJulianDay().toString(), // 儒略日
    solar: solar,
  };
};

// https://wannianrili.bmcx.com/

// https://6tail.cn/tyme.html
