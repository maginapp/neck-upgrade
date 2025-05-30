import baiduIcon from '@/assets/images/favicon/baidu.ico';
import bilibiliIcon from '@/assets/images/favicon/bilibili.ico';
import googleNewIcon from '@/assets/images/favicon/google_new.png';
import kr36Icon from '@/assets/images/favicon/kr_36.ico';
import toutiaoIcon from '@/assets/images/favicon/toutiao.ico';
import weiboIcon from '@/assets/images/favicon/weibo.ico';
import xiaohongshuIcon from '@/assets/images/favicon/xiaohongshu.ico';
import zhihuIcon from '@/assets/images/favicon/zhihu.ico';
import { Theme, NeckMode, DataType, KnowledgeMode, NewsType } from '@/types/app';

/**
 * 获取主题的显示标签
 * @param theme 主题类型
 * @returns 主题的显示标签
 */
export const getThemeLabel = (theme: Theme): string => {
  switch (theme) {
    case Theme.System:
      return '系统';
    case Theme.Light:
      return '亮色';
    case Theme.Dark:
      return '暗黑';
    default:
      return '系统';
  }
};

/**
 * 获取颈椎模式的显示标签
 * @param mode 颈椎模式类型
 * @returns 颈椎模式的显示标签
 */
export const getNeckModeLabel = (mode: NeckMode): string => {
  const labels: Record<NeckMode, string> = {
    [NeckMode.Normal]: '普通',
    [NeckMode.Training]: '训练',
    [NeckMode.Intense]: '强化',
    [NeckMode.Custom]: '高级',
  };
  return labels[mode];
};

/**
 * 获取数据类型的显示标签
 * @param type 数据类型
 * @returns 数据类型的显示标签
 */
export const getDataTypeLabel = (type: DataType): string => {
  const labels: Record<DataType, string> = {
    [DataType.Poetry]: '诗词',
    [DataType.History]: '历史',
    [DataType.English]: '英语',
    [DataType.News]: '热榜',
  };
  return labels[type];
};

/**
 * 获取百科数据源的显示标签
 * @param mode 百科数据源类型
 * @returns 百科数据源的显示标签
 */
export const getKnowledgeModeLabel = (mode: KnowledgeMode): string => {
  const labels: Record<KnowledgeMode, string> = {
    [KnowledgeMode.Wiki]: '维基百科',
    [KnowledgeMode.Baidu]: '百度百科',
  };
  return labels[mode];
};

/**
 * 获取新闻类型的显示标签
 * @param type 新闻类型
 * @returns 新闻类型的信息 包含标签和图标
 */
export const getNewsTypeInfo = (
  type: NewsType
): {
  label: string;
  icon: string;
} => {
  const labels: Record<
    NewsType,
    {
      label: string;
      icon: string;
    }
  > = {
    [NewsType.WeiboMy]: {
      label: '我的',
      icon: weiboIcon,
    },
    [NewsType.WeiboHot]: {
      label: '热搜',
      icon: weiboIcon,
    },
    [NewsType.WeiboAmuse]: {
      label: '文娱',
      icon: weiboIcon,
    },
    [NewsType.WeiboLife]: {
      label: '生活',
      icon: weiboIcon,
    },
    [NewsType.WeiboSocial]: {
      label: '社会',
      icon: weiboIcon,
    },
    [NewsType.Toutiao]: {
      label: '热搜',
      icon: toutiaoIcon,
    },
    [NewsType.Xiaohongshu]: {
      label: '推荐',
      icon: xiaohongshuIcon,
    },
    [NewsType.Zhihu]: {
      label: '热榜',
      icon: zhihuIcon,
    },
    [NewsType.BilibiliAll]: {
      label: '综合',
      icon: bilibiliIcon,
    },
    [NewsType.BilibiliRank]: {
      label: '热榜',
      icon: bilibiliIcon,
    },
    [NewsType.BaiduTieba]: {
      label: '贴吧',
      icon: baiduIcon,
    },
    [NewsType.BaiduHot]: {
      label: '热榜',
      icon: baiduIcon,
    },
    [NewsType.Kr36All]: {
      label: '综合',
      icon: kr36Icon,
    },
    [NewsType.Kr36Hot]: {
      label: '热榜',
      icon: kr36Icon,
    },
    [NewsType.Kr36Stock]: {
      label: '股票',
      icon: kr36Icon,
    },
    [NewsType.Kr36Macro]: {
      label: '宏观',
      icon: kr36Icon,
    },
    [NewsType.GoogleZhForYou]: {
      label: '推荐',
      icon: googleNewIcon,
    },
    [NewsType.GoogleZhGlobal]: {
      label: '全球',
      icon: googleNewIcon,
    },
    [NewsType.GoogleEnForYou]: {
      label: 'For You',
      icon: googleNewIcon,
    },
    [NewsType.GoogleEnGlobal]: {
      label: 'Global',
      icon: googleNewIcon,
    },
  };
  return labels[type];
};
