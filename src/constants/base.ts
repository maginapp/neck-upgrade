// 维基百科相关
export const WIKI_BASE_URL = `https://zh.wikipedia.org/wiki`;
// wiki match
export const WIKI_MATCH_CATEGORY = {
  bigEvent: ['大事记', '大事記'],
  holiday: ['节假日和习俗', '節假日和習俗'],
};

// 百度百科相关
export const BAIDU_BASE_URL = `https://baike.baidu.com`;
export const BAIDU_MATCH_CATEGORY = {
  bigEvent: ['重大事记', '重大事件'],
  holiday: ['节日风俗', '节日习俗'],
};

export const KNOWLEDGE_MAX_EVENTS_COUNT = 8; // 组件events展示数量
export const KNOWLEDGE_MAX_HOLIDAY_COUNT = 2; // 组件holiday展示数量

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

  WEIBO_AMUSE_NEWS: 'weibo_amuse_news',
  WEIBO_HOT_NEWS: 'weibo_hot_news',
  WEIBO_MY_NEWS: 'weibo_my_news',
  WEIBO_LIFE_NEWS: 'weibo_life_news',
  WEIBO_SOCIAL_NEWS: 'weibo_social_news',
  XIAOHONGSHU_NEWS: 'xiaohongshu_news',
  TOUTIAO_NEWS: 'toutiao_news',
  GOOGLE_EN_FOR_YOU_NEWS: 'google_en_for_you_news',
  GOOGLE_EN_GLOBAL_NEWS: 'google_en_global_news',
  GOOGLE_ZH_FOR_YOU_NEWS: 'google_zh_for_you_news',
  GOOGLE_ZH_GLOBAL_NEWS: 'google_zh_global_news',
  ZHIHU_HOT_NEWS: 'zhihu_hot_news',
  BILIBILI_ALL_NEWS: 'bilibili_all_news',
  BILIBILI_RANK_NEWS: 'bilibili_rank_news',
  BAIDU_HOT_NEWS: 'baidu_hot_news',
  BAIDU_TIEBA_NEWS: 'baidu_tieba_news',
  KR_36_ALL_NEWS: 'three_six_kr_all_news',
  KR_36_HOT_NEWS: 'three_six_kr_hot_news',
  KR_36_STOCK_NEWS: 'three_six_kr_stock_news',
  KR_36_MACRO_NEWS: 'three_six_kr_macro_news',
} as const;

export const THROTTLE_TIME = 1000; // 节流时间

export const FETCH_TIMEOUT = 6000;

export const NEWS_CONFIG = {};

export const NEWS_URL = {
  WEIBO_AMUSE: 'https://s.weibo.com/top/summary?cate=entrank',
  WEIBO_HOT: 'https://s.weibo.com/top/summary?cate=realtimehot',
  WEIBO_MY: 'https://s.weibo.com/top/summary?cate=recommend',
  WEIBO_LIFE: 'https://s.weibo.com/top/summary?cate=life',
  WEIBO_SOCIAL: 'https://s.weibo.com/top/summary?cate=socialevent',
  XIAOHONGSHU: 'https://www.xiaohongshu.com/explore?channel_id=homefeed_recommend',
  TOUTIAO:
    'https://api.toutiaoapi.com/hot-event/hot-board/?only_hot_list=1&tab_name=stream&origin=hot_board',
  // 'https://api.toutiaoapi.com/feoffline/hotspot_and_local/html/hot_list/index.html?only_hot_list=1&tab_name=stream', // csr
  // 'https://so.toutiao.com/search/?keyword=%E7%83%AD%E6%A6%9C&pd=synthesis&source=input&traffic_source=&original_source=&in_tfs=&in_ogs=', // ssr 数量少,
  BILIBILI_ALL: 'https://api.bilibili.com/x/web-interface/popular?ps=50&pn=1',
  BILIBILI_RANK: 'https://api.bilibili.com/x/web-interface/ranking/v2?rid=0&type=all',
  ZHIHU_HOT: 'https://www.zhihu.com/billboard',
  GOOGLE_EN_FOR_YOU: 'https://news.google.com/foryou?hl=en-US&gl=US&ceid=US:en',
  GOOGLE_EN_GLOBAL:
    'https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen',
  GOOGLE_ZH_FOR_YOU: 'https://news.google.com/foryou?hl=zh-CN&gl=CN&ceid=CN%3Azh-Hans',
  GOOGLE_ZH_GLOBAL:
    'https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRGx1YlY4U0JYcG9MVU5PR2dKRFRpZ0FQAQ?hl=zh-CN&gl=CN&ceid=CN%3Azh-Hans',
  BAIDU_TOP: 'https://top.baidu.com/board?tab=realtime',
  BAIDU_TIEBA: 'https://tieba.baidu.com/hottopic/browse/topicList?res_type=1',
  KR_36: 'https://36kr.com/newsflashes/catalog',
};

export const NEWS_CACHE_EXPIRY = 1000 * 60 * 5; // 5分钟 // 24小时

export const DEFAULT_PAGE_INFO = {
  page: 0,
  pageSize: 10,
};
