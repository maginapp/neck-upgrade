// 获取当前日期（YYYY-MM-DD格式）
export const getCurrentDate = (): string => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

export function limitConcurrency<T, R>(
  fn: (input: T) => Promise<R>,
  inputs: T[],
  limit: number
): Promise<R[]> {
  return new Promise((resolve, reject) => {
    const results: R[] = new Array(inputs.length);
    let inProgress = 0;
    let currentIndex = 0;
    let resolvedCount = 0;

    function next(): void {
      if (resolvedCount === inputs.length) {
        resolve(results);
        return;
      }

      while (inProgress < limit && currentIndex < inputs.length) {
        const i = currentIndex++;
        inProgress++;

        Promise.resolve(fn(inputs[i]))
          .then((res) => {
            results[i] = res;
          })
          .catch((err) => {
            reject(err);
          })
          .finally(() => {
            inProgress--;
            resolvedCount++;
            next();
          });
      }
    }

    next();
  });
}

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
