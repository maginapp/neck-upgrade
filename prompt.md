1. holiday today
2. poem
3. english

核心模块

标题区域：时间+日期+下一次节假日
内容：A: 历史上的今天 B: 诗词 C: english(word) + sentence

右上角功能：

1. 主题：暗黑模式/普通模式
2. 颈椎：普通/训练/高强度
3. 切换数据：古诗词/历史/英语

拆分App.tsx，分为组件，调整目录结构

[] todo

1. 主题模式添加新模式： 跟随系统/暗黑模式/普通模式，默认跟随系统
2. 缓存右上角配置
3. 主题切换色彩
4. 颈椎模式支持
5. 优化并发节流写法
6. 大json抽离，不打包
7. test

````
  // 生成当天需要复习的诗词
    records.todayReview = {
      records: generateReviews(records.history, forgetIntervals, todayRatio),
      currentIndex: 0,
    };
    await saveLearningRecords(cacheKey, records);
  }

  const result: T[] = [];
  let remainingCount = batchSize;

  // 优先返回当天新增的
  while (remainingCount > 0 && records.todayNew.currentIndex < records.todayNew.records.length) {
    const record = records.todayNew.records[records.todayNew.currentIndex];
    records.todayNew.currentIndex++;
    result.push(record);

    // 如果已经展示过这首，将其添加到历史记录
    const historyRecord = records.history.find((record) => record.date === currentDate);

    if (!historyRecord) {
      records.history.unshift({
        date: currentDate,
        records: [record],


        ```逻辑有问题
````
