import { HistoricalEvent, HolidayInfo } from '../types';

const WIKI_BASE_URL = 'https://zh.wikipedia.org/wiki/';

interface HistoricalEventWithCategory extends HistoricalEvent {
  category: string;
}

// 移除HTML标签，获取纯文本内容
const stripHtml = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// 解析HTML内容，提取大事记
const parseHistoricalEvents = (html: string): HistoricalEventWithCategory[] => {
  const events: HistoricalEventWithCategory[] = [];
  
  // 使用正则表达式匹配h2标签和其内容，提取id属性作为分类
  // const sectionRegex = /<h2[^>]*id="([^"]*)"[^>]*>.*?<\/h2>.*?<ul>(.*?)<\/ul>/gs;

  const sectionRegex = /<h2[^>]*id="([^"]*)"[^>]*>.*?<\/h2>(.*?)(?=<h2|$)/gs;
  let sectionMatch;
  
  while ((sectionMatch = sectionRegex.exec(html)) !== null) {
    const category = sectionMatch[1].trim();
    const content = sectionMatch[2];
    
    // 在h2标签下的ul中查找事件
    const eventRegex = /<li>(\d{4})年[：:]\s*(.*?)<\/li>/g;
    let eventMatch;

    // const list = new DOMParser().parseFromString(content, 'text/html');
    // console.log(list);
    
    while ((eventMatch = eventRegex.exec(content)) !== null) {
      const description = eventMatch[2].trim();
      events.push({
        year: eventMatch[1],
        description,
        category,
        content: `${eventMatch[1]}年：${stripHtml(description)}`
      });
    }
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
export const getHistoricalEvents = async (): Promise<HistoricalEventWithCategory[]> => {
  try {
    const today = new Date();
    const dateStr = `${today.getMonth() + 1}月${today.getDate()}日`;
    const html = await fetchWikiPage(dateStr);
    const events = parseHistoricalEvents(html);
    
    // 随机选择10条记录，但保持每个分类至少有一条记录
    const categories = [...new Set(events.map(event => event.category))];
    const selectedEvents: HistoricalEventWithCategory[] = [];
    
    // 确保每个分类至少有一条记录
    categories.forEach(category => {
      const categoryEvents = events.filter(event => event.category === category);
      if (categoryEvents.length > 0) {
        selectedEvents.push(categoryEvents[Math.floor(Math.random() * categoryEvents.length)]);
      }
    });
    
    // 如果还需要更多记录，从剩余事件中随机选择
    const remainingEvents = events.filter(event => !selectedEvents.includes(event));
    const remainingCount = 10 - selectedEvents.length;
    
    if (remainingCount > 0 && remainingEvents.length > 0) {
      const additionalEvents = remainingEvents
        .sort(() => Math.random() - 0.5)
        .slice(0, remainingCount);
      selectedEvents.push(...additionalEvents);
    }
    
    return selectedEvents;
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