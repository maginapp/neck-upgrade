import { ChineseBasicsCategory } from '@/types/app';

export const CHINESE_BASICS_CATEGORIES = [
  ChineseBasicsCategory.Idiom,
  ChineseBasicsCategory.Character,
  ChineseBasicsCategory.Xiehouyu,
  ChineseBasicsCategory.Word,
] as const;

export const CHINESE_BASICS_BATCH_SIZES: Record<ChineseBasicsCategory, number> = {
  [ChineseBasicsCategory.All]: 2,
  [ChineseBasicsCategory.Idiom]: 2,
  [ChineseBasicsCategory.Character]: 2,
  [ChineseBasicsCategory.Xiehouyu]: 4,
  [ChineseBasicsCategory.Word]: 4,
};
export const CHINESE_BASICS_UNIT_COUNT = 12;
export const CHINESE_BASICS_REVIEW_COUNT = 30;

export const CHINESE_BASICS_DATA_PATHS: Record<(typeof CHINESE_BASICS_CATEGORIES)[number], string> =
  {
    [ChineseBasicsCategory.Idiom]: 'data/chinese-basics/idiom.json',
    [ChineseBasicsCategory.Character]: 'data/chinese-basics/character.json',
    [ChineseBasicsCategory.Xiehouyu]: 'data/chinese-basics/xiehouyu.json',
    [ChineseBasicsCategory.Word]: 'data/chinese-basics/word.json',
  };
