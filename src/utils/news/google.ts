import { NEWS_URL, CACHE_KEYS } from '@/constants';
import { NewsItem } from '@/types';
import { AppLanguage } from '@/types/app';

import { fetchUtils } from '../fetch';

import { createNewsManager } from './newsManager';

const GOOGLE_LOCALES: Record<AppLanguage, { hl: string; gl: string; ceid: string }> = {
  [AppLanguage.ZhCN]: { hl: 'zh-CN', gl: 'CN', ceid: 'CN:zh-Hans' },
  [AppLanguage.ZhTW]: { hl: 'zh-TW', gl: 'TW', ceid: 'TW:zh-Hant' },
  [AppLanguage.En]: { hl: 'en-US', gl: 'US', ceid: 'US:en' },
  [AppLanguage.Ru]: { hl: 'ru', gl: 'RU', ceid: 'RU:ru' },
  [AppLanguage.Fr]: { hl: 'fr', gl: 'FR', ceid: 'FR:fr' },
  [AppLanguage.Ja]: { hl: 'ja', gl: 'JP', ceid: 'JP:ja' },
  [AppLanguage.Ar]: { hl: 'ar', gl: 'SA', ceid: 'SA:ar' },
};

let activeGoogleLanguage = AppLanguage.En;

export const setGoogleNewsLanguage = (language: AppLanguage) => {
  activeGoogleLanguage = language;
};

const googleQuery = {
  for_you_en: '/foryou?hl=en-US&gl=US&ceid=US:en',
  us_en: '/topics/CAAqIggKIhxDQkFTRHdvSkwyMHZNRGxqTjNjd0VnSmxiaWdBUAE?hl=en-US&gl=US&ceid=US%3Aen',
  global_en:
    '/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRGx1YlY4U0JYcG9MVU5PR2dKRFRpZ0FQAQ?hl=zh-CN&gl=CN&ceid=CN%3Azh-Hans',
  tech_en:
    '/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen',
  entertainment_en:
    '/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen',
  sports_en:
    '/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen',
  bussiness_en:
    '/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen',
  science_en:
    '/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp0Y1RjU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen',
  health_en:
    '/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRFU0FtVnVLQUFQAQ?hl=en-US&gl=US&ceid=US%3Aen',
  for_you_zh: '/foryou?hl=zh-CN&gl=CN&ceid=CN%3Azh-Hans',
  china_zh:
    '/topics/CAAqJggKIiBDQkFTRWdvSkwyMHZNR1F3TlhjekVnVjZhQzFEVGlnQVAB?hl=zh-CN&gl=CN&ceid=CN%3Azh-Hans',
  global_zh:
    '/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRGx1YlY4U0JYcG9MVU5PR2dKRFRpZ0FQAQ?hl=zh-CN&gl=CN&ceid=CN%3Azh-Hans',
  entertainment_zh:
    '/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRGx6TVdZU0JYcG9MVU5PR2dKRFRpZ0FQAQ?hl=zh-CN&gl=CN&ceid=CN%3Azh-Hans',
  bussiness_zh:
    '/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRGx6TVdZU0JYcG9MVU5PR2dKRFRpZ0FQAQ?hl=zh-CN&gl=CN&ceid=CN%3Azh-Hans',
  sports_zh:
    '/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRFp1ZEdvU0JYcG9MVU5PR2dKRFRpZ0FQAQ?hl=zh-CN&gl=CN&ceid=CN%3Azh-Hans',
};

const getGoogleRssUrl = (path: string) => {
  const locale = GOOGLE_LOCALES[activeGoogleLanguage];
  const pathname = path.split('?')[0];
  const rssPath =
    pathname === '/foryou' ? '/rss' : pathname.replace(/^\/topics\//u, '/rss/topics/');
  const parameters = new URLSearchParams(locale);
  return `${NEWS_URL.GOOGLE_NEWS}${rssPath}?${parameters.toString()}`;
};

const fetchGoogleNews = async (path: string) => {
  try {
    const response = await fetchUtils(getGoogleRssUrl(path), { cacheFetch: true });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const xml = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    if (doc.querySelector('parsererror')) {
      throw new Error('Google News RSS returned invalid XML');
    }

    const newsItems: NewsItem[] = [];
    const items = doc.querySelectorAll('channel > item');

    items.forEach((item) => {
      const title = item.querySelector('title')?.textContent?.trim() ?? '';
      const link = item.querySelector('link')?.textContent?.trim() ?? '';
      const source = item.querySelector('source')?.textContent?.trim() ?? '';
      const time = item.querySelector('pubDate')?.textContent?.trim() ?? '';

      if (title && link) {
        newsItems.push({
          title,
          link,
          source,
          time,
        });
      }
    });

    return newsItems;
  } catch (error) {
    console.error('获取新闻失败:', error);
    return [];
  }
};

const createGoogleNewsManager = (cacheKey: string, path: string) => {
  const manager = createNewsManager(cacheKey, () => fetchGoogleNews(path));
  let cachedLanguage: AppLanguage | null = null;
  const getAvailableSites = manager.getAvailableSites.bind(manager);

  manager.getAvailableSites = async () => {
    if (cachedLanguage !== activeGoogleLanguage) {
      await manager.clearCache();
      cachedLanguage = activeGoogleLanguage;
    }
    return getAvailableSites();
  };
  return manager;
};

export const ggEnForYouNews = createGoogleNewsManager(
  CACHE_KEYS.GOOGLE_EN_FOR_YOU_NEWS,
  googleQuery.for_you_en
);

export const ggZhForYouNews = createGoogleNewsManager(
  CACHE_KEYS.GOOGLE_ZH_FOR_YOU_NEWS,
  googleQuery.for_you_zh
);

export const ggEnGlobalNews = createGoogleNewsManager(
  CACHE_KEYS.GOOGLE_EN_GLOBAL_NEWS,
  googleQuery.global_en
);

export const ggZhGlobalNews = createGoogleNewsManager(
  CACHE_KEYS.GOOGLE_ZH_GLOBAL_NEWS,
  googleQuery.global_zh
);

export const ggEnTechNews = createGoogleNewsManager(
  CACHE_KEYS.GOOGLE_EN_TECH_NEWS,
  googleQuery.tech_en
);

export const ggEnEntertainmentNews = createGoogleNewsManager(
  CACHE_KEYS.GOOGLE_EN_ENTERTAINMENT_NEWS,
  googleQuery.entertainment_en
);

export const ggZhEntertainmentNews = createGoogleNewsManager(
  CACHE_KEYS.GOOGLE_ZH_ENTERTAINMENT_NEWS,
  googleQuery.entertainment_zh
);

export const ggEnSportsNews = createGoogleNewsManager(
  CACHE_KEYS.GOOGLE_EN_SPORTS_NEWS,
  googleQuery.sports_en
);

export const ggZhSportsNews = createGoogleNewsManager(
  CACHE_KEYS.GOOGLE_ZH_SPORTS_NEWS,
  googleQuery.sports_zh
);

export const ggEnBussinessNews = createGoogleNewsManager(
  CACHE_KEYS.GOOGLE_EN_BUSSINESS_NEWS,
  googleQuery.bussiness_en
);

export const ggZhBussinessNews = createGoogleNewsManager(
  CACHE_KEYS.GOOGLE_ZH_BUSSINESS_NEWS,
  googleQuery.bussiness_zh
);

export const ggEnScienceNews = createGoogleNewsManager(
  CACHE_KEYS.GOOGLE_EN_SCIENCE_NEWS,
  googleQuery.science_en
);

export const ggEnHealthNews = createGoogleNewsManager(
  CACHE_KEYS.GOOGLE_EN_HEALTH_NEWS,
  googleQuery.health_en
);

export const ggEnUsNews = createGoogleNewsManager(CACHE_KEYS.GOOGLE_EN_US_NEWS, googleQuery.us_en);

export const ggZhChinaNews = createGoogleNewsManager(
  CACHE_KEYS.GOOGLE_ZH_CHINA_NEWS,
  googleQuery.china_zh
);
