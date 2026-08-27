// background.js

import { MESSAGE_TYPES } from '@/constants/events';
import {
  PAGE_WOBBLE_ENABLED_STORAGE_KEY,
  PAGE_WOBBLE_SCOPE_STORAGE_KEY,
  normalizePageWobbleEnabled,
  normalizePageWobbleScope,
} from '@/utils/pageWobble';

const isSupportedWebPage = (url?: string) => {
  try {
    const protocol = new URL(url ?? '').protocol;
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};

const getGlobalWobbleEnabled = () => {
  return new Promise<boolean>((resolve) => {
    chrome.storage.local.get(
      [PAGE_WOBBLE_ENABLED_STORAGE_KEY, PAGE_WOBBLE_SCOPE_STORAGE_KEY],
      (items) => {
        resolve(
          normalizePageWobbleScope(items[PAGE_WOBBLE_SCOPE_STORAGE_KEY]) === 'global' &&
            normalizePageWobbleEnabled(items[PAGE_WOBBLE_ENABLED_STORAGE_KEY])
        );
      }
    );
  });
};

const injectWobbleIntoOpenPages = async () => {
  if (!(await getGlobalWobbleEnabled())) {
    return;
  }

  const tabs = await chrome.tabs.query({});
  await Promise.all(
    tabs
      .filter((tab) => tab.id && isSupportedWebPage(tab.url))
      .map((tab) =>
        chrome.scripting
          .executeScript({ target: { tabId: tab.id! }, files: ['assets/content.js'] })
          .catch(() => undefined)
      )
  );
};

chrome.runtime.onInstalled.addListener(() => {
  void injectWobbleIntoOpenPages();
});

chrome.runtime.onStartup.addListener(() => {
  void injectWobbleIntoOpenPages();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (
    areaName === 'local' &&
    (changes[PAGE_WOBBLE_SCOPE_STORAGE_KEY] ||
      changes[PAGE_WOBBLE_ENABLED_STORAGE_KEY]?.newValue === true)
  ) {
    void injectWobbleIntoOpenPages();
  }
});

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
