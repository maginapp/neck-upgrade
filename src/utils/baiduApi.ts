import { HolidayToday, KnowledgeData, HistoricalEventWithCategory } from '../types/knowledge';
import { CacheManager } from './cacheManager';
import {
  BAIDU_BASE_URL,
  CACHE_KEYS,
  BAIDU_MAX_EVENTS_COUNT,
  BAIDU_HOLIDAY_COUNT,
  BAIDU_MATCH_CATEGORY,
} from '../constants';
import { fetchWithTimeout } from './fetch';

// 创建百度数据缓存管理器
const baiduCache = new CacheManager<KnowledgeData>(CACHE_KEYS.BAIDU_DATA);

// 处理百度百科链接，转换为完整URL, 引用链接移除
const processBaiduLinks = (html: string): string => {
  return html
    .replace(/href="\/item\/([^"]+)"/g, `href="${BAIDU_BASE_URL}/item/$1"`)
    .replace(/<sup[^>]*>.*?<\/sup>/g, '');
};

// 解析HTML内容，提取大事记和节假日信息
const parseBaiduEvents = (
  html: string
): { events: HistoricalEventWithCategory[]; holidays: HolidayToday[] } => {
  const events: HistoricalEventWithCategory[] = [];
  const holidays: HolidayToday[] = [];

  // 使用正则表达式匹配h2标签和其内容，提取id属性作为分类
  const sectionRegex =
    // const sectionRegex = /<div><h2[^>]*>(.*?)<\/h2>(.*?)(?=<h2|$)/gs;
    /<div[^>]*data-name="([^"]*)"[^>]*>.*?<h2[^>]*>(.*?)<\/h2>(.*?)(?=<div[^>]*><h2|$)/gs;

  let sectionMatch;

  while ((sectionMatch = sectionRegex.exec(html)) !== null) {
    const category = sectionMatch[1].trim();
    const title = sectionMatch[2].trim();
    const content = sectionMatch[3];

    const list = new DOMParser()
      .parseFromString(content, 'text/html')
      .querySelectorAll('[data-tag="paragraph"]');

    if (
      BAIDU_MATCH_CATEGORY.bigEvent.includes(category) ||
      BAIDU_MATCH_CATEGORY.bigEvent.includes(title)
    ) {
      // 处理历史事件
      const eventRegex = /(\d{4})年.*?/;
      for (const item of list) {
        const eventMatch = item.innerHTML.match(eventRegex);
        if (eventMatch !== null) {
          events.push({
            html: processBaiduLinks(item.innerHTML ?? ''),
            category,
          });
        }
      }
    } else if (
      BAIDU_MATCH_CATEGORY.holiday.includes(category) ||
      BAIDU_MATCH_CATEGORY.holiday.includes(title)
    ) {
      // 处理节假日信息
      for (const item of list) {
        if (item.querySelector('span[class*="bold"]')) {
          holidays.push({
            html: processBaiduLinks(item.innerHTML),
          });
        }
      }
    }
  }

  return { events, holidays };
};

// 获取百度百科页面内容
const fetchBaiduPage = async (): Promise<{ html: string; data: KnowledgeData }> => {
  try {
    const today = new Date();
    const dateStr = `${today.getMonth() + 1}月${today.getDate()}日`;
    // 检查缓存
    const cacheData = await baiduCache.get();
    if (cacheData) {
      console.log('使用缓存的百度数据');
      return {
        html: '', // 缓存命中时不需要HTML内容
        data: cacheData,
      };
    }

    // 缓存未命中，请求新数据
    const response = await fetchWithTimeout(`${BAIDU_BASE_URL}/item/${dateStr}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();

    // 解析数据
    const { events: allHistoricalEvents, holidays: allHolidays } = parseBaiduEvents(html);

    // 更新缓存
    const wikiData: KnowledgeData = {
      allHistoricalEvents,
      allHolidays,
    };
    await baiduCache.set(wikiData);
    console.log('更新百度数据缓存');

    return {
      html,
      data: wikiData,
    };
  } catch (error) {
    console.error('Error fetching wiki page:', error);
    throw error;
  }
};

// 获取历史上的今天的大事记
export const getBaiduHistoricalEvents = async (): Promise<HistoricalEventWithCategory[]> => {
  try {
    const { data } = await fetchBaiduPage();

    // 返回随机选择的记录
    return selectRandomEvents(data.allHistoricalEvents, BAIDU_MAX_EVENTS_COUNT);
  } catch (error) {
    console.error('Error fetching historical events:', error);
    return [];
  }
};

// 获取节假日信息
export const getBaiduHolidays = async (): Promise<HolidayToday[]> => {
  try {
    const { data } = await fetchBaiduPage();

    // 返回随机选择的记录
    return selectRandomHolidays(data.allHolidays, BAIDU_HOLIDAY_COUNT);
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return [];
  }
};

// 清除百度数据缓存
export const clearBaiduCache = async (): Promise<void> => {
  await baiduCache.clear();
};

// 从所有事件中随机选择指定数量的事件，确保每个分类至少有一条
const selectRandomEvents = (
  allEvents: HistoricalEventWithCategory[],
  count: number
): HistoricalEventWithCategory[] => {
  const categories = [...new Set(allEvents.map((event) => event.category))];
  const selectedEvents: HistoricalEventWithCategory[] = [];

  // 确保每个分类至少有一条记录
  categories.forEach((category) => {
    const categoryEvents = allEvents.filter((event) => event.category === category);
    if (categoryEvents.length > 0) {
      selectedEvents.push(categoryEvents[Math.floor(Math.random() * categoryEvents.length)]);
    }
  });

  // 如果还需要更多记录，从剩余事件中随机选择
  const remainingEvents = allEvents.filter((event) => !selectedEvents.includes(event));
  const remainingCount = count - selectedEvents.length;

  if (remainingCount > 0 && remainingEvents.length > 0) {
    const additionalEvents = remainingEvents
      .sort(() => Math.random() - 0.5)
      .slice(0, remainingCount);
    selectedEvents.push(...additionalEvents);
  }

  return selectedEvents;
};

// 从所有节假日中随机选择指定数量的节假日
const selectRandomHolidays = (allHolidays: HolidayToday[], count: number): HolidayToday[] => {
  return allHolidays.sort(() => Math.random() - 0.5).slice(0, count);
};
