import { FETCH_TIMEOUT } from '@/constants';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * 封装fetch请求，添加超时和错误处理
 * @param url 请求URL
 * @param options 请求配置，包含超时时间
 * @returns Promise<Response>
 */
export async function fetchWithTimeout(url: string, options: FetchOptions = {}): Promise<Response> {
  const { timeout = FETCH_TIMEOUT, ...fetchOptions } = options;

  const controller = new AbortController();
  const { signal } = controller;

  // 设置超时
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal,
    });

    return response;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw error;
    }
    throw new Error('An unknown error occurred');
  } finally {
    clearTimeout(timeoutId);
  }
}
