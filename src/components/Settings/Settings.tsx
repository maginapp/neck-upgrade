import { useEffect, useState } from 'react';

import { MESSAGE_TYPES } from '@/constants/events';
import { useI18n } from '@/i18n';
import {
  AppLanguage,
  DataType,
  Theme,
  NeckModeConfig,
  Settings as SettingsType,
  KnowledgeMode,
  PoetrySourceConfig,
  ChineseBasicsConfig,
} from '@/types/app';
import { ChromeMessage, ToggleActiveSettingsMessage } from '@/types/message';

import { Appreciation } from './Appreciation';
import { ChineseBasicsSwitch } from './ChineseBasicsSwitch';
import { DataSwitch } from './DataSwitch';
import { KnowledgeSwtich } from './KnowledgeSwtich';
import { LanguageToggle } from './LanguageToggle';
import { NeckMode } from './NeckMode';
import { PoetrySourceSwitch } from './PoetrySourceSwitch';
import styles from './Settings.module.scss';
import { ThemeToggle } from './ThemeToggle';

interface SettingsProps {
  settings: SettingsType;
  setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;
  currentTheme: Theme.Dark | Theme.Light;
}

export const Settings: React.FC<SettingsProps> = (props) => {
  const { setSettings, settings, currentTheme } = props;
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const onThemeChange = (theme: Theme) => {
    setSettings((prev) => ({ ...prev, theme }));
  };
  const onLanguageChange = (language: AppLanguage) => {
    setSettings((prev) => ({ ...prev, language }));
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
  const onPoetrySourceChange = (poetry: PoetrySourceConfig) => {
    setSettings((prev) => ({ ...prev, poetry }));
  };
  const onChineseBasicsChange = (chineseBasics: ChineseBasicsConfig) => {
    setSettings((prev) => ({ ...prev, chineseBasics }));
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
        onClick={() => {
          window.dispatchEvent(new Event('neck-upgrade:open-settings'));
          setIsOpen(!isOpen);
        }}
        aria-label={t('settings_open')}
      >
        ⚙️
      </button>

      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarContent}>
          <button
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
            aria-label={t('settings_close')}
          >
            ×
          </button>
          <h3>{t('settings_title')}</h3>
          <div className={`${styles.settingsGroup} ${styles.appearanceQuickSettings}`}>
            <LanguageToggle language={settings.language} onChange={onLanguageChange} />
            <ThemeToggle currentTheme={settings.theme} onThemeChange={onThemeChange} />
          </div>
          <div className={styles.settingsGroup}>
            <h4>{t('settings_neck_mode')}</h4>
            <NeckMode neckConfig={settings.neck} onModeChange={onNeckModeChange} />
          </div>
          <div className={styles.settingsGroup}>
            <h4>{t('settings_content_type')}</h4>
            <DataSwitch currentType={settings.dataType} onTypeChange={onDataTypeChange} />
          </div>
          {settings.dataType === DataType.Poetry && (
            <div className={styles.settingsGroup}>
              <h4>{t('settings_poetry_source')}</h4>
              <PoetrySourceSwitch config={settings.poetry} onChange={onPoetrySourceChange} />
            </div>
          )}
          {settings.dataType === DataType.ChineseBasics && (
            <div className={styles.settingsGroup}>
              <h4>{t('settings_chinese_basics_category')}</h4>
              <ChineseBasicsSwitch
                config={settings.chineseBasics}
                onChange={onChineseBasicsChange}
              />
            </div>
          )}
          <div className={styles.settingsGroup}>
            <h4>{t('settings_knowledge_source')}</h4>
            <KnowledgeSwtich
              currentMode={settings.knowledge}
              onModeChange={onKnowledgeModeChange}
            />
          </div>
          <div className={styles.settingsGroup}>
            <h4>{t('settings_feedback')}</h4>
            <Appreciation currentTheme={currentTheme} />
          </div>
        </div>
      </div>
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
    </>
  );
};
