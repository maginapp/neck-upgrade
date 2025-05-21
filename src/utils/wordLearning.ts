import { CACHE_KEYS } from '@/constants';
import { DictionaryEntry, Meaning } from '../types/dictionary';
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

/**
 * 对单词列表进行切片处理
 * 1. 对每个单词的 meanings 按 partOfSpeech 分组
 * 2. 从每个分组随机选择一个 meaning
 * 3. 如果还有剩余 meaning 且总数小于3，则从剩余中随机选择一个
 * 4. 对每个 meaning 的 definitions 随机选择不超过两个
 * @param wordList 原始单词列表
 * @returns 处理后的单词列表
 */
export const sliceWordList = (wordList: WordInfo[]): WordInfo[] => {
  return wordList.map((word) => {
    if (!word.definition) {
      return word;
    }
    if (!word.definition.meanings) {
      return word;
    }

    // 按词性分组 meanings
    const groupedMeanings = word.definition.meanings.reduce<Record<string, Meaning[]>>(
      (acc, meaning) => {
        const key = meaning.partOfSpeech;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(meaning);
        return acc;
      },
      {}
    );

    // 从每个分组随机选择一个 meaning
    const selectedMeanings = Object.values(groupedMeanings).map((meanings) => {
      const randomIndex = Math.floor(Math.random() * meanings.length);
      return meanings[randomIndex];
    });

    // 如果还有剩余 meaning 且总数小于3，从剩余中随机选择一个
    const remainingMeanings = word.definition.meanings.filter(
      (meaning) => !selectedMeanings.includes(meaning)
    );

    if (remainingMeanings.length > 0 && selectedMeanings.length < 3) {
      const randomIndex = Math.floor(Math.random() * remainingMeanings.length);
      selectedMeanings.push(remainingMeanings[randomIndex]);
    }

    // 处理每个 meaning 的 definitions
    const processedMeanings = selectedMeanings.map((meaning) => ({
      ...meaning,
      definitions: meaning.definitions
        .sort(() => Math.random() - 0.5) // 随机排序
        .slice(0, 2), // 最多取两个
    }));

    return {
      ...word,
      definition: {
        ...word.definition,
        meanings: processedMeanings,
      },
    };
  });
};

export const getNextWord = async (): Promise<WordInfo[] | null> => {
  return getNextRecord({
    cacheKey: CACHE_KEYS.EN_WORD_LEARNING_RECORD, // 缓存key
    compareFn: (a: WordInfo, b: WordInfo) => a.word === b.word, // 比较函数
    getData: getWordList, // 数据源
    unitCount: SELECTED_COUNT, // 每次选择的数量
    batchSize: BATCH_SIZE,
    formatRecord: getWordDefinitions,
  }).then((wordList) => {
    return sliceWordList(wordList);
  });
};
