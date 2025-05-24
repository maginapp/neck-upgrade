import React, { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { NeckMode } from './NeckMode';
import { DataSwitch } from './DataSwitch';
import { KnowledgeSwtich } from './KnowledgeSwtich';
import styles from './Settings.module.scss';
import {
  DataType,
  Theme,
  NeckModeConfig,
  Settings as SettingsType,
  KnowledgeMode,
} from '@/types/app';
import { MESSAGE_TYPES } from '@/constants/events';
import { Appreciation } from './Appreciation';

interface SettingsProps {
  settings: SettingsType;
  setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;
  currentTheme: Theme.Dark | Theme.Light;
}

export const Settings: React.FC<SettingsProps> = (props) => {
  const { setSettings, settings, currentTheme } = props;
  const [isOpen, setIsOpen] = useState(false);

  const onThemeChange = (theme: Theme) => {
    setSettings({ ...settings, theme });
  };

  const onNeckModeChange = (neck: NeckModeConfig) => {
    setSettings({ ...settings, neck });
  };
  const onDataTypeChange = (dataType: DataType) => {
    setSettings({ ...settings, dataType });
  };
  const onKnowledgeModeChange = (knowledgeMode: KnowledgeMode) => {
    setSettings({ ...settings, knowledge: knowledgeMode });
  };

  useEffect(() => {
    // todo 策略模式
    const messageListener = (message: any) => {
      if (message.type === MESSAGE_TYPES.TOGGLE_ACTIVE_SETTINGS) {
        const nextStatus = message.isOpen ?? !isOpen;
        setIsOpen(nextStatus);
        chrome.runtime.sendMessage({
          type: MESSAGE_TYPES.SETTINGS_OPEN_STATUS,
          isOpen: nextStatus,
        });
      }
      if (message.type === MESSAGE_TYPES.GET_SETTINGS_OPEN_STATUS) {
        chrome.runtime.sendMessage({ type: MESSAGE_TYPES.SETTINGS_OPEN_STATUS, isOpen: isOpen });
      }
    };
    chrome.runtime.onMessage.addListener(messageListener);
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, [isOpen]);

  return (
    <>
      <button
        className={styles.settingsButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Settings"
      >
        ⚙️
      </button>

      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarContent}>
          <button
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
            aria-label="Close settings"
          >
            ×
          </button>
          <h2>设置</h2>
          <div className={styles.settingsGroup}>
            <h3>主题</h3>
            <ThemeToggle currentTheme={settings.theme} onThemeChange={onThemeChange} />
          </div>
          <div className={styles.settingsGroup}>
            <h3>颈椎模式</h3>
            <NeckMode neckConfig={settings.neck} onModeChange={onNeckModeChange} />
          </div>
          <div className={styles.settingsGroup}>
            <h3>内容类型</h3>
            <DataSwitch currentType={settings.dataType} onTypeChange={onDataTypeChange} />
          </div>
          <div className={styles.settingsGroup}>
            <h3>百科数据源(优先使用)</h3>
            <KnowledgeSwtich
              currentMode={settings.knowledge}
              onModeChange={onKnowledgeModeChange}
            />
          </div>
          <div className={styles.settingsGroup}>
            <h3>赞赏支持</h3>
            <p className={styles.description}>如果这个扩展对你有帮助，欢迎赞赏支持</p>
            <Appreciation currentTheme={currentTheme} />
          </div>
        </div>
      </div>
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
    </>
  );
};
