export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics?: Phonetic[];
  meanings?: Meaning[];
  license?: License;
  sourceUrls?: string[];
}

export interface Phonetic {
  text: string;
  audio: string;
  sourceUrl?: string;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

export interface Definition {
  definition: string;
  synonyms: string[];
  antonyms: string[];
}

export interface License {
  name: string;
  url: string;
}
// 历史学习记录（30天内）
export interface HistoryWordsRecord {
  date: string;
  words: DictionaryEntry[];
}

// 当天新增的诗词
interface TodayNewWords {
  words: DictionaryEntry[];
  currentIndex: number;
}

// 当天需要复习的诗词
interface TodayReviewWords {
  words: DictionaryEntry[];
  currentIndex: number;
}

// 完整的学习记录
export interface LearningWordsRecords {
  history: HistoryWordsRecord[]; // 30天内的学习记录
  todayNew: TodayNewWords; // 当天新增的单词
  todayReview: TodayReviewWords; // 当天需要复习的单词
  currentDate: string; // 当前日期
}
