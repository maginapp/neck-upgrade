import { useEffect, useState } from 'react';

import { MESSAGE_TYPES } from '@/constants/events';
import {
  DataType,
  Theme,
  NeckModeConfig,
  Settings as SettingsType,
  KnowledgeMode,
} from '@/types/app';
import { ChromeMessage, ToggleActiveSettingsMessage } from '@/types/message';

import { Appreciation } from './Appreciation';
import { DataSwitch } from './DataSwitch';
import { KnowledgeSwtich } from './KnowledgeSwtich';
import { NeckMode } from './NeckMode';
import styles from './Settings.module.scss';
import { ThemeToggle } from './ThemeToggle';

interface SettingsProps {
  settings: SettingsType;
  setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;
  currentTheme: Theme.Dark | Theme.Light;
}

export const Settings: React.FC<SettingsProps> = (props) => {
  const { setSettings, settings, currentTheme } = props;
  const [isOpen, setIsOpen] = useState(false);

  const onThemeChange = (theme: Theme) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const onNeckModeChange = (neck: NeckModeConfig) => {
    setSettings((prev) => ({ ...prev, neck }));
  };
  const onDataTypeChange = (dataType: DataType) => {
    setSettings((prev) => ({ ...prev, dataType }));
  };
  const onKnowledgeModeChange = (knowledge: KnowledgeMode) => {
    setSettings((prev) => ({ ...prev, knowledge }));
  };

  useEffect(() => {
    // todo 策略模式
    const messageListener = (message: ChromeMessage) => {
      if (message.type === MESSAGE_TYPES.TOGGLE_ACTIVE_SETTINGS) {
        const toggleMessage = message as ToggleActiveSettingsMessage;
        const nextStatus = toggleMessage.isOpen ?? !isOpen;
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
          <h3>设置</h3>
          <div className={styles.settingsGroup}>
            <h4>主题</h4>
            <ThemeToggle currentTheme={settings.theme} onThemeChange={onThemeChange} />
          </div>
          <div className={styles.settingsGroup}>
            <h4>颈椎倾斜模式</h4>
            <NeckMode neckConfig={settings.neck} onModeChange={onNeckModeChange} />
          </div>
          <div className={styles.settingsGroup}>
            <h4>内容类型</h4>
            <DataSwitch currentType={settings.dataType} onTypeChange={onDataTypeChange} />
          </div>
          <div className={styles.settingsGroup}>
            <h4>百科数据源(优先使用)</h4>
            <KnowledgeSwtich
              currentMode={settings.knowledge}
              onModeChange={onKnowledgeModeChange}
            />
          </div>
          <div className={styles.settingsGroup}>
            <h4>赞赏支持</h4>
            <p className={styles.description}>如果这个扩展对你有帮助，欢迎赞赏支持</p>
            <Appreciation currentTheme={currentTheme} />
          </div>
        </div>
      </div>
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
    </>
  );
};
