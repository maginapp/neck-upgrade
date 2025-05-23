import { getCurrentDate, limitConcurrency, ResultType } from './base';
import { CacheManager } from './cacheManager';
import { ZenquotesRsp, HitokotoData, FamousInfo, FamousRecords } from '@/types';
import {
  FAMOUS_ZEN_QUOTES_API,
  FAMOUS_HITOKOTO_API,
  FAMOUS_MAX_CACHE_COUNT,
  FAMOUS_MAX_REQ_COUNT,
  FAMOUS_CON_LIMIT,
  FAMOUS_HI_MAX_REQ_COUNT,
  FAMOUS_HI_CON_LIMIT,
} from '@/constants';

class FamouseStorage extends CacheManager<FamousRecords> {
  constructor() {
    super('famous_quotes');
  }

  // 重写过期检查方法，设置项永不过期
  isExpired(_: string) {
    return false;
  }
}

const cacheManager = new FamouseStorage();

const convertZenquotesRsp = (data: ZenquotesRsp): FamousInfo[] => {
  return data.map((item) => ({
    content: item.q,
    source: item.a,
    website: 'zenquotes',
  }));
};

const fetchZenquotesRsp = async (): Promise<FamousInfo[]> => {
  try {
    const response = await fetch(FAMOUS_ZEN_QUOTES_API);
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
    website: '一言',
  };
};

const fetchHitokotoData = async (): Promise<FamousInfo[]> => {
  try {
    const response = await fetch(FAMOUS_HITOKOTO_API);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return [convertHitokotoData(data)];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getFamousQuotes = async (): Promise<FamousInfo[]> => {
  const today = getCurrentDate();
  const cached = await cacheManager.get();

  if (cached && cached.currentDate === today) {
    return cached.records;
  }

  const zenAndHitokotoTask = await Promise.all([
    limitConcurrency(fetchZenquotesRsp, Array(FAMOUS_MAX_REQ_COUNT), FAMOUS_CON_LIMIT),
    limitConcurrency(fetchHitokotoData, Array(FAMOUS_HI_MAX_REQ_COUNT), FAMOUS_HI_CON_LIMIT),
  ]);

  const results = zenAndHitokotoTask.flat();

  const newRecords = results
    .filter(
      (record) => record.status === ResultType.OK && record.data !== null && record !== undefined
    )
    .map((item) => item.data)
    .flat();
  const existingRecords = cached?.records || [];
  const allRecords = [...existingRecords, ...newRecords].slice(-FAMOUS_MAX_CACHE_COUNT);

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
