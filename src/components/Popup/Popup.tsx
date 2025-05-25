import React, { useEffect, useState } from 'react';
import styles from './Popup.module.scss';
import { MESSAGE_TYPES } from '@/constants/events';

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
    const messageListener = (message: any) => {
      if (message.type === MESSAGE_TYPES.SETTINGS_OPEN_STATUS) {
        setIsSettingsOpen(message.isOpen);
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

  return (
    <div className={styles.popup}>
      <h1>Neck Upgrade</h1>
      <p>保护你的颈椎健康</p>
      <div className={styles.buttonGroup}>
        {isNewTab && (
          <button className={styles.button} onClick={handleOpenSettings}>
            {isSettingsOpen ? '关闭设置' : '打开设置'}
          </button>
        )}
        <button className={styles.button} onClick={handleOpenNewTab}>
          打开新标签页
        </button>
      </div>
    </div>
  );
};
