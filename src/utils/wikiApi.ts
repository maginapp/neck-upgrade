import { HistoricalEvent, HolidayInfo } from '../types';

const WIKI_BASE_URL = 'https://zh.wikipedia.org/wiki/';

// 解析HTML内容，提取大事记
const parseHistoricalEvents = (html: string): HistoricalEvent[] => {
  const events: HistoricalEvent[] = [];
  const eventRegex = /<li>(\d{4})年[：:]\s*(.*?)<\/li>/g;
  let match;
  
  while ((match = eventRegex.exec(html)) !== null) {
    events.push({
      year: match[1],
      description: match[2].trim()
    });
  }
  
  return events;
};

// 解析HTML内容，提取节假日信息
const parseHolidays = (html: string): HolidayInfo[] => {
  const holidays: HolidayInfo[] = [];
  const holidayRegex = /<li>(.*?)(?:节|日)[：:]\s*(.*?)(?:<a href="(.*?)".*?<\/a>)?<\/li>/g;
  let match;
  
  while ((match = holidayRegex.exec(html)) !== null) {
    holidays.push({
      name: match[1].trim(),
      date: match[2].trim(),
      link: match[3] ? `https://zh.wikipedia.org${match[3]}` : undefined
    });
  }
  
  return holidays;
};

// 获取维基百科页面内容
const fetchWikiPage = async (dateStr: string): Promise<string> => {
  try {
    const response = await fetch(`${WIKI_BASE_URL}${dateStr}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching wiki page:', error);
    throw error;
  }
};

// 获取历史上的今天的大事记
export const getHistoricalEvents = async (): Promise<HistoricalEvent[]> => {
  try {
    const today = new Date();
    const dateStr = `${today.getMonth() + 1}月${today.getDate()}日`;
    const html = await fetchWikiPage(dateStr);
    const events = parseHistoricalEvents(html);
    
    // 随机选择10条记录
    return events.sort(() => Math.random() - 0.5).slice(0, 10);
  } catch (error) {
    console.error('Error fetching historical events:', error);
    return [];
  }
};

// 获取节假日信息
export const getHolidays = async (): Promise<HolidayInfo[]> => {
  try {
    const today = new Date();
    const dateStr = `${today.getMonth() + 1}月${today.getDate()}日`;
    const html = await fetchWikiPage(dateStr);
    const holidays = parseHolidays(html);
    
    // 随机选择3条记录
    return holidays.sort(() => Math.random() - 0.5).slice(0, 3);
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return [];
  }
}; 