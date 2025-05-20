import { CACHE_KEYS } from '@/constants';
import { DictionaryEntry } from '../types/dictionary';
import { getNextRecord } from './generateNext';
import { limitConcurrency } from './base';

const BATCH_SIZE = 5;
const MAX_CONCURRENT_REQUESTS = 3;
const SELECTED_COUNT = 15; // 每天选择的数量

interface WordInfo {
  word: string;
  definition?: DictionaryEntry;
}

// 缓存加载的数据
let wordListCache: WordInfo[] | null = null;

/**
 * 获取诗词数据
 */
export async function getWordList(): Promise<WordInfo[]> {
  if (!wordListCache) {
    wordListCache = await getWordListFromFile();
  }
  return wordListCache;
}

// 从文件读取单词列表
const getWordListFromFile = async (): Promise<WordInfo[]> => {
  try {
    const response = await fetch(chrome.runtime.getURL('data/google-10000-english-no-swears.txt'));
    const text = await response.text();
    return text
      .split('\n')
      .map((word) => word.trim())
      .filter((word) => word.length > 0)
      .map((word) => ({
        word,
      }));
  } catch (error) {
    console.error('Error reading word list:', error);
    return [];
  }
};

// 获取单词定义
const getWordDefinition = async (word: string): Promise<DictionaryEntry> => {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error(`Error fetching definition for ${word}:`, error);
    return {
      word,
    };
  }
};

// 批量获取单词定义
const getWordDefinitions = async (words: WordInfo[]): Promise<WordInfo[]> => {
  const results = await limitConcurrency(
    getWordDefinition,
    words.map((word) => word.word),
    MAX_CONCURRENT_REQUESTS
  );
  return results.map((result) => ({
    word: result.word,
    definition: result,
  }));
};

export const getNextWord = async (): Promise<WordInfo[] | null> => {
  return getNextRecord({
    cacheKey: CACHE_KEYS.EN_WORD_LEARNING_RECORD, // 缓存key
    compareFn: (a: WordInfo, b: WordInfo) => a.word === b.word, // 比较函数
    getData: getWordList, // 数据源
    unitCount: SELECTED_COUNT, // 每次选择的数量
    batchSize: BATCH_SIZE,
    formatRecord: getWordDefinitions,
  });
};
