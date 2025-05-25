import { HolidayToday, KnowledgeData, HistoricalEvent, KnowledgeDisplay } from '@/types';

import { KNOWLEDGE_MAX_EVENTS_COUNT, KNOWLEDGE_MAX_HOLIDAY_COUNT } from '../constants';
import { CrawlerManager } from './crawlerManager';

// 从所有历史事件中随机选择指定数量的历史事件
const selectRandomEvents = (allEvents: HistoricalEvent[], count: number): HistoricalEvent[] => {
  const categories = [...new Set(allEvents.map((event) => event.category))];
  const selectedEvents: HistoricalEvent[] = [];

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

export const createKnowledgeManager = (
  cacheKey: string,
  fetchSiteData: () => Promise<KnowledgeData>
) => {
  return new CrawlerManager<KnowledgeData, KnowledgeDisplay>(
    cacheKey,
    fetchSiteData,
    (data: KnowledgeData) => {
      return {
        events: selectRandomEvents(data.allHistoricalEvents, KNOWLEDGE_MAX_EVENTS_COUNT),
        holidays: selectRandomHolidays(data.allHolidays, KNOWLEDGE_MAX_HOLIDAY_COUNT),
      };
    }
  );
};
