import { ChangeEvent, useEffect, useState } from 'react';

import { MESSAGE_TYPES } from '@/constants/events';
import { PageWobbleConfig, PageWobbleStatus } from '@/types/app';
import { ChromeMessage, SettingsOpenStatusMessage } from '@/types/message';
import {
  DEFAULT_PAGE_WOBBLE_CONFIG,
  getPageWobbleCyclePosition,
  getPageWobbleCycleSeconds,
  getPageWobbleRemainingSeconds,
  isPageWobbleSupportedUrl,
  normalizePageWobbleConfig,
  PAGE_WOBBLE_CYCLE_SLIDER_MAX,
  PAGE_WOBBLE_LIMITS,
  PAGE_WOBBLE_STORAGE_KEY,
} from '@/utils/pageWobble';

import styles from './Popup.module.scss';

const GAUGE_TICKS = [0, 30, 60, 90, 120, 150, 180];

const getActiveTab = () => {
  return new Promise<chrome.tabs.Tab | undefined>((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => resolve(tabs[0]));
  });
};

const getStoredWobbleConfig = () => {
  return new Promise<PageWobbleConfig>((resolve) => {
    chrome.storage.local.get(PAGE_WOBBLE_STORAGE_KEY, (items) => {
      const config = normalizePageWobbleConfig(items[PAGE_WOBBLE_STORAGE_KEY]);
      chrome.storage.local.set({ [PAGE_WOBBLE_STORAGE_KEY]: config });
      resolve(config);
    });
  });
};

const saveWobbleConfig = (config: PageWobbleConfig) => {
  chrome.storage.local.set({ [PAGE_WOBBLE_STORAGE_KEY]: config });
};

const sendTabMessage = <T,>(tabId: number, message: ChromeMessage) => {
  return new Promise<T | undefined>((resolve) => {
    chrome.tabs.sendMessage(tabId, message, (response: T | undefined) => {
      if (chrome.runtime.lastError) {
        resolve(undefined);
        return;
      }
      resolve(response);
    });
  });
};

const getRangeStyle = (value: number, min: number, max: number) => {
  const progress = ((value - min) / (max - min)) * 100;
  return { '--range-progress': `${progress}%` } as React.CSSProperties;
};

const formatCountdown = (seconds: number | null) => {
  if (seconds === null) {
    return '--:--';
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export const Popup: React.FC = () => {
  const [isNewTab, setIsNewTab] = useState(false);
  const [currentTabId, setCurrentTabId] = useState<number | undefined>();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPageSupported, setIsPageSupported] = useState(false);
  const [wobbleEnabled, setWobbleEnabled] = useState(false);
  const [wobbleConfig, setWobbleConfig] = useState(DEFAULT_PAGE_WOBBLE_CONFIG);
  const [wobblePending, setWobblePending] = useState(true);
  const [wobbleError, setWobbleError] = useState('');
  const [nextChangeAt, setNextChangeAt] = useState<number | null>(null);
  const [clock, setClock] = useState(Date.now());

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      const [currentTab, storedConfig] = await Promise.all([
        getActiveTab(),
        getStoredWobbleConfig(),
      ]);
      if (cancelled) {
        return;
      }

      setWobbleConfig(storedConfig);
      setCurrentTabId(currentTab?.id);

      const newTab = currentTab?.url === 'chrome://newtab/';
      setIsNewTab(newTab);
      if (newTab && currentTab?.id) {
        chrome.tabs.sendMessage(currentTab.id, {
          type: MESSAGE_TYPES.GET_SETTINGS_OPEN_STATUS,
        });
      }

      const supported = Boolean(currentTab?.id && isPageWobbleSupportedUrl(currentTab.url));
      setIsPageSupported(supported);
      if (!supported || !currentTab?.id) {
        setWobblePending(false);
        return;
      }

      const status = await sendTabMessage<PageWobbleStatus>(currentTab.id, {
        type: MESSAGE_TYPES.GET_PAGE_WOBBLE_STATUS,
      });
      if (!cancelled && status) {
        setWobbleEnabled(status.enabled);
        setNextChangeAt(status.nextChangeAt);
        if (status.enabled) {
          setWobbleConfig(normalizePageWobbleConfig(status));
        }
      }
      if (!cancelled) {
        setWobblePending(false);
      }
    };

    void initialize();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!wobbleEnabled || !nextChangeAt) {
      return;
    }

    setClock(Date.now());
    const timer = window.setInterval(() => setClock(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [nextChangeAt, wobbleEnabled]);

  useEffect(() => {
    const messageListener = (message: ChromeMessage) => {
      if (message.type === MESSAGE_TYPES.SETTINGS_OPEN_STATUS) {
        const toggleMessage = message as SettingsOpenStatusMessage;
        setIsSettingsOpen(toggleMessage.isOpen);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const updateWobbleConfig = (nextConfig: PageWobbleConfig) => {
    const normalizedConfig = normalizePageWobbleConfig(nextConfig);
    setWobbleConfig(normalizedConfig);
    saveWobbleConfig(normalizedConfig);

    if (wobbleEnabled && currentTabId) {
      void sendTabMessage<PageWobbleStatus>(currentTabId, {
        type: MESSAGE_TYPES.SET_PAGE_WOBBLE_CONFIG,
        enabled: true,
        config: normalizedConfig,
      }).then((status) => {
        if (status) {
          setNextChangeAt(status.nextChangeAt);
          setClock(Date.now());
        }
      });
    }
  };

  const handleToggleWobble = async () => {
    if (!currentTabId || !isPageSupported || wobblePending) {
      return;
    }

    setWobblePending(true);
    setWobbleError('');
    const nextEnabled = !wobbleEnabled;

    try {
      if (nextEnabled) {
        await chrome.scripting.executeScript({
          target: { tabId: currentTabId },
          files: ['assets/content.js'],
        });
      }

      const status = await sendTabMessage<PageWobbleStatus>(currentTabId, {
        type: MESSAGE_TYPES.SET_PAGE_WOBBLE_CONFIG,
        enabled: nextEnabled,
        config: wobbleConfig,
      });
      if (!status) {
        throw new Error('Unable to communicate with current page');
      }
      setWobbleEnabled(status.enabled);
      setNextChangeAt(status.nextChangeAt);
      setClock(Date.now());
    } catch {
      setWobbleEnabled(false);
      setWobbleError(chrome.i18n.getMessage('popup_wobble_error'));
    } finally {
      setWobblePending(false);
    }
  };

  const handleAngleChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateWobbleConfig({ ...wobbleConfig, angle: Number(event.target.value) });
  };

  const handleCycleChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateWobbleConfig({
      ...wobbleConfig,
      cycleSeconds: getPageWobbleCycleSeconds(Number(event.target.value)),
    });
  };

  const handleRandomAngleChange = () => {
    updateWobbleConfig({ ...wobbleConfig, randomAngle: !wobbleConfig.randomAngle });
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds} ${chrome.i18n.getMessage('popup_wobble_seconds')}`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return [
      `${minutes} ${chrome.i18n.getMessage('popup_wobble_minutes')}`,
      remainingSeconds > 0
        ? `${remainingSeconds} ${chrome.i18n.getMessage('popup_wobble_seconds')}`
        : '',
    ]
      .filter(Boolean)
      .join(' ');
  };

  const cycleSliderPosition = getPageWobbleCyclePosition(wobbleConfig.cycleSeconds);
  const remainingSeconds = getPageWobbleRemainingSeconds(
    nextChangeAt,
    wobbleConfig.cycleSeconds,
    clock
  );

  const handleOpenSettings = () => {
    if (isNewTab && currentTabId) {
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
    chrome.tabs.create({ url: `chrome://extensions/?id=${chrome.runtime.id}` });
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
      <header className={styles.hero}>
        <h1>{chrome.i18n.getMessage('popup_title')}</h1>
        <p>{chrome.i18n.getMessage('popup_description')}</p>
      </header>

      <section className={styles.wobbleCard}>
        <div className={styles.featureHeader}>
          <div>
            <h2>{chrome.i18n.getMessage('popup_wobble_title')}</h2>
            <p>{chrome.i18n.getMessage('popup_wobble_description')}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={wobbleEnabled}
            aria-label={chrome.i18n.getMessage('popup_wobble_title')}
            className={`${styles.switch} ${wobbleEnabled ? styles.switchActive : ''}`}
            disabled={!isPageSupported || wobblePending}
            onClick={handleToggleWobble}
          >
            <span className={styles.switchThumb} />
          </button>
        </div>

        {!isPageSupported && !wobblePending && (
          <p className={styles.featureNotice}>
            {chrome.i18n.getMessage('popup_wobble_unsupported')}
          </p>
        )}
        {wobbleError && <p className={styles.featureError}>{wobbleError}</p>}

        {wobbleEnabled && isPageSupported && (
          <div className={styles.wobbleControls}>
            <div className={styles.randomMode}>
              <div>
                <strong>{chrome.i18n.getMessage('popup_wobble_random_angle')}</strong>
                <p>
                  {chrome.i18n.getMessage(
                    wobbleConfig.randomAngle
                      ? 'popup_wobble_random_angle_hint'
                      : 'popup_wobble_fixed_angle_hint'
                  )}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={wobbleConfig.randomAngle}
                aria-label={chrome.i18n.getMessage('popup_wobble_random_angle')}
                className={`${styles.switch} ${wobbleConfig.randomAngle ? styles.switchActive : ''}`}
                onClick={handleRandomAngleChange}
              >
                <span className={styles.switchThumb} />
              </button>
            </div>

            <div className={styles.controlHeader}>
              <span>
                {chrome.i18n.getMessage(
                  wobbleConfig.randomAngle ? 'popup_wobble_max_angle' : 'popup_wobble_fixed_angle'
                )}
              </span>
              <strong>{wobbleConfig.angle}°</strong>
            </div>

            <div className={styles.angleGauge} aria-hidden="true">
              <svg viewBox="0 0 220 116">
                <path className={styles.gaugeArc} d="M 25 105 A 85 85 0 0 1 195 105" />
                {GAUGE_TICKS.map((tick) => (
                  <line
                    key={tick}
                    className={styles.gaugeTick}
                    x1="110"
                    y1="20"
                    x2="110"
                    y2={tick % 90 === 0 ? '31' : '27'}
                    transform={`rotate(${tick - 90} 110 105)`}
                  />
                ))}
                <g transform={`rotate(${wobbleConfig.angle - 90} 110 105)`}>
                  <line className={styles.gaugeNeedle} x1="110" y1="105" x2="110" y2="38" />
                </g>
                <circle className={styles.gaugeCenter} cx="110" cy="105" r="5" />
              </svg>
            </div>

            <input
              className={styles.range}
              type="range"
              min={PAGE_WOBBLE_LIMITS.angle.min}
              max={PAGE_WOBBLE_LIMITS.angle.max}
              value={wobbleConfig.angle}
              style={getRangeStyle(
                wobbleConfig.angle,
                PAGE_WOBBLE_LIMITS.angle.min,
                PAGE_WOBBLE_LIMITS.angle.max
              )}
              aria-label={chrome.i18n.getMessage(
                wobbleConfig.randomAngle ? 'popup_wobble_max_angle' : 'popup_wobble_fixed_angle'
              )}
              onChange={handleAngleChange}
            />
            <div className={styles.rangeScale}>
              <span>{PAGE_WOBBLE_LIMITS.angle.min}°</span>
              <span>{PAGE_WOBBLE_LIMITS.angle.max}°</span>
            </div>

            <div className={`${styles.controlHeader} ${styles.cycleHeader}`}>
              <span>{chrome.i18n.getMessage('popup_wobble_cycle')}</span>
              <strong>{formatDuration(wobbleConfig.cycleSeconds)}</strong>
            </div>
            <input
              className={styles.range}
              type="range"
              min={0}
              max={PAGE_WOBBLE_CYCLE_SLIDER_MAX}
              value={cycleSliderPosition}
              style={getRangeStyle(cycleSliderPosition, 0, PAGE_WOBBLE_CYCLE_SLIDER_MAX)}
              aria-label={chrome.i18n.getMessage('popup_wobble_cycle')}
              onChange={handleCycleChange}
            />
            <div className={styles.rangeScale}>
              <span>
                {PAGE_WOBBLE_LIMITS.cycleSeconds.min}{' '}
                {chrome.i18n.getMessage('popup_wobble_second_short')}
              </span>
              <span>60 {chrome.i18n.getMessage('popup_wobble_minute_short')}</span>
            </div>

            <div className={styles.nextChange}>
              <span className={styles.statusDot} />
              <span>{chrome.i18n.getMessage('popup_wobble_next_change')}</span>
              <strong className={styles.countdown}>{formatCountdown(remainingSeconds)}</strong>
            </div>
          </div>
        )}
      </section>

      <div className={styles.buttonGroup}>
        {isNewTab && (
          <button className={styles.button} onClick={handleOpenSettings}>
            {chrome.i18n.getMessage(
              isSettingsOpen ? 'popup_btn_close_settings' : 'popup_btn_open_settings'
            )}
          </button>
        )}
        <button className={styles.button} onClick={handleOpenNewTab}>
          {chrome.i18n.getMessage('popup_btn_open_new_tab')}
        </button>
        <button className={styles.button} onClick={handleOpenExtensionDetail}>
          {chrome.i18n.getMessage('popup_btn_open_extension_detail')}
        </button>
        <button className={styles.button} onClick={handleOpenWebsitePermission}>
          {chrome.i18n.getMessage('popup_btn_open_website_permission')}
        </button>
        <button className={styles.button} onClick={handleOpenShortcut}>
          {chrome.i18n.getMessage('popup_btn_open_shortcut')}
        </button>
        <button className={styles.button} onClick={handleOpenFeedback}>
          {chrome.i18n.getMessage('popup_btn_open_feedback')}
        </button>
      </div>
    </div>
  );
};
