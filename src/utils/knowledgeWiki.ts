import { CACHE_KEYS } from '@/constants';
import { HolidayToday, KnowledgeData, HistoricalEvent } from '@/types';
import { AppLanguage } from '@/types/app';

import { dateUtils } from './base';
import { fetchUtils } from './fetch';
import { createKnowledgeManager } from './knowledgeManager';

type WikiLanguage = 'zh' | 'en' | 'ru' | 'fr' | 'ja' | 'ar';

interface WikiOnThisDayItem {
  text?: string;
  year?: number;
  pages?: Array<{
    title?: string;
    content_urls?: { desktop?: { page?: string } };
  }>;
}

interface WikiOnThisDayResponse {
  events?: WikiOnThisDayItem[];
  holidays?: WikiOnThisDayItem[];
}

const WIKI_LANGUAGE_BY_APP_LANGUAGE: Record<AppLanguage, WikiLanguage> = {
  [AppLanguage.ZhCN]: 'zh',
  [AppLanguage.ZhTW]: 'zh',
  [AppLanguage.En]: 'en',
  [AppLanguage.Ru]: 'ru',
  [AppLanguage.Fr]: 'fr',
  [AppLanguage.Ja]: 'ja',
  [AppLanguage.Ar]: 'ar',
};

const getLanguageFallbacks = (language: AppLanguage): WikiLanguage[] => {
  const primary = WIKI_LANGUAGE_BY_APP_LANGUAGE[language];
  return [...new Set<WikiLanguage>([primary, 'en', 'zh'])];
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    };
    return entities[character];
  });

const toHtml = (item: WikiOnThisDayItem) => {
  const text = escapeHtml(item.text?.trim() ?? '');
  const page = item.pages?.[0];
  const pageUrl = page?.content_urls?.desktop?.page;
  const pageTitle = page?.title?.trim();
  if (!pageUrl || !pageTitle) {
    return text;
  }
  return `${text} <a href="${escapeHtml(pageUrl)}" target="_blank" rel="noreferrer">${escapeHtml(pageTitle)}</a>`;
};

const parseWikiData = (data: WikiOnThisDayResponse): KnowledgeData => {
  const allHistoricalEvents: HistoricalEvent[] = (data.events ?? [])
    .filter((item) => item.text)
    .map((item) => ({
      // 所有事件归属同一分类，保证内容区维持既有的随机条数上限。
      category: 'events',
      html: toHtml(item),
    }));
  const allHolidays: HolidayToday[] = (data.holidays ?? [])
    .filter((item) => item.text)
    .map((item) => ({ html: toHtml(item) }));
  return { allHistoricalEvents, allHolidays };
};

const getWikiUrl = (language: WikiLanguage) => {
  const today = dateUtils.getNow();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `https://${language}.wikipedia.org/api/rest_v1/feed/onthisday/all/${month}/${day}`;
};

const fetchWikiData = async (language: AppLanguage): Promise<KnowledgeData> => {
  let lastError: unknown;
  for (const wikiLanguage of getLanguageFallbacks(language)) {
    try {
      const response = await fetchUtils(getWikiUrl(wikiLanguage), { cacheFetch: true });
      if (!response.ok) {
        throw new Error(`Wikipedia ${wikiLanguage} returned HTTP ${response.status}`);
      }
      const data = parseWikiData((await response.json()) as WikiOnThisDayResponse);
      if (data.allHistoricalEvents.length || data.allHolidays.length) {
        return data;
      }
      lastError = new Error(`Wikipedia ${wikiLanguage} returned no daily data`);
    } catch (error) {
      lastError = error;
      console.error(`Wikipedia ${wikiLanguage} data request failed:`, error);
    }
  }
  throw lastError ?? new Error('Wikipedia returned no daily data');
};

const wikiManagers = new Map<AppLanguage, ReturnType<typeof createKnowledgeManager>>();

export const getWikiManager = (language: AppLanguage) => {
  const existingManager = wikiManagers.get(language);
  if (existingManager) {
    return existingManager;
  }

  const manager = createKnowledgeManager(
    `${CACHE_KEYS.WIKI_DATA}:${WIKI_LANGUAGE_BY_APP_LANGUAGE[language]}`,
    () => fetchWikiData(language)
  );
  wikiManagers.set(language, manager);
  return manager;
};

export const __wikiTestUtils = { getLanguageFallbacks, parseWikiData, getWikiUrl };
