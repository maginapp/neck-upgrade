export function getRandomNumber(min: number, max: number, allowNegative: boolean = false): number {
  let base = Math.floor(Math.random() * (max - min + 1)) + min;
  let tag = allowNegative ? (Math.random() > 0.5 ? 1 : -1) : 1;
  return base * tag;
}

export function formatIntNumber(num: number | string, min: number, max: number): number {
  let value = parseInt(num.toString());
  if (isNaN(value)) {
    return min;
  }
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

// 获取当前日期（YYYY-MM-DD格式）
export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export function padZero(num: number): string {
  return num.toString().padStart(2, '0');
}
