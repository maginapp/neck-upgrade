// 监听安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// 缓存键名
const CACHE_KEY = 'wiki_historical_events';
const CACHE_EXPIRY_KEY = 'wiki_cache_expiry';

// 维基百科响应数据类型
interface WikiResponse {
  title: string;
  extract: string;
  content_urls: {
    desktop: {
      page: string;
    };
  };
  timestamp: string;
}

// 缓存数据类型
interface CacheData {
  data: WikiResponse;
  timestamp: string;
}

// 检查缓存是否过期
function isCacheExpired(): boolean {
  const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
  if (!expiry) return true;
  
  const now = new Date();
  const expiryDate = new Date(expiry);
  return now > expiryDate;
}

// 设置缓存过期时间（当天23:59:59）
function setCacheExpiry() {
  const now = new Date();
  const expiry = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  console.log('set cacheData bg', CACHE_KEY, CACHE_KEY);
  localStorage.setItem(CACHE_EXPIRY_KEY, expiry.toISOString());
}

// 从维基百科获取历史事件
async function fetchHistoricalEvents(): Promise<WikiResponse> {
  console.log('fetchHistoricalEvents bg');
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    const response = await fetch(`https://zh.wikipedia.org/api/rest_v1/page/summary/${month}月${day}日`);
    const data = await response.json();
    
    // 缓存数据
    chrome.storage.local.set({
      [CACHE_KEY]: {
        data,
        timestamp: new Date().toISOString()
      } as CacheData
    });
    
    // 设置缓存过期时间
    setCacheExpiry();
    
    return data;
  } catch (error) {
    console.error('获取历史事件失败:', error);
    throw error;
  }
}

// 监听消息
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.type === 'GET_HISTORICAL_EVENTS') {
    // 检查缓存
    chrome.storage.local.get([CACHE_KEY], async (result) => {
      const cachedData = result[CACHE_KEY] as CacheData | undefined;
      
      if (cachedData && !isCacheExpired()) {
        // 使用缓存数据
        sendResponse({ 
          success: true, 
          data: cachedData.data,
          fromCache: true
        });
      } else {
        try {
          // 获取新数据
          const data = await fetchHistoricalEvents();
          sendResponse({ 
            success: true, 
            data,
            fromCache: false
          });
        } catch (error) {
          sendResponse({ 
            success: false, 
            error: '获取数据失败'
          });
        }
      }
    });
    
    return true; // 保持消息通道开放
  }
}); 