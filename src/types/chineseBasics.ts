import { ChineseBasicsCategory } from './app';

export interface ChineseBasicsEntry {
  category: Exclude<ChineseBasicsCategory, ChineseBasicsCategory.All>;
  key: string;
  title: string;
  pinyin?: string;
  explanation?: string;
  traditional?: string;
  radical?: string;
  strokes?: string;
  derivation?: string;
  example?: string;
  answer?: string;
}
