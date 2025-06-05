import { NewsItem, NewsDisplay, NewsErrorInfo } from '@/types';
import { NewsType } from '@/types/app';

import { CrawlerManager } from '../crawlerManager';

import { baiduHotNews, baiduTiebaNews } from './baidu';
import { bilibiliRankNews, bilibiliAllNews } from './bilibili';
import { ggEnForYouNews, ggEnGlobalNews, ggZhForYouNews, ggZhGlobalNews } from './google';
import { ke36NewsAll, ke36NewsCompany, ke36NewsHot, ke36NewsMacro, ke36NewsStock } from './kr36';
import { toutiaoNews } from './toutiao';
import { v2exAllNews, v2exCreativeNews, v2exHotNews, v2exPlayNews, v2exTechNews } from './v2ex';
import { weiboAmuseNews, weiboHotNews, weiboLifeNews, weiboMyNews, weiboSocialNews } from './weibo';
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
  [NewsType.WeiboMy]: weiboMyNews,
  [NewsType.WeiboLife]: weiboLifeNews,
  [NewsType.WeiboSocial]: weiboSocialNews,
  [NewsType.Toutiao]: toutiaoNews,
  [NewsType.Xiaohongshu]: xhsNews,
  [NewsType.Zhihu]: zhihuHotNews,
  [NewsType.BilibiliAll]: bilibiliAllNews,
  [NewsType.BilibiliRank]: bilibiliRankNews,
  [NewsType.BaiduTieba]: baiduTiebaNews,
  [NewsType.BaiduHot]: baiduHotNews,
  [NewsType.Kr36All]: ke36NewsAll,
  [NewsType.Kr36Hot]: ke36NewsHot,
  [NewsType.Kr36Stock]: ke36NewsStock,
  [NewsType.Kr36Company]: ke36NewsCompany,
  [NewsType.Kr36Macro]: ke36NewsMacro,
  [NewsType.V2exAll]: v2exAllNews,
  [NewsType.V2exCreative]: v2exCreativeNews,
  [NewsType.V2exHot]: v2exHotNews,
  [NewsType.V2exPlay]: v2exPlayNews,
  [NewsType.V2exTech]: v2exTechNews,
};
