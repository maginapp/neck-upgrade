// 模拟 Chrome API
const mockChrome = {
  runtime: {
    id: 'mock-extension-id',
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
      // 模拟返回当前标签页
      callback([
        {
          id: 1,
          url: 'chrome://newtab/',
          active: true,
        },
      ]);
    },
    create: (createProperties: any) => {
      console.log('Mock chrome.tabs.create:', createProperties);
    },
    sendMessage: (tabId: number, message: any) => {
      console.log('Mock chrome.tabs.sendMessage:', { tabId, message });
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
};

// 在开发环境中注入 mock Chrome API
if (process.env.NODE_ENV === 'development') {
  (window as any).chrome = mockChrome;
}

export default mockChrome;
