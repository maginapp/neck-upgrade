# 历史上的今天 Chrome 插件

这是一个 Chrome 浏览器插件，用于展示历史上的今天和节假日信息。

## 功能特点

- 从维基百科获取历史上的今天的大事记
- 显示节假日信息
- 展示下一个节假日的详细信息
- 支持本地数据缓存

## 使用

1. 在 Chrome 浏览器中打开扩展程序页面（chrome://extensions/）
2. 开启开发者模式
3. 点击"加载已解压的扩展程序"
4. 选择项目的 `dist` 目录

## 开发

1. 安装依赖：

```bash
pnpm install
```

2. 开发模式：

```bash
pnpm run dev
```

3. 构建：

```bash
pnpm run build
```

## 鸣谢

本插件使用了以下资源：

1. Logo图标为 [小羊快跑ya](https://www.iconfont.cn/user/detail?uid=6930945&nid=JPSbnJbK5Uuz)发布在[iconfont](https://www.iconfont.cn/collections/detail?cid=40379)的资源
2. 假期数据使用了[timer](https://timor.tech/)的[免费节假日 API](https://timor.tech/api/holiday)
3. 历史上的今日数据来自于[wikipedia](https://zh.m.wikipedia.org/zh-cn/%E5%8E%86%E5%8F%B2%E4%B8%8A%E7%9A%84%E4%BB%8A%E5%A4%A9)和[百度百科](https://baike.baidu.com/item/4%E6%9C%8828%E6%97%A5)
4. 古诗词数据来源于githun开源古诗词项目[chinese-poetry](https://github.com/chinese-poetry/chinese-poetry)
5. 名人名言数据源是 [ZenQuotes](https://zenquotes.io/) 和 [一言](https://v1.hitokoto.cn/?c=i)
6. 英语单词使用[google-10000-english](https://github.com/first20hours/google-10000-english)的no-swears高频单词
7. 热榜消息来自于[Google New](https://news.google.com/home?hl=zh-CN&gl=CN&ceid=CN:zh-Hans)、[头条热搜](https://so.toutiao.com/search/?keyword=%E7%83%AD%E6%A6%9C&pd=synthesis&source=input&traffic_source=&original_source=&in_tfs=&in_ogs=)、[微博热搜](https://s.weibo.com/top/summary?cate=realtimehot)和[小红书推荐](https://www.xiaohongshu.com/explore?channel_id=homefeed_recommend)
