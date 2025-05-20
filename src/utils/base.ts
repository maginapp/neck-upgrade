// 获取当前日期（YYYY-MM-DD格式）
export const getCurrentDate = (): string => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};
