/* eslint-disable @typescript-eslint/no-explicit-any */
import en from '@/extension/_locales/en/messages.json';
import zhCN from '@/extension/_locales/zh_CN/messages.json';

// 定义消息类型
type Messages = {
  [key: string]: {
    message: string;
    description?: string;
  };
};

// 模拟 Chrome 扩展的 i18n 消息
const messages: Record<string, Messages> = {
  en,
  zh_CN: zhCN,
};

let mockWobbleStatus = {
  enabled: false,
  angle: 15,
  cycleSeconds: 60,
  randomAngle: false,
  nextChangeAt: null as number | null,
};

// 获取当前浏览器语言
const getBrowserLanguage = (): 'zh' | 'en' => {
  const lang = navigator.language.toLowerCase();
  return lang.startsWith('zh') ? 'zh' : 'en';
};

// 模拟 Chrome API
const mockChrome = {
  runtime: {
    id: 'mock-extension-id',
    lastError: undefined,
    getURL: (path: string) => {
      const normalizedPath = path.replace(/^\/+/, '');
      return new URL(normalizedPath, `${window.location.origin}/`).toString();
    },
    sendMessage: (message: any) => {
      console.log('Mock chrome.runtime.sendMessage:', message);
    },
    onMessage: {
      addListener: (_: (message: any) => void) => {
        console.log('Mock chrome.runtime.onMessage.addListener');
      },
      removeListener: (_: (message: any) => void) => {
        console.log('Mock chrome.runtime.onMessage.removeListener');
      },
    },
  },
  tabs: {
    query: (queryInfo: any, callback: (tabs: any[]) => void) => {
      console.log('Mock chrome.tabs.query:', queryInfo);
      const mockWebsite = new URLSearchParams(window.location.search).get('mockTab') === 'website';
      // 模拟返回当前标签页
      callback([
        {
          id: 1,
          url: mockWebsite ? 'https://example.com/' : 'chrome://newtab/',
          active: true,
        },
      ]);
    },
    create: (createProperties: any) => {
      console.log('Mock chrome.tabs.create:', createProperties);
    },
    sendMessage: (tabId: number, message: any, callback?: (response: any) => void) => {
      console.log('Mock chrome.tabs.sendMessage:', { tabId, message });
      if (message.type === 'popup:get-page-wobble-status') {
        callback?.(mockWobbleStatus);
      }
      if (message.type === 'popup:set-page-wobble-config') {
        mockWobbleStatus = {
          ...message.config,
          enabled: message.enabled,
          nextChangeAt: message.enabled ? Date.now() + message.config.cycleSeconds * 1000 : null,
        };
        callback?.(mockWobbleStatus);
      }
    },
  },
  scripting: {
    executeScript: async (details: any) => {
      console.log('Mock chrome.scripting.executeScript:', details);
      return [];
    },
  },
  storage: {
    local: {
      get: (keys: string | string[] | null, callback: (items: { [key: string]: any }) => void) => {
        console.log('Mock chrome.storage.local.get:', keys);
        callback({});
      },
      set: (items: { [key: string]: any }, callback?: () => void) => {
        console.log('Mock chrome.storage.local.set:', items);
        if (callback) callback();
      },
    },
  },
  i18n: {
    getMessage: (messageName: string): string => {
      const lang = getBrowserLanguage();
      const locale = lang === 'zh' ? 'zh_CN' : 'en';
      return messages[locale][messageName]?.message || messageName;
    },
    getUILanguage: (): string => {
      return navigator.language;
    },
  },
};

// 在开发环境中注入 mock Chrome API
if (process.env.NODE_ENV === 'development') {
  (window as any).chrome = mockChrome;
}

export default mockChrome;
