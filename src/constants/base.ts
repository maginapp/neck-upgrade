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
  // 微博
  WEIBO_AMUSE_NEWS: 'weibo_amuse_news',
  WEIBO_HOT_NEWS: 'weibo_hot_news',
  WEIBO_MY_NEWS: 'weibo_my_news',
  WEIBO_LIFE_NEWS: 'weibo_life_news',
  WEIBO_SOCIAL_NEWS: 'weibo_social_news',
  // 小红书
  XIAOHONGSHU_NEWS: 'xiaohongshu_news',
  // 头条
  TOUTIAO_NEWS: 'toutiao_news',
  // 谷歌
  GOOGLE_EN_FOR_YOU_NEWS: 'google_en_for_you_news',
  GOOGLE_EN_GLOBAL_NEWS: 'google_en_global_news',
  GOOGLE_EN_TECH_NEWS: 'google_en_tech_news',
  GOOGLE_EN_ENTERTAINMENT_NEWS: 'google_en_entertainment_news',
  GOOGLE_EN_SPORTS_NEWS: 'google_en_sports_news',
  GOOGLE_EN_BUSSINESS_NEWS: 'google_en_bussiness_news',
  GOOGLE_EN_SCIENCE_NEWS: 'google_en_science_news',
  GOOGLE_EN_HEALTH_NEWS: 'google_en_health_news',
  GOOGLE_EN_US_NEWS: 'google_en_us_news',
  GOOGLE_ZH_FOR_YOU_NEWS: 'google_zh_for_you_news',
  GOOGLE_ZH_CHINA_NEWS: 'google_zh_china_news',
  GOOGLE_ZH_GLOBAL_NEWS: 'google_zh_global_news',
  GOOGLE_ZH_ENTERTAINMENT_NEWS: 'google_zh_entertainment_news',
  GOOGLE_ZH_BUSSINESS_NEWS: 'google_zh_bussiness_news',
  GOOGLE_ZH_SPORTS_NEWS: 'google_zh_sports_news',
  // 知乎
  ZHIHU_HOT_NEWS: 'zhihu_hot_news',
  // b站
  BILIBILI_ALL_NEWS: 'bilibili_all_news',
  BILIBILI_RANK_NEWS: 'bilibili_rank_news',
  BILIBILI_RANK_DOUGA_NEWS: 'bilibili_rank_douga_news',
  BILIBILI_RANK_SPORTS_NEWS: 'bilibili_rank_sports_news',
  BILIBILI_RANK_FOOD_NEWS: 'bilibili_rank_food_news',
  BILIBILI_RANK_TECH_NEWS: 'bilibili_rank_tech_news',
  BILIBILI_RANK_KNOWLEDGE_NEWS: 'bilibili_rank_knowledge_news',
  BILIBILI_RANK_ENT_NEWS: 'bilibili_rank_ent_news',
  BILIBILI_RANK_MUSIC_NEWS: 'bilibili_rank_music_news',
  BILIBILI_RANK_KICHIKU_NEWS: 'bilibili_rank_kichiku_news',
  BILIBILI_RANK_DANCE_NEWS: 'bilibili_rank_dance_news',
  BILIBILI_RANK_CINEPHILE_NEWS: 'bilibili_rank_cinephile_news',
  BAIDU_HOT_NEWS: 'baidu_hot_news',
  BAIDU_TIEBA_NEWS: 'baidu_tieba_news',
  // 36氪
  KR_36_ALL_NEWS: 'three_six_kr_all_news',
  KR_36_HOT_NEWS: 'three_six_kr_hot_news',
  KR_36_STOCK_NEWS: 'three_six_kr_stock_news',
  KR_36_MACRO_NEWS: 'three_six_kr_macro_news',
  // v2ex
  V2EX_TECH_NEWS: 'v2ex_tech_news',
  V2EX_PLAY_NEWS: 'v2ex_play_news', //
  V2EX_CREATIVE_NEWS: 'v2ex_creative_news',
  V2EX_HOT_NEWS: 'v2ex_hot_news',
  V2EX_ALL_NEWS: 'v2ex_all_news',
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
  BILIBILI_ALL: 'https://api.bilibili.com/x/web-interface/popular?ps=50&pn=1',
  BILIBILI_RANK: 'https://api.bilibili.com/x/web-interface/ranking/v2',
  ZHIHU_HOT: 'https://www.zhihu.com/billboard',
  GOOGLE_NEWS: 'https://news.google.com',
  BAIDU_TOP: 'https://top.baidu.com/board?tab=realtime',
  BAIDU_TIEBA: 'https://tieba.baidu.com/hottopic/browse/topicList?res_type=1',
  KR_36: 'https://36kr.com/newsflashes/catalog',
  V2EX: 'https://www.v2ex.com',
};

export const NEWS_CACHE_EXPIRY = 1000 * 60 * 5; // 5分钟 // 24小时

export const DEFAULT_PAGE_INFO = {
  page: 0,
  pageSize: 10,
};

// 与typeList css宽度一致
export const NEWS_TAB_TYTPE_LIST_POP_WIDTH = 200;
