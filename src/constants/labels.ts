import baiduIcon from '@/assets/images/favicon/baidu.ico';
import bilibiliIcon from '@/assets/images/favicon/bilibili.ico';
import googleNewIcon from '@/assets/images/favicon/google_new.png';
import kr36Icon from '@/assets/images/favicon/kr_36.ico';
import toutiaoIcon from '@/assets/images/favicon/toutiao.ico';
import v2exIcon from '@/assets/images/favicon/v2ex.png';
import weiboIcon from '@/assets/images/favicon/weibo.ico';
import xiaohongshuIcon from '@/assets/images/favicon/xiaohongshu.ico';
import zhihuIcon from '@/assets/images/favicon/zhihu.ico';
import { NewsType, NewsGroup } from '@/types/app';

export const NEWS_GROUP_LABELS: Array<{
  label: string;
  icon: string;
  group: NewsGroup;
  children: Array<{
    label: string;
    type: NewsType;
  }>;
}> = [
  {
    label: '微博',
    icon: weiboIcon,
    group: NewsGroup.Weibo,
    children: [
      {
        label: '我的',
        type: NewsType.WeiboMy,
      },
      {
        label: '热搜',
        type: NewsType.WeiboHot,
      },
      {
        label: '文娱',
        type: NewsType.WeiboAmuse,
      },
      {
        label: '生活',
        type: NewsType.WeiboLife,
      },
      {
        label: '社会',
        type: NewsType.WeiboSocial,
      },
    ],
  },
  {
    label: '小红书',
    icon: xiaohongshuIcon,
    group: NewsGroup.Xiaohongshu,
    children: [
      {
        label: '推荐',
        type: NewsType.Xiaohongshu,
      },
    ],
  },
  {
    label: '头条',
    icon: toutiaoIcon,
    group: NewsGroup.Toutiao,
    children: [
      {
        label: '热搜',
        type: NewsType.Toutiao,
      },
    ],
  },
  {
    label: '知乎',
    icon: zhihuIcon,
    group: NewsGroup.Zhihu,
    children: [
      {
        label: '热榜',
        type: NewsType.Zhihu,
      },
    ],
  },
  {
    label: 'Bilibili',
    icon: bilibiliIcon,
    group: NewsGroup.Bilibili,
    children: [
      {
        label: '综合',
        type: NewsType.BilibiliAll,
      },
      {
        label: '热榜',
        type: NewsType.BilibiliRank,
      },
    ],
  },
  {
    label: 'Google',
    icon: googleNewIcon,
    group: NewsGroup.Google,
    children: [
      {
        label: '推荐',
        type: NewsType.GoogleZhForYou,
      },
      {
        label: '全球',
        type: NewsType.GoogleZhGlobal,
      },
      {
        label: 'For You',
        type: NewsType.GoogleEnForYou,
      },
      {
        label: 'Global',
        type: NewsType.GoogleEnGlobal,
      },
    ],
  },
  {
    label: '百度',
    icon: baiduIcon,
    group: NewsGroup.Baidu,
    children: [
      {
        label: '贴吧',
        type: NewsType.BaiduTieba,
      },
      {
        label: '热榜',
        type: NewsType.BaiduHot,
      },
    ],
  },
  {
    label: '36氪',
    icon: kr36Icon,
    group: NewsGroup.Kr36,
    children: [
      {
        label: '综合',
        type: NewsType.Kr36All,
      },
      {
        label: '热榜',
        type: NewsType.Kr36Hot,
      },
      {
        label: '股票',
        type: NewsType.Kr36Stock,
      },
      {
        label: '公司',
        type: NewsType.Kr36Company,
      },
      {
        label: '宏观',
        type: NewsType.Kr36Macro,
      },
    ],
  },
  {
    label: 'V2EX',
    icon: v2exIcon,
    group: NewsGroup.V2ex,
    children: [
      {
        label: '技术',
        type: NewsType.V2exTech,
      },
      {
        label: '好玩',
        type: NewsType.V2exPlay,
      },
      {
        label: '创意',
        type: NewsType.V2exCreative,
      },
      {
        label: '最热',
        type: NewsType.V2exHot,
      },
      {
        label: '综合',
        type: NewsType.V2exAll,
      },
    ],
  },
];
