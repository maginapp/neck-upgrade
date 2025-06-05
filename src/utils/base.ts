export function getRandomNumber(min: number, max: number, preRotate: number): number {
  const base = Math.floor(Math.random() * (max - min + 1)) + min;
  let isPositive = Math.random() >= 0.5;
  if (preRotate > 0) {
    isPositive = false;
  } else if (preRotate < 0) {
    isPositive = true;
  }

  const tag = isPositive ? 1 : -1;
  return base * tag;
}

export function formatIntNumber(num: number | string, min: number, max: number): number {
  const value = parseInt(num.toString());
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

function formatDateTime(d: Date) {
  // 提取年、月、日、时、分、秒（注意月份从0开始，需+1）
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  // 拼接成指定格式
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 收敛当前时间，便于测试mock
const getNow = (): Date => {
  return new Date();
};

const getCurISOString = (): string => {
  return formatDateTime(getNow());
};

const getDate = (d: Date): string => {
  return formatDateTime(d).split(' ')[0];
};

const getCurrentDate = (): string => {
  return getDate(getNow());
};

export const dateUtils = {
  getNow,
  getCurISOString,
  getCurrentDate,
  formatDateTime,
  getDate,
};
export function padZero(num: number): string {
  return num.toString().padStart(2, '0');
}
