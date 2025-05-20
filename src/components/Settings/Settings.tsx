import React, { useState } from 'react';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import { NeckModeSelector } from '../NeckMode/NeckMode';
import { DataSwitch } from '../DataSwitch/DataSwitch';
import styles from './Settings.module.css';
import { DataType, Theme, NeckMode, Settings as SettingsType } from '@/types/app';

interface SettingsProps {
  settings: SettingsType;
  setSettings: (settings: SettingsType) => void;
}

export const Settings: React.FC<SettingsProps> = ({ setSettings, settings }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onThemeChange = (theme: Theme) => {
    setSettings({ ...settings, theme });
  };

  const onNeckModeChange = (neckMode: NeckMode) => {
    setSettings({ ...settings, neckMode });
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
            <NeckModeSelector currentMode={settings.neckMode} onModeChange={onNeckModeChange} />
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
