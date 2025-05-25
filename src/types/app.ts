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
  Xiaohongshu = 'xiaohongshu',
  Toutiao = 'toutiao',
  GgEnForYou = 'gg_en_for_you',
  GgZhForYou = 'gg_zh_for_you',
  GgEnGlobal = 'gg_en_global',
  GgZhGlobal = 'gg_zh_global',
}
