// 数据类型
export enum DataType {
  Poetry = 'poetry',
  History = 'history',
  English = 'english',
  News = 'news',
}

// 主题类型
export enum Theme {
  System = 'system',
  Light = 'light',
  Dark = 'dark',
}

// 颈椎模式类型
export enum NeckMode {
  Normal = 'normal',
  Training = 'training',
  Intense = 'intense',
  Custom = 'custom',
}

// baike类型
export enum KnowledgeMode {
  Wiki = 'wiki',
  Baidu = 'baidu',
}

export interface NeckModeConfig {
  rotate: number;
  duration: number;
  mode: NeckMode;
  cusMaxRotate: number;
  cusDuration: number;
}

export interface Settings {
  theme: Theme;
  neck: NeckModeConfig;
  dataType: DataType;
  knowledge: KnowledgeMode;
}

export interface PageInfo {
  pageSize: number;
  page: number;
}

export enum NewsType {
  // 微博
  WeiboAmuse = 'weibo_amuse',
  WeiboHot = 'weibo_hot',
  WeiboMy = 'weibo_my',
  WeiboLife = 'weibo_life',
  WeiboSocial = 'weibo_social',
  // 小红书
  Xiaohongshu = 'xiaohongshu',
  // 今日头条
  Toutiao = 'toutiao',
  // 知乎
  Zhihu = 'zhihu',
  // B站
  BilibiliAll = 'bilibili_all',
  BilibiliRank = 'bilibili_rank',
  BilibiliRankDouga = 'bilibili_rank_douga',
  BilibiliRankSports = 'bilibili_rank_sports',
  BilibiliRankFood = 'bilibili_rank_food',
  BilibiliRankTech = 'bilibili_rank_tech',
  BilibiliRankKnowledge = 'bilibili_rank_knowledge',
  BilibiliRankEnt = 'bilibili_rank_ent',
  BilibiliRankMusic = 'bilibili_rank_music',
  BilibiliRankKichiku = 'bilibili_rank_kichiku',
  BilibiliRankDance = 'bilibili_rank_dance',
  BilibiliRankCinephile = 'bilibili_rank_cinephile',
  // 谷歌中文
  GoogleZhForYou = 'google_zh_for_you',
  GoogleZhChina = 'google_zh_china',
  GoogleZhGlobal = 'google_zh_global',
  GoogleZhEntertainment = 'google_zh_entertainment',
  GoogleZhBussiness = 'google_zh_bussiness',
  GoogleZhSports = 'google_zh_sports',
  // 谷歌英文
  GoogleEnForYou = 'google_en_for_you',
  GoogleEnGlobal = 'google_en_global',
  GoogleEnUs = 'google_en_us',
  GoogleEnTech = 'google_en_tech',
  GoogleEnEntertainment = 'google_en_entertainment',
  GoogleEnSports = 'google_en_sports',
  GoogleEnBusiness = 'google_en_business',
  GoogleEnScience = 'google_en_science',
  GoogleEnHealth = 'google_en_health',
  // 百度
  BaiduTieba = 'baidu_tieba',
  BaiduHot = 'baidu_hot',
  // 36克
  Kr36All = 'kr36_all',
  Kr36Hot = 'kr36_hot',
  Kr36Stock = 'kr36_stock',
  Kr36Company = 'kr36_company',
  Kr36Macro = 'kr36_macro',
  // v2ex
  V2exTech = 'v2ex_tech',
  V2exPlay = 'v2ex_play',
  V2exCreative = 'v2ex_creative',
  V2exHot = 'v2ex_hot',
  V2exAll = 'v2ex_all',
}

export enum NewsGroup {
  Weibo = 'weibo',
  Xiaohongshu = 'xiaohongshu',
  Toutiao = 'toutiao',
  Zhihu = 'zhihu',
  Bilibili = 'bilibili',
  Google = 'google',
  Baidu = 'baidu',
  Kr36 = 'kr36',
  V2ex = 'v2ex',
}
