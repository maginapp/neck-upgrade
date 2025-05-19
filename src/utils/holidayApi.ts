import { HolidayInfo, NextHolidayResponse } from '../types';

const HOLIDAY_API_BASE_URL = 'https://timor.tech/api/holiday';

// 获取下一个节假日信息
export const getNextHoliday = async (): Promise<HolidayInfo | null> => {
  try {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const response = await fetch(`${HOLIDAY_API_BASE_URL}/next/${dateStr}?type=Y&week=Y`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: NextHolidayResponse = await response.json();
    
    if (data.code === 0 && data.holiday) {
      return {
        name: data.holiday.name,
        date: data.holiday.date,
        isOffDay: data.holiday.holiday
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching next holiday:', error);
    return null;
  }
}; 