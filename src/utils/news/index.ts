import { NewsItem, NewsDisplay } from '@/types';
import { NewsType } from '@/types/app';

import { CrawlerManager } from '../crawlerManager';

import { ggEnForYouNews, ggEnGlobalNews, ggZhForYouNews, ggZhGlobalNews } from './google';
import { toutiaoNews } from './toutiao';
import { weiboAmuseNews, weiboHotNews } from './weibo';
import { xhsNews } from './xiaohongshu';

export const newsManagerMap: Record<NewsType, CrawlerManager<NewsItem[], NewsDisplay>> = {
  [NewsType.GgEnForYou]: ggEnForYouNews,
  [NewsType.GgZhForYou]: ggZhForYouNews,
  [NewsType.GgEnGlobal]: ggEnGlobalNews,
  [NewsType.GgZhGlobal]: ggZhGlobalNews,
  [NewsType.WeiboAmuse]: weiboAmuseNews,
  [NewsType.WeiboHot]: weiboHotNews,
  [NewsType.Toutiao]: toutiaoNews,
  [NewsType.Xiaohongshu]: xhsNews,
};
