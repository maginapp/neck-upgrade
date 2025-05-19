import { HistoricalEvent, HolidayWikiInfo } from '../types';
import { CacheManager } from './cacheManager';

const WIKI_BASE_URL = 'https://zh.wikipedia.org/wiki/';
const CACHE_KEY = 'wiki_data_cache_new_tab';
const MAX_EVENTS_PER_PAGE = 10;
const MAX_HOLIDAYS_PER_PAGE = 3;

interface HistoricalEventWithCategory extends HistoricalEvent {
  category: string;
}

interface WikiData {
  allHistoricalEvents: HistoricalEventWithCategory[];
  allHolidays: HolidayWikiInfo[];
}

// 创建维基数据缓存管理器
const wikiCache = new CacheManager<WikiData>(CACHE_KEY);

// 处理维基百科链接，将/wiki开头的路径转换为完整URL
const processWikiLinks = (html: string): string => {
  return html.replace(/href="\/wiki\/([^"]+)"/g, 'href="https://zh.wikipedia.org/wiki/$1"');
};

// 解析HTML内容，提取大事记和节假日信息
const parseWikiEvents = (html: string): { events: HistoricalEventWithCategory[]; holidays: HolidayWikiInfo[] } => {
  const events: HistoricalEventWithCategory[] = [];
  const holidays: HolidayWikiInfo[] = [];
  
  // 使用正则表达式匹配h2标签和其内容，提取id属性作为分类
  const sectionRegex = /<h2[^>]*id="([^"]*)"[^>]*>.*?<\/h2>(.*?)(?=<h2|$)/gs;
  let sectionMatch;
  
  while ((sectionMatch = sectionRegex.exec(html)) !== null) {
    const category = sectionMatch[1].trim();
    const content = sectionMatch[2];
    
    const list = new DOMParser().parseFromString(content, 'text/html').querySelectorAll('li');

    if (category === '大事记') {
      // 处理历史事件
      const eventRegex = /(\d{4})年.*?/;
      for (const item of list) {
        const eventMatch = item.innerHTML.match(eventRegex);
        if (eventMatch !== null) {
          events.push({
            year: eventMatch[1],
            html: processWikiLinks(item.innerHTML ?? ''),
            category,
            content: item.textContent ?? '',
          });
        }
      }
    } else if (category === '节假日和习俗') {
      // 处理节假日信息
      for (const item of list) {
        const text = item.textContent ?? '';
        if (text.includes('节') || text.includes('日')) {
          holidays.push({
            name: text,
            region: text.split(/[：:]/)[1]?.trim() ?? '',
            html: processWikiLinks(item.innerHTML)
          });
        }
      }
    }
  }
  
  return { events, holidays };
};

// 获取维基百科页面内容
const fetchWikiPage = async (dateStr: string): Promise<{ html: string; data: WikiData }> => {
  try {
    // 检查缓存
    const cacheData = await wikiCache.get();
    if (cacheData) {
      console.log('使用缓存的维基数据');
      return {
        html: '', // 缓存命中时不需要HTML内容
        data: cacheData
      };
    }

    // 缓存未命中，请求新数据
    const response = await fetch(`${WIKI_BASE_URL}${dateStr}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();

    // 解析数据
    const { events: allHistoricalEvents, holidays: allHolidays } = parseWikiEvents(html);

    // 更新缓存
    const wikiData: WikiData = {
      allHistoricalEvents,
      allHolidays
    };
    await wikiCache.set(wikiData);
    console.log('更新维基数据缓存');

    return {
      html,
      data: wikiData
    };
  } catch (error) {
    console.error('Error fetching wiki page:', error);
    throw error;
  }
};

// 获取历史上的今天的大事记
export const getHistoricalEvents = async (): Promise<HistoricalEventWithCategory[]> => {
  try {
    const today = new Date();
    const dateStr = `${today.getMonth() + 1}月${today.getDate()}日`;
    const { data } = await fetchWikiPage(dateStr);
    
    // 返回随机选择的10条记录
    return selectRandomEvents(data.allHistoricalEvents, MAX_EVENTS_PER_PAGE);
  } catch (error) {
    console.error('Error fetching historical events:', error);
    return [];
  }
};

// 获取节假日信息
export const getHolidays = async (): Promise<HolidayWikiInfo[]> => {
  try {
    const today = new Date();
    const dateStr = `${today.getMonth() + 1}月${today.getDate()}日`;
    const { data } = await fetchWikiPage(dateStr);
    
    // 返回随机选择的3条记录
    return selectRandomHolidays(data.allHolidays, MAX_HOLIDAYS_PER_PAGE);
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return [];
  }
};

// 清除维基数据缓存
export const clearWikiCache = async (): Promise<void> => {
  await wikiCache.clear();
};

// 从所有事件中随机选择指定数量的事件，确保每个分类至少有一条
const selectRandomEvents = (allEvents: HistoricalEventWithCategory[], count: number): HistoricalEventWithCategory[] => {
  const categories = [...new Set(allEvents.map(event => event.category))];
  const selectedEvents: HistoricalEventWithCategory[] = [];
  
  // 确保每个分类至少有一条记录
  categories.forEach(category => {
    const categoryEvents = allEvents.filter(event => event.category === category);
    if (categoryEvents.length > 0) {
      selectedEvents.push(categoryEvents[Math.floor(Math.random() * categoryEvents.length)]);
    }
  });
  
  // 如果还需要更多记录，从剩余事件中随机选择
  const remainingEvents = allEvents.filter(event => !selectedEvents.includes(event));
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
const selectRandomHolidays = (allHolidays: HolidayWikiInfo[], count: number): HolidayWikiInfo[] => {
  return allHolidays
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}; 