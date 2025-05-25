// https://v1.hitokoto.cn/?c=i
export interface HitokotoData {
  id: number;
  uuid: string;
  hitokoto: string; // 内容
  type: string; // 如果有固定枚举类型，也可以改为联合类型，例如：'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i'
  from: string; // 来源
  from_who: string | null; // 作者
  creator: string;
  creator_uid: number;
  reviewer: number;
  commit_from: string;
  created_at: string; // 时间戳字符串（也可以转换为 number 或 Date）
  length: number;
}

// https://zenquotes.io/api/random
export interface Zenquotes {
  q: string; // 内容
  a: string; // 来源/作者
  h: string;
}

export type ZenquotesRsp = Zenquotes[];

export interface FamousInfo {
  content: string;
  source: string;
  website: 'zenquotes' | '一言';
}

export interface FamousRecords {
  records: FamousInfo[];
  currentDate: string;
}
