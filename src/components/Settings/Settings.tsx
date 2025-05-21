import React, { useState } from 'react';
import { ThemeToggle } from '../ThemeToggle';
import { NeckMode } from '../NeckMode';
import { DataSwitch } from '../DataSwitch';
import styles from './Settings.module.scss';
import { DataType, Theme, NeckModeConfig, Settings as SettingsType } from '@/types/app';

interface SettingsProps {
  settings: SettingsType;
  setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;
}

export const Settings: React.FC<SettingsProps> = ({ setSettings, settings }) => {
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
        </div>
      </div>
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
    </>
  );
};
