import { limitConcurrency } from './base';
import { CacheManager } from './cacheManager';
import { ZenquotesRsp, HitokotoData, FamousInfo, FamousRecords } from '../types/famous';

const ZEN_QUOTES_API = 'https://zenquotes.io/api/random';
const HITOKOTO_API = 'https://v1.hitokoto.cn/?c=i';

const MAX_CACHE_LENGTH = 30;
const MAX_REQ_COUNT = 3;
const CONCURRENT_LIMIT = 2;

class FamouseStorage extends CacheManager<FamousRecords> {
  constructor() {
    super('famous_quotes');
  }

  // 重写过期检查方法，设置项永不过期
  protected isExpired(timestamp: string) {
    const today = new Date().toISOString().split('T')[0];
    const cache = new Date(timestamp).toISOString().split('T')[0];
    return cache !== today;
  }
}

const cacheManager = new FamouseStorage();

const convertZenquotesRsp = (data: ZenquotesRsp): FamousInfo[] => {
  return data.map((item) => ({
    content: item.q,
    source: item.a,
  }));
};

const fetchZenquotesRsp = async (): Promise<FamousInfo[]> => {
  try {
    const response = await fetch(ZEN_QUOTES_API);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return convertZenquotesRsp(data);
  } catch (error) {
    console.error(error);
    return [];
  }
};

const convertHitokotoData = (data: HitokotoData): FamousInfo => {
  return {
    content: data.hitokoto,
    source:
      data.from_who && data.from
        ? data.from_who + ' - ' + data.from
        : data.from_who || data.from || '',
  };
};

const fetchHitokotoData = async (): Promise<FamousInfo[]> => {
  try {
    const response = await fetch(HITOKOTO_API);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return [convertHitokotoData(data)];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getFamousQuotes = async (): Promise<FamousInfo[]> => {
  const today = new Date().toISOString().split('T')[0];
  const cached = await cacheManager.get();

  if (cached && cached.currentDate === today) {
    return cached.records;
  }

  const zenAndHitokotoTask = await Promise.all([
    limitConcurrency(fetchZenquotesRsp, Array(MAX_REQ_COUNT), CONCURRENT_LIMIT),
    limitConcurrency(fetchHitokotoData, Array(MAX_REQ_COUNT), CONCURRENT_LIMIT),
  ]);

  const results = zenAndHitokotoTask.flat(2);

  const newRecords = results.filter(
    (record): record is FamousInfo => record !== null && record !== undefined
  );
  const existingRecords = cached?.records || [];
  const allRecords = [...existingRecords, ...newRecords].slice(-MAX_CACHE_LENGTH);

  await cacheManager.set({
    records: allRecords,
    currentDate: today,
  });

  return allRecords;
};

export const getRandomFamousQuote = async (): Promise<FamousInfo> => {
  const quotes = await getFamousQuotes();
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};
