import { HOLIDAY_API_BASE_URL, CACHE_KEYS } from '@/constants';
import { CacheManager } from './cacheManager';
import { HolidayApiResponse, HolidayDisplayInfo } from '@/types';
import { getCurrentDate } from './base';

// const CACHE_KEY = 'holiday_data_cache';

interface HolidayCacheData {
  nextHoliday: HolidayDisplayInfo | null;
  timestamp: string;
}

// 创建节假日数据缓存管理器
const holidayCache = new CacheManager<HolidayCacheData>(CACHE_KEYS.TIMOR_TECH_API_HOLIDAY);

// 获取下一个节假日信息
export const getNextHoliday = async (): Promise<HolidayDisplayInfo | null> => {
  try {
    // 检查缓存
    const cacheData = await holidayCache.get();
    if (cacheData) {
      console.log('使用缓存的节假日数据');
      return cacheData.nextHoliday;
    }

    const dateStr = getCurrentDate();
    const response = await fetch(`${HOLIDAY_API_BASE_URL}/next/${dateStr}?type=Y&week=Y`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: HolidayApiResponse = await response.json();

    let nextHoliday: HolidayDisplayInfo | null = null;
    if (data.code === 0 && data.holiday) {
      nextHoliday = {
        name: data.holiday.name,
        date: data.holiday.date,
        rest: data.holiday.rest,
      };
    }

    // 更新缓存
    await holidayCache.set({
      nextHoliday,
      timestamp: new Date().toISOString(),
    });

    return nextHoliday;
  } catch (error) {
    console.error('Error fetching next holiday:', error);
    return null;
  }
};

// 清除holidayCache数据缓存
export const clearHolidayCache = async (): Promise<void> => {
  await holidayCache.clear();
};
