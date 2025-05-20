// API 基础配置
export const API_TIMEOUT = 5000;
export const API_RETRY_TIMES = 3;

// 维基百科相关
export const WIKI_BASE_URL = `https://zh.wikipedia.org/wiki/`;

// 节假日相关
export const HOLIDAY_API_BASE_URL = 'https://timor.tech/api/holiday';

// 缓存相关
export const CACHE_KEYS = {
  WIKI_DATA: 'wiki_data_cache_new_tab',
  WIKI_CACHE_EXPIRY: 'wiki_cache_expiry',
  TIMOR_TECH_API_HOLIDAY: 'timor_tech_api_holiday',
} as const;

// 请求限制
export const MAX_EVENTS_PER_PAGE = 10;
export const MAX_HOLIDAYS_PER_PAGE = 3;
