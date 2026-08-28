import { useEffect, useState } from 'react';

import { MESSAGE_TYPES } from '@/constants/events';
import { useI18n } from '@/i18n';
import {
  AppLanguage,
  ContentColumnCount,
  ContentPanelConfig,
  DataType,
  Theme,
  NeckModeConfig,
  Settings as SettingsType,
  KnowledgeMode,
  PoetrySourceConfig,
  ChineseBasicsConfig,
} from '@/types/app';
import { ChromeMessage, ToggleActiveSettingsMessage } from '@/types/message';
import { getDataTypeLabel } from '@/utils/labels';

import { Appreciation } from './Appreciation';
import { ChineseBasicsSwitch } from './ChineseBasicsSwitch';
import { DataSwitch } from './DataSwitch';
import {
  createNextContentPanelConfig,
  duplicateContentPanelConfig,
  PanelDropPosition,
  reorderContentPanels,
} from './hooks';
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
  const { language, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [draggedPanelId, setDraggedPanelId] = useState<string | null>(null);
  const [panelDropTarget, setPanelDropTarget] = useState<{
    panelId: string;
    position: PanelDropPosition;
  } | null>(null);

  const onThemeChange = (theme: Theme) => {
    setSettings((prev) => ({ ...prev, theme }));
  };
  const onLanguageChange = (language: AppLanguage) => {
    setSettings((prev) => ({ ...prev, language }));
  };

  const syncLegacySettings = (
    prev: SettingsType,
    panels: ContentPanelConfig[],
    activePanelId = prev.activePanelId
  ): SettingsType => {
    const firstPanel = panels[0];
    return {
      ...prev,
      columns: panels.length as ContentColumnCount,
      activePanelId: panels.some((panel) => panel.id === activePanelId)
        ? activePanelId
        : firstPanel.id,
      panels,
      neck: firstPanel.neck,
      dataType: firstPanel.dataType,
      knowledge: firstPanel.knowledge,
      poetry: firstPanel.poetry,
      chineseBasics: firstPanel.chineseBasics,
    };
  };

  const updatePanel = (panelId: string, patch: Partial<ContentPanelConfig>) => {
    setSettings((prev) =>
      syncLegacySettings(
        prev,
        prev.panels.map((panel) => (panel.id === panelId ? { ...panel, ...patch } : panel))
      )
    );
  };

  const addPanel = () => {
    setSettings((prev) => {
      if (prev.panels.length >= 6) {
        return prev;
      }
      const newPanel = createNextContentPanelConfig(prev.panels, prev.activePanelId);
      return syncLegacySettings(prev, [...prev.panels, newPanel], newPanel.id);
    });
  };

  const removePanel = (panelId: string) => {
    setSettings((prev) => {
      if (prev.panels.length <= 1) {
        return prev;
      }
      const removedIndex = prev.panels.findIndex((panel) => panel.id === panelId);
      const panels = prev.panels.filter((panel) => panel.id !== panelId);
      const nextActivePanel = panels[Math.min(Math.max(removedIndex, 0), panels.length - 1)];
      const activePanelId =
        prev.activePanelId === panelId ? nextActivePanel.id : prev.activePanelId;
      return syncLegacySettings(prev, panels, activePanelId);
    });
  };

  const duplicatePanel = (panelId: string) => {
    setSettings((prev) => {
      if (prev.panels.length >= 6) {
        return prev;
      }
      const sourceIndex = prev.panels.findIndex((panel) => panel.id === panelId);
      if (sourceIndex < 0) {
        return prev;
      }
      const duplicatedPanel = duplicateContentPanelConfig(
        prev.panels[sourceIndex],
        prev.panels.length
      );
      const panels = [...prev.panels];
      panels.splice(sourceIndex + 1, 0, duplicatedPanel);
      return syncLegacySettings(prev, panels, duplicatedPanel.id);
    });
  };

  const resetPanelDrag = () => {
    setDraggedPanelId(null);
    setPanelDropTarget(null);
  };

  const getPanelDropPosition = (event: React.DragEvent<HTMLDivElement>): PanelDropPosition => {
    const rect = event.currentTarget.getBoundingClientRect();
    const isStartHalf =
      language === AppLanguage.Ar
        ? event.clientX >= rect.left + rect.width / 2
        : event.clientX <= rect.left + rect.width / 2;
    return isStartHalf ? 'before' : 'after';
  };

  const handlePanelDragStart = (event: React.DragEvent<HTMLDivElement>, panelId: string) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', panelId);
    setDraggedPanelId(panelId);
    setPanelDropTarget(null);
  };

  const handlePanelDragOver = (event: React.DragEvent<HTMLDivElement>, panelId: string) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setPanelDropTarget(
      panelId === draggedPanelId
        ? null
        : {
            panelId,
            position: getPanelDropPosition(event),
          }
    );
  };

  const handlePanelDrop = (event: React.DragEvent<HTMLDivElement>, panelId: string) => {
    event.preventDefault();
    const sourcePanelId = event.dataTransfer.getData('text/plain') || draggedPanelId;

    if (sourcePanelId && sourcePanelId !== panelId) {
      const position = getPanelDropPosition(event);
      setSettings((prev) => {
        const panels = reorderContentPanels(prev.panels, sourcePanelId, panelId, position);
        return panels === prev.panels ? prev : syncLegacySettings(prev, panels);
      });
    }

    resetPanelDrag();
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
          <div className={styles.panelTabs} role="tablist" aria-label={t('settings_panel_tabs')}>
            {settings.panels.map((panel, index) => (
              <div
                key={panel.id}
                className={`${styles.panelTab} ${
                  settings.activePanelId === panel.id ? styles.panelTabActive : ''
                } ${draggedPanelId === panel.id ? styles.panelTabDragging : ''} ${
                  panelDropTarget?.panelId === panel.id
                    ? panelDropTarget.position === 'before'
                      ? styles.panelTabDropBefore
                      : styles.panelTabDropAfter
                    : ''
                }`}
                draggable={settings.panels.length > 1}
                onDragStart={(event) => handlePanelDragStart(event, panel.id)}
                onDragOver={(event) => handlePanelDragOver(event, panel.id)}
                onDrop={(event) => handlePanelDrop(event, panel.id)}
                onDragEnd={resetPanelDrag}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={settings.activePanelId === panel.id}
                  onClick={() => setSettings((prev) => ({ ...prev, activePanelId: panel.id }))}
                >
                  {t('settings_panel')} {t(`settings_panel_number_${index + 1}`)} -{' '}
                  {getDataTypeLabel(panel.dataType, language)}
                </button>
                {settings.panels.length < 6 && (
                  <button
                    type="button"
                    className={styles.duplicatePanelButton}
                    aria-label={`${t('settings_duplicate_panel')} ${t(
                      `settings_panel_number_${index + 1}`
                    )}`}
                    title={t('settings_duplicate_panel')}
                    draggable={false}
                    onDragStart={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    onClick={() => duplicatePanel(panel.id)}
                  >
                    ⧉
                  </button>
                )}
                {settings.panels.length > 1 && (
                  <button
                    type="button"
                    className={styles.removePanelButton}
                    aria-label={`${t('settings_remove_panel')} ${t(
                      `settings_panel_number_${index + 1}`
                    )}`}
                    draggable={false}
                    onDragStart={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    onClick={() => removePanel(panel.id)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {settings.panels.length < 6 && (
              <button
                type="button"
                className={styles.addPanelButton}
                aria-label={t('settings_add_panel')}
                onClick={addPanel}
              >
                +
              </button>
            )}
          </div>
          {settings.panels.map((panel) => (
            <div
              key={panel.id}
              role="tabpanel"
              className={`${styles.panelSettings} ${
                settings.activePanelId === panel.id ? styles.panelSettingsActive : ''
              }`}
              aria-hidden={settings.activePanelId !== panel.id}
            >
              <div className={styles.settingsGroup}>
                <h4>{t('settings_neck_mode')}</h4>
                <NeckMode
                  neckConfig={panel.neck}
                  onModeChange={(neck: NeckModeConfig) => updatePanel(panel.id, { neck })}
                />
              </div>
              <div className={styles.settingsGroup}>
                <h4>{t('settings_content_type')}</h4>
                <DataSwitch
                  currentType={panel.dataType}
                  onTypeChange={(dataType: DataType) => updatePanel(panel.id, { dataType })}
                />
              </div>
              {panel.dataType === DataType.Poetry && (
                <div className={styles.settingsGroup}>
                  <h4>{t('settings_poetry_source')}</h4>
                  <PoetrySourceSwitch
                    config={panel.poetry}
                    onChange={(poetry: PoetrySourceConfig) => updatePanel(panel.id, { poetry })}
                  />
                </div>
              )}
              {panel.dataType === DataType.ChineseBasics && (
                <div className={styles.settingsGroup}>
                  <h4>{t('settings_chinese_basics_category')}</h4>
                  <ChineseBasicsSwitch
                    config={panel.chineseBasics}
                    onChange={(chineseBasics: ChineseBasicsConfig) =>
                      updatePanel(panel.id, { chineseBasics })
                    }
                  />
                </div>
              )}
              {panel.dataType === DataType.History && (
                <div className={styles.settingsGroup}>
                  <h4>{t('settings_knowledge_source')}</h4>
                  <KnowledgeSwtich
                    currentMode={panel.knowledge}
                    onModeChange={(knowledge: KnowledgeMode) =>
                      updatePanel(panel.id, { knowledge })
                    }
                  />
                </div>
              )}
            </div>
          ))}
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
