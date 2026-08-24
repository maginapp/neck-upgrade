import { CHINESE_BASICS_CATEGORIES, CHINESE_BASICS_DATA_PATHS } from '@/constants';
import { CACHE_KEYS } from '@/constants/base';
import { Poetry, ChineseBasicsEntry, LearningRecords } from '@/types';

export type SearchSource = 'poetry' | 'chinese-basics' | 'english';

export interface SearchResult {
  id: string;
  source: SearchSource;
  title: string;
  detail: string;
  text: string;
}

const MAX_RESULTS_PER_GROUP = 20;

const getExtensionUrl = (path: string) => chrome.runtime.getURL(path);

const normalize = (value: string) => value.trim().toLocaleLowerCase();

const getMatchScore = (text: string, keyword: string) => {
  const normalizedText = normalize(text);
  const normalizedKeyword = normalize(keyword);
  if (!normalizedKeyword) {
    return -1;
  }
  const index = normalizedText.indexOf(normalizedKeyword);
  if (index >= 0) {
    return 1000 - index;
  }

  let cursor = 0;
  let firstMatch = -1;
  for (const character of normalizedKeyword) {
    const nextIndex = normalizedText.indexOf(character, cursor);
    if (nextIndex < 0) {
      return -1;
    }
    if (firstMatch < 0) {
      firstMatch = nextIndex;
    }
    cursor = nextIndex + 1;
  }
  return 100 - firstMatch;
};

const toPoetryResult = (item: Poetry, prefix: string): SearchResult => {
  const paragraphs = item.paragraphs.join(' ');
  return {
    id: `${prefix}:poetry:${item.title}:${item.author}:${paragraphs.slice(0, 24)}`,
    source: 'poetry',
    title: item.title || '未命名诗词',
    detail: [item.author, paragraphs].filter(Boolean).join(' · '),
    text: [item.title, item.author, paragraphs, item.prologue, ...(item.tags ?? [])].join(' '),
  };
};

const toChineseBasicsResult = (item: ChineseBasicsEntry, prefix: string): SearchResult => ({
  id: `${prefix}:chinese-basics:${item.category}:${item.key}`,
  source: 'chinese-basics',
  title: item.title || item.key,
  detail: [item.pinyin, item.explanation, item.answer, item.example].filter(Boolean).join(' · '),
  text: [
    item.key,
    item.title,
    item.pinyin,
    item.explanation,
    item.traditional,
    item.radical,
    item.derivation,
    item.example,
    item.answer,
  ]
    .filter(Boolean)
    .join(' '),
});

const toEnglishResult = (
  item: { word?: unknown; definition?: unknown },
  prefix: string
): SearchResult | null => {
  if (typeof item.word !== 'string' || !item.word) {
    return null;
  }
  const definition = item.definition as
    | {
        phonetic?: string;
        meanings?: Array<{ partOfSpeech?: string; definitions?: Array<{ definition?: string }> }>;
      }
    | undefined;
  const meanings =
    definition?.meanings
      ?.flatMap((meaning) => [
        meaning.partOfSpeech,
        ...(meaning.definitions ?? []).map((entry) => entry.definition),
      ])
      .filter(Boolean) ?? [];
  return {
    id: `${prefix}:english:${item.word}`,
    source: 'english',
    title: item.word,
    detail: [definition?.phonetic, ...meanings].filter(Boolean).join(' · '),
    text: [item.word, definition?.phonetic, ...meanings].filter(Boolean).join(' '),
  };
};

const loadJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(getExtensionUrl(path));
  if (!response.ok) {
    throw new Error(`Unable to load ${path}`);
  }
  return response.json() as Promise<T>;
};

let databasePromise: Promise<SearchResult[]> | null = null;

export const getDatabaseSearchResults = () => {
  if (!databasePromise) {
    databasePromise = Promise.all([
      loadJson<Poetry[]>('data/poetry.json'),
      Promise.all(
        CHINESE_BASICS_CATEGORIES.map((category) =>
          loadJson<ChineseBasicsEntry[]>(CHINESE_BASICS_DATA_PATHS[category])
        )
      ),
      fetch(getExtensionUrl('data/google-10000-english-no-swears.txt')).then(async (response) => {
        if (!response.ok) {
          throw new Error('Unable to load English word list');
        }
        return response.text();
      }),
    ])
      .then(([poetry, chineseBasicsGroups, wordText]) => [
        ...poetry.map((item) => toPoetryResult(item, 'database')),
        ...chineseBasicsGroups.flat().map((item) => toChineseBasicsResult(item, 'database')),
        ...wordText
          .split(/\r?\n/u)
          .map((word) => toEnglishResult({ word: word.trim() }, 'database'))
          .filter((item): item is SearchResult => Boolean(item)),
      ])
      .catch((error) => {
        databasePromise = null;
        throw error;
      });
  }
  return databasePromise;
};

const getStorageItems = () =>
  new Promise<Record<string, unknown>>((resolve) => {
    chrome.storage.local.get(null, (items) => resolve(items as Record<string, unknown>));
  });

const getLearningHistory = (value: unknown) => {
  const records = value as Partial<LearningRecords<unknown>> | undefined;
  return Array.isArray(records?.history)
    ? records.history.flatMap((item) => item.records ?? [])
    : [];
};

export const getHistorySearchResults = async (): Promise<SearchResult[]> => {
  const storage = await getStorageItems();
  const results: SearchResult[] = [];

  Object.entries(storage).forEach(([key, value]) => {
    const records = getLearningHistory(value);
    if (key.startsWith(`${CACHE_KEYS.POETRY_LEARNING_RECORD}:`)) {
      records.forEach((record) => {
        if (record && typeof record === 'object' && 'paragraphs' in record) {
          results.push(toPoetryResult(record as Poetry, 'history'));
        }
      });
    } else if (key.startsWith(`${CACHE_KEYS.CHINESE_BASICS_LEARNING_RECORD}:`)) {
      records.forEach((record) => {
        if (record && typeof record === 'object' && 'key' in record) {
          results.push(toChineseBasicsResult(record as ChineseBasicsEntry, 'history'));
        }
      });
    } else if (key === CACHE_KEYS.EN_WORD_LEARNING_RECORD) {
      records.forEach((record) => {
        if (record && typeof record === 'object') {
          const result = toEnglishResult(
            record as { word?: unknown; definition?: unknown },
            'history'
          );
          if (result) {
            results.push(result);
          }
        }
      });
    }
  });

  return [...new Map(results.map((item) => [item.id, item])).values()];
};

export const searchResults = (records: SearchResult[], keyword: string) =>
  records
    .map((item) => ({ item, score: getMatchScore(item.text, keyword) }))
    .filter((item) => item.score >= 0)
    .sort(
      (first, second) =>
        second.score - first.score || first.item.title.localeCompare(second.item.title)
    )
    .slice(0, MAX_RESULTS_PER_GROUP)
    .map(({ item }) => item);
