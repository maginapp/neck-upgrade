// 监听来自popup的消息
// chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
//   if (request.type === 'GET_PAGE_CONTENT') {
//     // 获取页面内容
//     const content = document.body.innerText;
//     sendResponse({ content });
//   }
//   return true;
// });

// chrome.runtime.sendMessage({ action: 'getTime' }, (response) => {
//   console.log('来自后台的时间：', response.time);
// });
