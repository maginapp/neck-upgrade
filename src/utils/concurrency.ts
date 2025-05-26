export enum ResultType {
  OK = 'ok',
  ERROR = 'error',
}

type LimitConcurrencyItem<P, R> =
  | {
      status: ResultType.OK;
      data: R;
      params: P;
    }
  | {
      status: ResultType.ERROR;
      data: null;
      params: P;
    };

export function limitConcurrency<P, R>(
  fn: (input: P) => Promise<R>,
  inputs: P[],
  limit: number
): Promise<LimitConcurrencyItem<P, R>[]> {
  return new Promise((resolve, _) => {
    const results: LimitConcurrencyItem<P, R>[] = new Array(inputs.length);
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
            results[i] = {
              status: ResultType.OK,
              data: res,
              params: inputs[i],
            };
          })
          .catch((err) => {
            // reject(err);
            results[i] = {
              status: ResultType.ERROR,
              data: null,
              params: inputs[i],
            };
            console.error('Error fetching data:', err);
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
