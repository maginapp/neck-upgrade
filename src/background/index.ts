// 监听安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// 监听消息
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.type === 'GET_HISTORICAL_EVENTS') {
    // 处理获取历史事件的请求
    sendResponse({ success: true });
  }
  return true;
}); 