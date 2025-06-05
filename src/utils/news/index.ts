import { NewsItem, NewsDisplay, NewsErrorInfo } from '@/types';
import { NewsType } from '@/types/app';

import { CrawlerManager } from '../crawlerManager';

import { baiduHotNews, baiduTiebaNews } from './baidu';
import {
  bilibiliRankNews,
  bilibiliAllNews,
  bilibiliRankDougaNews,
  bilibiliRankSportsNews,
  bilibiliRankFoodNews,
  bilibiliRankTechNews,
  bilibiliRankKnowledgeNews,
  bilibiliRankEntNews,
  bilibiliRankMusicNews,
  bilibiliRankKichikuNews,
  bilibiliRankDanceNews,
  bilibiliRankCinephileNews,
} from './bilibili';
import {
  ggEnBussinessNews,
  ggEnEntertainmentNews,
  ggEnForYouNews,
  ggEnGlobalNews,
  ggEnHealthNews,
  ggEnScienceNews,
  ggEnSportsNews,
  ggEnTechNews,
  ggEnUsNews,
  ggZhBussinessNews,
  ggZhChinaNews,
  ggZhEntertainmentNews,
  ggZhForYouNews,
  ggZhGlobalNews,
  ggZhSportsNews,
} from './google';
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
  // 谷歌 英文
  [NewsType.GoogleEnForYou]: ggEnForYouNews,
  [NewsType.GoogleZhForYou]: ggZhForYouNews,
  [NewsType.GoogleEnGlobal]: ggEnGlobalNews,
  [NewsType.GoogleZhGlobal]: ggZhGlobalNews,
  [NewsType.GoogleEnTech]: ggEnTechNews,
  [NewsType.GoogleEnUs]: ggEnUsNews,
  [NewsType.GoogleEnEntertainment]: ggEnEntertainmentNews,
  [NewsType.GoogleEnSports]: ggEnSportsNews,
  [NewsType.GoogleEnBusiness]: ggEnBussinessNews,
  [NewsType.GoogleEnScience]: ggEnScienceNews,
  [NewsType.GoogleEnHealth]: ggEnHealthNews,
  // 谷歌 中文
  [NewsType.GoogleZhChina]: ggZhChinaNews,
  [NewsType.GoogleZhEntertainment]: ggZhEntertainmentNews,
  [NewsType.GoogleZhBussiness]: ggZhBussinessNews,
  [NewsType.GoogleZhSports]: ggZhSportsNews,
  // 微博
  [NewsType.WeiboAmuse]: weiboAmuseNews,
  [NewsType.WeiboHot]: weiboHotNews,
  [NewsType.WeiboMy]: weiboMyNews,
  [NewsType.WeiboLife]: weiboLifeNews,
  [NewsType.WeiboSocial]: weiboSocialNews,
  // 头条
  [NewsType.Toutiao]: toutiaoNews,
  // 小红书
  [NewsType.Xiaohongshu]: xhsNews,
  // 知乎
  [NewsType.Zhihu]: zhihuHotNews,
  // B站
  [NewsType.BilibiliAll]: bilibiliAllNews,
  [NewsType.BilibiliRank]: bilibiliRankNews,
  [NewsType.BilibiliRankDouga]: bilibiliRankDougaNews,
  [NewsType.BilibiliRankSports]: bilibiliRankSportsNews,
  [NewsType.BilibiliRankFood]: bilibiliRankFoodNews,
  [NewsType.BilibiliRankTech]: bilibiliRankTechNews,
  [NewsType.BilibiliRankKnowledge]: bilibiliRankKnowledgeNews,
  [NewsType.BilibiliRankEnt]: bilibiliRankEntNews,
  [NewsType.BilibiliRankMusic]: bilibiliRankMusicNews,
  [NewsType.BilibiliRankKichiku]: bilibiliRankKichikuNews,
  [NewsType.BilibiliRankDance]: bilibiliRankDanceNews,
  [NewsType.BilibiliRankCinephile]: bilibiliRankCinephileNews,
  // 百度
  [NewsType.BaiduTieba]: baiduTiebaNews,
  [NewsType.BaiduHot]: baiduHotNews,
  // 36克
  [NewsType.Kr36All]: ke36NewsAll,
  [NewsType.Kr36Hot]: ke36NewsHot,
  [NewsType.Kr36Stock]: ke36NewsStock,
  [NewsType.Kr36Company]: ke36NewsCompany,
  [NewsType.Kr36Macro]: ke36NewsMacro,
  // v2ex
  [NewsType.V2exAll]: v2exAllNews,
  [NewsType.V2exCreative]: v2exCreativeNews,
  [NewsType.V2exHot]: v2exHotNews,
  [NewsType.V2exPlay]: v2exPlayNews,
  [NewsType.V2exTech]: v2exTechNews,
};
