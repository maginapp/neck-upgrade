// background.js

import { MESSAGE_TYPES } from '@/constants/events';

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((message) => {
  // console.log('????? background', message);
  if (message.type === MESSAGE_TYPES.SETTINGS_OPEN_STATUS) {
    // 打开设置面板
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   const currentTab = tabs[0];
    //   chrome.tabs.sendMessage(currentTab.id!, { type: 'TOGGLE_SETTINGS' });
    // });
    // chrome.runtime.sendMessage({ type: MESSAGE_TYPES.SETTINGS_OPEN_STATUS });
  }
});
