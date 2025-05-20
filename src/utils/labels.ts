import { Theme, NeckMode, DataType } from '@/types/app';

/**
 * 获取主题的显示标签
 * @param theme 主题类型
 * @returns 主题的显示标签
 */
export const getThemeLabel = (theme: Theme): string => {
  switch (theme) {
    case Theme.System:
      return '跟随系统';
    case Theme.Light:
      return '浅色';
    case Theme.Dark:
      return '深色';
    default:
      return '跟随系统';
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
  };
  return labels[type];
};
