import { NEWS_URL, CACHE_KEYS } from '@/constants';
import { NewsItem } from '@/types';

import { fetchUtils } from '../fetch';

import { createNewsManager } from './newsManager';

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

const fetchGoogleNews = async (url: string) => {
  try {
    // 通过 background 脚本获取新闻
    const response = await fetchUtils(url, { cacheFetch: true });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();

    // 创建临时 DOM 解析 HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const newsItems: NewsItem[] = [];
    // 获取新闻列表
    const articles = doc.querySelectorAll('article');

    articles.forEach((article) => {
      const linkElement: HTMLAnchorElement | null = article.querySelector('a[data-n-tid]');
      const sourceElement = article.querySelector('div[data-n-tid]');
      const timeElement = article.querySelector('time');

      if (linkElement) {
        // 处理相对链接
        const link = linkElement.href.startsWith('/')
          ? `https://news.google.com${linkElement.href}`
          : linkElement.href;

        newsItems.push({
          title: linkElement.textContent?.trim() || '',
          link,
          source: sourceElement?.textContent?.trim() || '',
          time: timeElement?.getAttribute('datetime') || '',
        });
      }
    });

    return newsItems;
  } catch (error) {
    console.error('获取新闻失败:', error);
    return [];
  }
};

export const ggEnForYouNews = createNewsManager(CACHE_KEYS.GOOGLE_EN_FOR_YOU_NEWS, () => {
  return fetchGoogleNews(`${NEWS_URL.GOOGLE_NEWS}${googleQuery.for_you_en}`);
});

export const ggZhForYouNews = createNewsManager(CACHE_KEYS.GOOGLE_ZH_FOR_YOU_NEWS, () => {
  return fetchGoogleNews(`${NEWS_URL.GOOGLE_NEWS}${googleQuery.for_you_zh}`);
});

export const ggEnGlobalNews = createNewsManager(CACHE_KEYS.GOOGLE_EN_GLOBAL_NEWS, () => {
  return fetchGoogleNews(`${NEWS_URL.GOOGLE_NEWS}${googleQuery.global_en}`);
});

export const ggZhGlobalNews = createNewsManager(CACHE_KEYS.GOOGLE_ZH_GLOBAL_NEWS, () => {
  return fetchGoogleNews(`${NEWS_URL.GOOGLE_NEWS}${googleQuery.global_zh}`);
});

export const ggEnTechNews = createNewsManager(CACHE_KEYS.GOOGLE_EN_TECH_NEWS, () => {
  return fetchGoogleNews(`${NEWS_URL.GOOGLE_NEWS}${googleQuery.tech_en}`);
});

export const ggEnEntertainmentNews = createNewsManager(
  CACHE_KEYS.GOOGLE_EN_ENTERTAINMENT_NEWS,
  () => {
    return fetchGoogleNews(`${NEWS_URL.GOOGLE_NEWS}${googleQuery.entertainment_en}`);
  }
);

export const ggZhEntertainmentNews = createNewsManager(
  CACHE_KEYS.GOOGLE_ZH_ENTERTAINMENT_NEWS,
  () => {
    return fetchGoogleNews(`${NEWS_URL.GOOGLE_NEWS}${googleQuery.entertainment_zh}`);
  }
);

export const ggEnSportsNews = createNewsManager(CACHE_KEYS.GOOGLE_EN_SPORTS_NEWS, () => {
  return fetchGoogleNews(`${NEWS_URL.GOOGLE_NEWS}${googleQuery.sports_en}`);
});

export const ggZhSportsNews = createNewsManager(CACHE_KEYS.GOOGLE_ZH_SPORTS_NEWS, () => {
  return fetchGoogleNews(`${NEWS_URL.GOOGLE_NEWS}${googleQuery.sports_zh}`);
});

export const ggEnBussinessNews = createNewsManager(CACHE_KEYS.GOOGLE_EN_BUSSINESS_NEWS, () => {
  return fetchGoogleNews(`${NEWS_URL.GOOGLE_NEWS}${googleQuery.bussiness_en}`);
});

export const ggZhBussinessNews = createNewsManager(CACHE_KEYS.GOOGLE_ZH_BUSSINESS_NEWS, () => {
  return fetchGoogleNews(`${NEWS_URL.GOOGLE_NEWS}${googleQuery.bussiness_zh}`);
});

export const ggEnScienceNews = createNewsManager(CACHE_KEYS.GOOGLE_EN_SCIENCE_NEWS, () => {
  return fetchGoogleNews(`${NEWS_URL.GOOGLE_NEWS}${googleQuery.science_en}`);
});

export const ggEnHealthNews = createNewsManager(CACHE_KEYS.GOOGLE_EN_HEALTH_NEWS, () => {
  return fetchGoogleNews(`${NEWS_URL.GOOGLE_NEWS}${googleQuery.health_en}`);
});

export const ggEnUsNews = createNewsManager(CACHE_KEYS.GOOGLE_EN_US_NEWS, () => {
  return fetchGoogleNews(`${NEWS_URL.GOOGLE_NEWS}${googleQuery.us_en}`);
});

export const ggZhChinaNews = createNewsManager(CACHE_KEYS.GOOGLE_ZH_CHINA_NEWS, () => {
  return fetchGoogleNews(`${NEWS_URL.GOOGLE_NEWS}${googleQuery.china_zh}`);
});
