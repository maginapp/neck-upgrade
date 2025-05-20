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

3. 颈椎模式支持
4. test
5. 添加版本管理

end
a. utils添加心方法，其功能为:

    1. 每天首次时，调用以下两个api各3三次，使用utils里的limitConcurrency限流，单次并发2，并缓存请求结果。请请求结果与之前缓存合并。最大缓存长度为30，缓存数据为{records: FamousInfo[], date: string}

    2. 调用以下两个api 1.[ZenQuotes](https://zenquotes.io/) GET https://zenquotes.io/api/random，返回类型 ZenquotesRsp 2.[一言](https://v1.hitokoto.cn/?c=i) 返回类型 HitokotoData

    返回类型类型参考src/types/poetry.ts，最终转化为FamousInfo

    3. 从所有famous里随机抽取一条

    4. 缓存使用chore.storage

b. 添加组建 FamousSaying
