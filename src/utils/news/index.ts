import { NewsItem, NewsDisplay, NewsErrorInfo } from '@/types';
import { NewsType } from '@/types/app';

import { CrawlerManager } from '../crawlerManager';

import { bilibiliRankNews, bilibiliAllNews } from './bilibili';
import { ggEnForYouNews, ggEnGlobalNews, ggZhForYouNews, ggZhGlobalNews } from './google';
import { toutiaoNews } from './toutiao';
import { weiboAmuseNews, weiboHotNews } from './weibo';
import { xhsNews } from './xiaohongshu';
import { zhihuHotNews } from './zhihu';

export const newsManagerMap: Record<
  NewsType,
  CrawlerManager<NewsItem[] | NewsErrorInfo, NewsDisplay>
> = {
  [NewsType.GoogleEnForYou]: ggEnForYouNews,
  [NewsType.GoogleZhForYou]: ggZhForYouNews,
  [NewsType.GoogleEnGlobal]: ggEnGlobalNews,
  [NewsType.GoogleZhGlobal]: ggZhGlobalNews,
  [NewsType.WeiboAmuse]: weiboAmuseNews,
  [NewsType.WeiboHot]: weiboHotNews,
  [NewsType.Toutiao]: toutiaoNews,
  [NewsType.Xiaohongshu]: xhsNews,
  [NewsType.Zhihu]: zhihuHotNews,
  [NewsType.BilibiliAll]: bilibiliAllNews,
  [NewsType.BilibiliRank]: bilibiliRankNews,
};
