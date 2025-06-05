import { Theme, NeckMode, DataType, KnowledgeMode } from '@/types/app';

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
