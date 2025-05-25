import { NewsType } from '@/types/app';
import { ggEnForYouNews, ggEnGlobalNews, ggZhForYouNews, ggZhGlobalNews } from './google';
import { weiboAmuseNews, weiboHotNews } from './weibo';
import { toutiaoNews } from './toutiao';
import { xhsNews } from './xiaohongshu';
import { CrawlerManager } from '../crawlerManager';
import { NewsItem, NewsDisplay } from '@/types';

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
