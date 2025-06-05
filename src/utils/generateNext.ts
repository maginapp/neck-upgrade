import { HistoryRecord, LearningRecords } from '@/types';

import { dateUtils } from './base';

const REVIEW_RATIO = 5; // 每5次复习，插入1次当天学习的
// 艾宾浩斯遗忘曲线复习间隔（天数）
const EBBINGHAUS_INTERVALS = [1, 2, 4, 7, 15, 30];
const MAX_RETRY_COUNT = 3;
const SELECTED_COUNT = 4;
const REVIEW_COUNT = 30; // 复习天数

// 根据艾宾浩斯遗忘曲线生成复习诗词列表
const generateReviews = <T>(
  historyRecords: HistoryRecord<T>[],
  todayRecords: T[],
  forgetIntervals: number[],
  todayRatio: number
): T[] => {
  const reviewsRecords: T[] = [];
  const currentDate = dateUtils.getCurrentDate();

  // 按日期对历史记录进行分组
  const listByDate = new Map<string, T[]>();
  historyRecords.forEach((record) => {
    listByDate.set(record.date, record.records);
  });

  // 获取当天的诗词

  const usedMap = new Map<T, boolean>();

  // 根据艾宾浩斯遗忘曲线选择需要复习的诗词
  forgetIntervals.forEach((interval) => {
    const targetDate = new Date(currentDate);
    targetDate.setDate(targetDate.getDate() - interval);
    const dateStr = dateUtils.getDate(targetDate);
    const records = listByDate.get(dateStr);

    if (records) {
      // 随机选择该日期的一首诗词
      const randomIndex = Math.floor(Math.random() * records.length);
      const record = records[randomIndex];
      if (!usedMap.has(record)) {
        usedMap.set(record, true);
      }
    }
  });

  // 每5条历史记录插入1条当天的诗词
  const finalReviewRecords: T[] = [];
  let todayRecordIndex = 0;

  reviewsRecords.forEach((poem, index) => {
    finalReviewRecords.push(poem);

    // 每5条历史记录后插入1条当天的诗词
    if ((index + 1) % todayRatio === 0 && todayRecords.length > 0) {
      const todayPoem = todayRecords[todayRecordIndex % todayRecords.length];
      finalReviewRecords.push(todayPoem);
      todayRecordIndex++;
    }
  });

  // 如果还有当天的诗词没有插入，添加到末尾
  if (todayRecordIndex < todayRecords.length) {
    finalReviewRecords.push(...todayRecords.slice(todayRecordIndex));
  }

  return finalReviewRecords;
};

// 获取学习记录
const getLearningRecords = async <T>(
  key: string,
  currentDate: string
): Promise<LearningRecords<T>> => {
  const result = await chrome.storage.local.get(key);
  return (
    result[key] || {
      history: [],
      todayNew: { records: [], currentIndex: 0 },
      todayReview: { records: [], currentIndex: 0 },
      currentDate,
    }
  );
};

// 保存学习记录
const saveLearningRecords = async <T>(key: string, records: LearningRecords<T>): Promise<void> => {
  await chrome.storage.local.set({ [key]: records });
};

interface NextRecordParams<T> {
  cacheKey: string; // 缓存key
  compareFn: (a: T, b: T) => boolean; // 比较函数
  unitCount: number; // 每天选择的数量
  reviewDays?: number; // 复习天数
  forgetIntervals?: number[]; // 遗忘间隔
  todayRatio?: number; // 当天/review比例
  formatRecord?: (records: T[]) => Promise<T[]>; // 格式化记录
  getData: () => Promise<T[]> | T[]; // 获取数据
  batchSize?: number; // 每次获取的记录数量
}

// 从数据源中随机选择指定数量的记录
const selectRandom = <T>(
  batchSize: number,
  data: T[],
  compareFn: (a: T, b: T) => boolean,
  excludeRecords: T[] = []
): T[] => {
  const availableRecords =
    excludeRecords.length > 0
      ? data.filter((record) => !excludeRecords.some((exclude) => compareFn(exclude, record)))
      : data;

  const result: Set<T> = new Set();
  let retryCount = 0;

  while (result.size < batchSize && retryCount < MAX_RETRY_COUNT) {
    for (let i = 0; i < batchSize; i++) {
      const randomIndex = Math.floor(Math.random() * availableRecords.length);
      const selectedRecord = availableRecords[randomIndex];
      result.add(selectedRecord);
    }
    retryCount++;
  }

  return [...result];
};

/**
 * 获取下一批学习记录
 * @description
 * 1. 优先返回当天新增的学习记录
 * 2. 如果当天新增记录不足，则从复习列表中补充
 * 3. 如果当天没有记录，会重新生成新的学习记录和复习列表
 * 4. 使用 Set 去重确保返回的记录不重复
 *
 * @template T 记录类型
 * @param {Object} params 参数对象
 * @param {string} params.cacheKey 缓存键名
 * @param {(a: T, b: T) => boolean} params.compareFn 记录比较函数
 * @param {number} params.unitCount 每天选择的新记录数量
 * @param {number} [params.reviewDays] 复习天数，默认30天
 * @param {number[]} [params.forgetIntervals] 遗忘间隔天数，默认[1,2,4,7,15,30]
 * @param {number} [params.todayRatio] 复习列表中插入当天记录的比例，默认每5条插入1条
 * @param {(records: T[]) => Promise<T[]>} [params.formatRecord] 记录格式化函数
 * @param {() => Promise<T[]> | T[]} params.getData 获取数据源函数
 * @param {number} [params.batchSize=1] 每次获取的记录数量
 * @returns {Promise<T[]>} 返回去重后的记录数组
 *
 * @example
 * ```typescript
 * const records = await getNextRecord({
 *   cacheKey: 'word-learning',
 *   compareFn: (a, b) => a.word === b.word,
 *   unitCount: 4,
 *   getData: () => fetchWords(),
 *   batchSize: 2
 * });
 * ```
 */
export const getNextRecord = async <T>(params: NextRecordParams<T>): Promise<T[]> => {
  const {
    cacheKey,
    compareFn,
    unitCount = SELECTED_COUNT,
    reviewDays = REVIEW_COUNT,
    forgetIntervals = EBBINGHAUS_INTERVALS,
    todayRatio = REVIEW_RATIO,
    formatRecord,
    getData,
    batchSize = 1,
  } = params;
  const currentDate = dateUtils.getCurrentDate();
  const records = await getLearningRecords<T>(cacheKey, currentDate);

  // 检查是否需要重置当天的记录
  if (
    currentDate !== records.currentDate ||
    (records.todayNew.currentIndex === 0 && records.todayNew.records.length === 0)
  ) {
    const data = await getData();

    // 需要选择新的诗词
    const allPreviousRecords = records.history
      .flatMap((record) => record.records)
      .filter((item) => item);

    // 选择与历史记录不重复的诗词 数量 unitCount
    let selectedRecords: T[];
    if (allPreviousRecords.length + unitCount > data.length) {
      selectedRecords = selectRandom(unitCount, data, compareFn, []);
    } else {
      selectedRecords = selectRandom(unitCount, data, compareFn, allPreviousRecords);
    }

    // 更新当天新增的诗词
    records.todayNew = {
      records: selectedRecords,
      currentIndex: 0,
    };

    // 生成当天需要复习的诗词
    records.todayReview = {
      records: generateReviews(records.history, selectedRecords, forgetIntervals, todayRatio),
      currentIndex: 0,
    };
  }

  let formattedRecords: T[] = [];

  // 优先返回当天新增的，未访问过的
  while (
    formattedRecords.length < batchSize &&
    records.todayNew.records &&
    records.todayNew.currentIndex < records.todayNew.records.length
  ) {
    const record = records.todayNew.records[records.todayNew.currentIndex];
    records.todayNew.currentIndex++;
    formattedRecords.push(record);
  }

  // 格式化当天数据，修改review列表为格式化后数据，history添加访问后数据
  if (formattedRecords.length && formatRecord) {
    formattedRecords = await formatRecord(formattedRecords);

    // 如果已经展示过这首，将其添加到历史记录
    let historyRecord = records.history.find((record) => record.date === currentDate);

    if (!historyRecord) {
      historyRecord = {
        date: currentDate,
        records: [],
      };
      records.history.unshift(historyRecord);
      // 保持历史记录不超过指定天数
      if (records.history.length > reviewDays) {
        records.history = records.history.slice(0, reviewDays);
      }
    }
    records.todayReview.records = records.todayReview.records.map((record) => {
      const formattedRecord = formattedRecords.find((item) => compareFn(item, record));
      const curRecord = formattedRecord ? formattedRecord : record;
      historyRecord!.records.push(curRecord);
      return curRecord;
    });
  }

  // 如果还需要更多记录，从复习列表中获取
  while (
    formattedRecords.length < batchSize &&
    records.todayReview.records &&
    records.todayReview.records.length > 0
  ) {
    const record = records.todayReview.records[records.todayReview.currentIndex];
    records.todayReview.currentIndex++;
    records.todayReview.currentIndex =
      records.todayReview.currentIndex % records.todayReview.records.length;
    formattedRecords.push(record);
  }
  await saveLearningRecords(cacheKey, records);
  return [...new Set(formattedRecords)];
};
