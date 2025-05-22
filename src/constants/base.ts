// 维基百科相关
export const WIKI_BASE_URL = `https://zh.wikipedia.org/wiki`;
export const WIKI_MAX_EVENTS_COUNT = 8; // 组件events展示数量
export const WIKI_HOLIDAY_COUNT = 2; // 组件holiday展示数量
// wiki match
export const WIKI_MATCH_CATEGORY = {
  bigEvent: ['大事记', '大事記'],
  holiday: ['节假日和习俗', '節假日和習俗'],
};

// 节假日相关
export const HOLIDAY_API_BASE_URL = 'https://timor.tech/api/holiday';

// 单词相关
export const WORD_API_BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';
export const WORD_BATCH_SIZE = 5; // 组件单词展示数量
export const WORD_CON_LIMIT = 3; // 单词请求最大并发
export const WORD_UNIT_COUNT = 15; // 每天选择数量

// 名言相关
export const FAMOUS_ZEN_QUOTES_API = 'https://zenquotes.io/api/random';
export const FAMOUS_HITOKOTO_API = 'https://v1.hitokoto.cn/?c=i';
export const FAMOUS_MAX_CACHE_COUNT = 30;
export const FAMOUS_MAX_REQ_COUNT = 3;
export const FAMOUS_CON_LIMIT = 2;
export const FAMOUS_HI_MAX_REQ_COUNT = 2;
export const FAMOUS_HI_CON_LIMIT = 1;

// 缓存相关
export const CACHE_KEYS = {
  WIKI_DATA: 'wiki_data_cache_new_tab',
  BAIDU_DATA: 'baidu_data_cache_new_tab',
  WIKI_CACHE_EXPIRY: 'wiki_cache_expiry',
  TIMOR_TECH_API_HOLIDAY: 'timor_tech_api_holiday',
  POETRY_LEARNING_RECORD: 'poetry_learning_record',
  EN_WORD_LEARNING_RECORD: 'en_word_learning_record',
  EXTENSION_SETTINGS: 'extension_settings',
} as const;

export const THROTTLE_TIME = 1000; // 节流时间

// 百度百科相关
export const BAIDU_BASE_URL = `https://baike.baidu.com`;
export const BAIDU_MAX_EVENTS_COUNT = 8; // 组件events展示数量
export const BAIDU_HOLIDAY_COUNT = 2; //
export const BAIDU_MATCH_CATEGORY = {
  bigEvent: ['重大事记', '重大事件'],
  holiday: ['节日风俗', '节日习俗'],
};

export const FETCH_TIMEOUT = 6000;
