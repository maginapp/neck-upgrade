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

// 收敛当前时间，便于测试mock
const getNow = (): Date => {
  return new Date();
};

const getCurISOString = (): string => {
  return getNow().toISOString();
};

// 获取当前日期（YYYY-MM-DD格式）
const getCurrentDate = (): string => {
  return getNow().toISOString().split('T')[0];
};

export const dateUtils = {
  getNow,
  getCurISOString,
  getCurrentDate,
};
export function padZero(num: number): string {
  return num.toString().padStart(2, '0');
}
