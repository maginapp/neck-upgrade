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
  WeiboAmuse = 'weibo_amuse',
  WeiboHot = 'weibo_hot',
  WeiboMy = 'weibo_my',
  WeiboLife = 'weibo_life',
  WeiboSocial = 'weibo_social',
  Xiaohongshu = 'xiaohongshu',
  Toutiao = 'toutiao',
  Zhihu = 'zhihu',
  BilibiliAll = 'bilibili_all',
  BilibiliRank = 'bilibili_rank',
  GoogleZhForYou = 'google_zh_for_you',
  GoogleZhGlobal = 'google_zh_global',
  GoogleEnForYou = 'google_en_for_you',
  GoogleEnGlobal = 'google_en_global',
  BaiduTieba = 'baidu_tieba',
  BaiduHot = 'baidu_hot',
  Kr36All = 'kr36_all',
  Kr36Hot = 'kr36_hot',
  Kr36Stock = 'kr36_stock',
  Kr36Macro = 'kr36_macro',
}
