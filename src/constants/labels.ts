import baiduIcon from '@/assets/images/favicon/baidu.ico';
import bilibiliIcon from '@/assets/images/favicon/bilibili.ico';
import googleNewIcon from '@/assets/images/favicon/google_new.png';
import kr36Icon from '@/assets/images/favicon/kr_36.ico';
import toutiaoIcon from '@/assets/images/favicon/toutiao.ico';
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
    icon: string;
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
        icon: weiboIcon,
        type: NewsType.WeiboMy,
      },
      {
        label: '热搜',
        icon: weiboIcon,
        type: NewsType.WeiboHot,
      },
      {
        label: '文娱',
        icon: weiboIcon,
        type: NewsType.WeiboAmuse,
      },
      {
        label: '生活',
        icon: weiboIcon,
        type: NewsType.WeiboLife,
      },
      {
        label: '社会',
        icon: weiboIcon,
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
        icon: xiaohongshuIcon,
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
        icon: toutiaoIcon,
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
        icon: zhihuIcon,
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
        icon: bilibiliIcon,
        type: NewsType.BilibiliAll,
      },
      {
        label: '热榜',
        icon: bilibiliIcon,
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
        icon: googleNewIcon,
        type: NewsType.GoogleZhForYou,
      },
      {
        label: '全球',
        icon: googleNewIcon,
        type: NewsType.GoogleZhGlobal,
      },
      {
        label: 'For You',
        icon: googleNewIcon,
        type: NewsType.GoogleEnForYou,
      },
      {
        label: 'Global',
        icon: googleNewIcon,
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
        icon: baiduIcon,
        type: NewsType.BaiduTieba,
      },
      {
        label: '热榜',
        icon: baiduIcon,
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
        icon: kr36Icon,
        type: NewsType.Kr36All,
      },
      {
        label: '热榜',
        icon: kr36Icon,
        type: NewsType.Kr36Hot,
      },
      {
        label: '股票',
        icon: kr36Icon,
        type: NewsType.Kr36Stock,
      },
      {
        label: '宏观',
        icon: kr36Icon,
        type: NewsType.Kr36Macro,
      },
    ],
  },
];
