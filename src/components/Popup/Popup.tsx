import { useEffect, useState } from 'react';

import { MESSAGE_TYPES } from '@/constants/events';
import { ChromeMessage, SettingsOpenStatusMessage } from '@/types/message';

import styles from './Popup.module.scss';

export const Popup: React.FC = () => {
  const [isNewTab, setIsNewTab] = useState(false);
  const [currentTabId, setCurrentTabId] = useState<number | undefined>();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // 检查当前页面是否是新标签页
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab.url === 'chrome://newtab/' && currentTab.id) {
        setIsNewTab(true);
        setCurrentTabId(currentTab.id);
        // 获取当前设置面板状态
        chrome.tabs.sendMessage(currentTab.id, { type: MESSAGE_TYPES.GET_SETTINGS_OPEN_STATUS });
      }
    });
  }, []);

  useEffect(() => {
    // 监听来自 content script 的消息
    const messageListener = (message: ChromeMessage) => {
      if (message.type === MESSAGE_TYPES.SETTINGS_OPEN_STATUS) {
        const toggleMessage = message as SettingsOpenStatusMessage;
        setIsSettingsOpen(toggleMessage.isOpen);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // 清理函数
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const handleOpenSettings = () => {
    if (isNewTab && currentTabId) {
      // 切换设置面板状态
      const newStatus = !isSettingsOpen;
      chrome.tabs.sendMessage(currentTabId, {
        type: MESSAGE_TYPES.TOGGLE_ACTIVE_SETTINGS,
        isOpen: newStatus,
      });
      setIsSettingsOpen(newStatus);
    }
  };

  const handleOpenNewTab = () => {
    chrome.tabs.create({ url: 'chrome://newtab/' });
  };

  const handleOpenExtensionDetail = () => {
    const extensionId = chrome.runtime.id;
    const webstoreUrl = `chrome://extensions/?id=${extensionId}`;

    chrome.tabs.create({ url: webstoreUrl });
  };

  const handleOpenWebsitePermission = () => {
    const extensionId = chrome.runtime.id;
    chrome.tabs.create({
      url: `chrome://settings/content/siteDetails?site=chrome-extension%3A%2F%2F${extensionId}`,
    });
  };

  const handleOpenShortcut = () => {
    chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
  };

  const handleOpenFeedback = () => {
    chrome.tabs.create({ url: 'https://github.com/maginapp/neck-upgrade/issues' });
  };

  return (
    <div className={styles.popup}>
      <h1>{chrome.i18n.getMessage('popup_title')}</h1>
      <p>{chrome.i18n.getMessage('popup_description')}</p>
      <div className={styles.buttonGroup}>
        {isNewTab && (
          <button className={styles.button} onClick={handleOpenSettings}>
            {isSettingsOpen ? '关闭设置' : '打开设置'}
          </button>
        )}
        <button className={styles.button} onClick={handleOpenNewTab}>
          打开新标签页
        </button>
        <button className={styles.button} onClick={handleOpenExtensionDetail}>
          管理拓展程序
        </button>
        <button className={styles.button} onClick={handleOpenWebsitePermission}>
          查看网站权限
        </button>
        <button className={styles.button} onClick={handleOpenShortcut}>
          快捷键
        </button>
        <button className={styles.button} onClick={handleOpenFeedback}>
          反馈与讨论
        </button>
      </div>
    </div>
  );
};
