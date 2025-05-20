import { CACHE_KEYS } from '@/constants';
import { DictionaryEntry } from '../types/dictionary';
import { getNextRecord } from './generateNext';

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
  const definitions: WordInfo[] = [];
  const chunks = [];

  // 将单词分成最多3个并发请求的块
  for (let i = 0; i < words.length; i += MAX_CONCURRENT_REQUESTS) {
    chunks.push(words.slice(i, i + MAX_CONCURRENT_REQUESTS));
  }

  for (const chunk of chunks) {
    const promises = chunk.map((vocabulary) => getWordDefinition(vocabulary.word));
    const chunkDefinitions = await Promise.all(promises);

    const results = chunkDefinitions
      .filter((item): item is DictionaryEntry => item !== null && item !== undefined)
      .map((item) => ({
        word: item.word,
        definition: item,
      }));
    definitions.push(...results);
  }

  return definitions;
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
