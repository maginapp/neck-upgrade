import { HolidayToday, KnowledgeData, HistoricalEvent } from '@/types';

import { BAIDU_BASE_URL, CACHE_KEYS, BAIDU_MATCH_CATEGORY } from '../constants';

import { dateUtils } from './base';
import { fetchUtils } from './fetch';
import { createKnowledgeManager } from './knowledgeManager';

// 处理百度百科链接，转换为完整URL, 引用链接移除
const processBaiduLinks = (html: string): string => {
  return html
    .replace(/href="\/item\/([^"]+)"/g, `href="${BAIDU_BASE_URL}/item/$1" target="_blank"`)
    .replace(/href="\/pic\/([^"]+)"/g, `href="${BAIDU_BASE_URL}/pic/$1"`)
    .replace(/<sup[^>]*>.*?<\/sup>/g, '');
};

// 解析HTML内容，提取大事记和节假日信息
const parseBaiduEvents = (
  html: string
): { events: HistoricalEvent[]; holidays: HolidayToday[] } => {
  const events: HistoricalEvent[] = [];
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

const getTodayDateStr = () => {
  const today = dateUtils.getNow();
  return `${today.getMonth() + 1}月${today.getDate()}日`;
};

// 获取百度百科页面内容
const fetchBaiduPage = async (): Promise<KnowledgeData> => {
  try {
    const dateStr = getTodayDateStr();
    // 缓存未命中，请求新数据
    const response = await fetchUtils(`${BAIDU_BASE_URL}/item/${dateStr}`, { cacheFetch: true });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();

    // 解析数据
    const { events: allHistoricalEvents, holidays: allHolidays } = parseBaiduEvents(html);

    // 更新缓存
    const pageData: KnowledgeData = {
      allHistoricalEvents,
      allHolidays,
    };

    return pageData;
  } catch (error) {
    console.error('Error fetching baidu page:', error);
    throw error;
  }
};

export const baiduManager = createKnowledgeManager(CACHE_KEYS.BAIDU_DATA, fetchBaiduPage);
