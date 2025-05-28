import { HolidayToday, KnowledgeData, HistoricalEvent } from '@/types';

import { WIKI_BASE_URL, CACHE_KEYS, WIKI_MATCH_CATEGORY } from '../constants';

import { dateUtils } from './base';
import { CacheManager } from './cacheManager';
import { fetchUtils } from './fetch';
import { createKnowledgeManager } from './knowledgeManager';

// 创建维基数据缓存管理器
const wikiCache = new CacheManager<KnowledgeData>(CACHE_KEYS.WIKI_DATA);

// 处理维基百科链接，将/wiki开头的路径转换为完整URL/ //upload图片添加 https, 引用链接移除
const processWikiLinks = (html: string): string => {
  return html
    .replace(/href="\/wiki\/([^"]+)"/g, 'href="https://zh.wikipedia.org/wiki/$1"')
    .replace(/<a[^>]*href="#cite_note-[^"]*"[^>]*>.*?<\/a>/g, '')
    .replace(/src="\/\/upload\.wikimedia\.org\/([^"]+)"/g, 'src="https://upload.wikimedia.org/$1"')
    .replace(
      /srcset="\/\/upload\.wikimedia\.org\/([^"]+)"/g,
      'src="https://upload.wikimedia.org/$1"'
    );
};

// 解析HTML内容，提取大事记和节假日信息
const parseWikiEvents = (html: string): { events: HistoricalEvent[]; holidays: HolidayToday[] } => {
  const events: HistoricalEvent[] = [];
  const holidays: HolidayToday[] = [];

  // 使用正则表达式匹配h2标签和其内容，提取id属性作为分类
  const sectionRegex =
    /<h2[^>]*id="([^"]*)"[^>]*>.*?<span[^>]*>.*?<\/span>(.*?)<\/h2>(.*?)(?=<h2|$)/gs;

  let sectionMatch;

  while ((sectionMatch = sectionRegex.exec(html)) !== null) {
    const category = sectionMatch[1].trim();
    const title = sectionMatch[2].trim();
    const content = sectionMatch[3];

    const list = new DOMParser().parseFromString(content, 'text/html').querySelectorAll('li');

    if (
      WIKI_MATCH_CATEGORY.bigEvent.includes(category) ||
      WIKI_MATCH_CATEGORY.bigEvent.includes(title)
    ) {
      // 处理历史事件
      const eventRegex = /(\d{4})年.*?/;
      for (const item of list) {
        const eventMatch = item.innerHTML.match(eventRegex);
        if (eventMatch !== null) {
          events.push({
            html: processWikiLinks(item.innerHTML ?? ''),
            category,
          });
        }
      }
    } else if (
      WIKI_MATCH_CATEGORY.holiday.includes(category) ||
      WIKI_MATCH_CATEGORY.holiday.includes(title)
    ) {
      // 处理节假日信息
      for (const item of list) {
        const text = item.textContent ?? '';
        if (text.includes('节') || text.includes('日')) {
          holidays.push({
            html: processWikiLinks(item.innerHTML),
          });
        }
      }
    }
  }

  return { events, holidays };
};

// 获取维基百科页面内容
const fetchWikiPage = async (): Promise<KnowledgeData> => {
  try {
    const today = dateUtils.getNow();
    const dateStr = `${today.getMonth() + 1}月${today.getDate()}日`;
    // 缓存未命中，请求新数据
    const response = await fetchUtils(`${WIKI_BASE_URL}/${dateStr}`, { cacheFetch: true });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();

    // 解析数据
    const { events: allHistoricalEvents, holidays: allHolidays } = parseWikiEvents(html);

    // 更新缓存
    const wikiData: KnowledgeData = {
      allHistoricalEvents,
      allHolidays,
    };
    await wikiCache.set(wikiData);
    console.log('更新维基数据缓存');

    return wikiData;
  } catch (error) {
    console.error('Error fetching wiki page:', error);
    throw error;
  }
};

export const wikiManager = createKnowledgeManager(CACHE_KEYS.WIKI_DATA, fetchWikiPage);
