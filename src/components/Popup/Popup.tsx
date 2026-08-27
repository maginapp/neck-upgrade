import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { LanguageToggle } from '@/components/Settings/LanguageToggle';
import { ThemeToggle } from '@/components/Settings/ThemeToggle';
import { MESSAGE_TYPES } from '@/constants/events';
import { useI18n } from '@/i18n';
import {
  AppLanguage,
  PageWobbleConfig,
  PageWobbleDomainRules,
  PageWobbleStatus,
  Theme,
} from '@/types/app';
import { ChromeMessage, SettingsOpenStatusMessage } from '@/types/message';
import {
  DEFAULT_PAGE_WOBBLE_CONFIG,
  DEFAULT_PAGE_WOBBLE_DOMAIN_RULES,
  getPageWobbleDomainAccess,
  getPageWobbleCyclePosition,
  getPageWobbleCycleSeconds,
  getPageWobbleRemainingSeconds,
  isPageWobbleDomainAllowed,
  isPageWobbleSupportedUrl,
  normalizePageWobbleConfig,
  normalizePageWobbleDomain,
  normalizePageWobbleDomainRules,
  PAGE_WOBBLE_CYCLE_SLIDER_MAX,
  PAGE_WOBBLE_DOMAIN_RULES_STORAGE_KEY,
  PAGE_WOBBLE_ENABLED_STORAGE_KEY,
  PAGE_WOBBLE_LIMITS,
  PAGE_WOBBLE_SCOPE_STORAGE_KEY,
  PAGE_WOBBLE_STORAGE_KEY,
  normalizePageWobbleEnabled,
  normalizePageWobbleScope,
  PageWobbleScope,
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

const getStoredWobbleEnabled = () => {
  return new Promise<boolean>((resolve) => {
    chrome.storage.local.get(PAGE_WOBBLE_ENABLED_STORAGE_KEY, (items) => {
      const enabled = normalizePageWobbleEnabled(items[PAGE_WOBBLE_ENABLED_STORAGE_KEY]);
      chrome.storage.local.set({ [PAGE_WOBBLE_ENABLED_STORAGE_KEY]: enabled });
      resolve(enabled);
    });
  });
};

const saveWobbleEnabled = (enabled: boolean) => {
  return new Promise<void>((resolve) => {
    chrome.storage.local.set({ [PAGE_WOBBLE_ENABLED_STORAGE_KEY]: enabled }, resolve);
  });
};

const getStoredWobbleScope = () => {
  return new Promise<PageWobbleScope>((resolve) => {
    chrome.storage.local.get(PAGE_WOBBLE_SCOPE_STORAGE_KEY, (items) => {
      const scope = normalizePageWobbleScope(items[PAGE_WOBBLE_SCOPE_STORAGE_KEY]);
      chrome.storage.local.set({ [PAGE_WOBBLE_SCOPE_STORAGE_KEY]: scope });
      resolve(scope);
    });
  });
};

const saveWobbleScopeState = (scope: PageWobbleScope, enabled: boolean) => {
  return new Promise<void>((resolve) => {
    chrome.storage.local.set(
      {
        [PAGE_WOBBLE_SCOPE_STORAGE_KEY]: scope,
        [PAGE_WOBBLE_ENABLED_STORAGE_KEY]: enabled,
      },
      resolve
    );
  });
};

const getStoredDomainRules = () => {
  return new Promise<PageWobbleDomainRules>((resolve) => {
    chrome.storage.local.get(PAGE_WOBBLE_DOMAIN_RULES_STORAGE_KEY, (items) => {
      const rules = normalizePageWobbleDomainRules(items[PAGE_WOBBLE_DOMAIN_RULES_STORAGE_KEY]);
      chrome.storage.local.set({ [PAGE_WOBBLE_DOMAIN_RULES_STORAGE_KEY]: rules });
      resolve(rules);
    });
  });
};

const saveDomainRules = (rules: PageWobbleDomainRules) => {
  return new Promise<void>((resolve) => {
    chrome.storage.local.set({ [PAGE_WOBBLE_DOMAIN_RULES_STORAGE_KEY]: rules }, resolve);
  });
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

interface PopupProps {
  language: AppLanguage;
  theme: Theme;
  onLanguageChange: (language: AppLanguage) => void;
  onThemeChange: (theme: Theme) => void;
}

export const Popup: React.FC<PopupProps> = ({
  language,
  theme,
  onLanguageChange,
  onThemeChange,
}) => {
  const { t } = useI18n();
  const [isNewTab, setIsNewTab] = useState(false);
  const [currentTabId, setCurrentTabId] = useState<number | undefined>();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPageSupported, setIsPageSupported] = useState(false);
  const [currentDomain, setCurrentDomain] = useState('');
  const [domainRules, setDomainRules] = useState(DEFAULT_PAGE_WOBBLE_DOMAIN_RULES);
  const [whitelistInput, setWhitelistInput] = useState('');
  const [blacklistInput, setBlacklistInput] = useState('');
  const [showDomainRules, setShowDomainRules] = useState(false);
  const [wobbleScope, setWobbleScope] = useState<PageWobbleScope>('global');
  const [wobbleEnabled, setWobbleEnabled] = useState(false);
  const [wobbleConfig, setWobbleConfig] = useState(DEFAULT_PAGE_WOBBLE_CONFIG);
  const [wobblePending, setWobblePending] = useState(true);
  const [wobbleError, setWobbleError] = useState('');
  const [nextChangeAt, setNextChangeAt] = useState<number | null>(null);
  const [clock, setClock] = useState(Date.now());

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      const [currentTab, storedConfig, storedEnabled, storedScope, storedRules] = await Promise.all(
        [
          getActiveTab(),
          getStoredWobbleConfig(),
          getStoredWobbleEnabled(),
          getStoredWobbleScope(),
          getStoredDomainRules(),
        ]
      );
      if (cancelled) {
        return;
      }

      setWobbleConfig(storedConfig);
      setWobbleScope(storedScope);
      setWobbleEnabled(storedScope === 'global' && storedEnabled);
      setDomainRules(storedRules);
      setCurrentTabId(currentTab?.id);
      const domain = normalizePageWobbleDomain(currentTab?.url);
      setCurrentDomain(domain);

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

      try {
        if (storedScope === 'global' && storedEnabled) {
          await chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            files: ['assets/content.js'],
          });
        }

        const status =
          storedScope === 'global'
            ? await sendTabMessage<PageWobbleStatus>(currentTab.id, {
                type: MESSAGE_TYPES.SET_PAGE_WOBBLE_CONFIG,
                enabled: storedEnabled,
                domainAllowed: isPageWobbleDomainAllowed(domain, storedRules),
                config: storedConfig,
              })
            : await sendTabMessage<PageWobbleStatus>(currentTab.id, {
                type: MESSAGE_TYPES.GET_PAGE_WOBBLE_STATUS,
              });
        if (!cancelled && status) {
          if (storedScope === 'current') {
            setWobbleEnabled(status.enabled);
          }
          setNextChangeAt(status.nextChangeAt);
        } else if (!cancelled && storedScope === 'global' && storedEnabled) {
          setWobbleError(t('popup_wobble_error'));
        }
      } catch {
        if (!cancelled && storedScope === 'global' && storedEnabled) {
          setWobbleError(t('popup_wobble_error'));
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
  }, [t]);

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
        enabled: wobbleEnabled,
        domainAllowed: isDomainAllowed,
        config: normalizedConfig,
      }).then((status) => {
        if (status) {
          setNextChangeAt(status.nextChangeAt);
          setClock(Date.now());
        }
      });
    }
  };

  const updateDomainRules = async (nextRules: PageWobbleDomainRules) => {
    const normalizedRules = normalizePageWobbleDomainRules(nextRules);
    setDomainRules(normalizedRules);
    await saveDomainRules(normalizedRules);

    if (wobbleEnabled && currentTabId) {
      const domainAllowed = isPageWobbleDomainAllowed(currentDomain, normalizedRules);
      const status = await sendTabMessage<PageWobbleStatus>(currentTabId, {
        type: MESSAGE_TYPES.SET_PAGE_WOBBLE_CONFIG,
        enabled: wobbleEnabled,
        domainAllowed,
        config: wobbleConfig,
      });
      if (status) {
        setNextChangeAt(status.nextChangeAt);
        setClock(Date.now());
      }
    }
  };

  const addDomainRule = async (list: keyof PageWobbleDomainRules, value: string) => {
    const domain = normalizePageWobbleDomain(value);
    if (!domain) {
      return false;
    }

    const otherList = list === 'whitelist' ? 'blacklist' : 'whitelist';
    await updateDomainRules({
      ...domainRules,
      [list]: [...domainRules[list], domain],
      [otherList]: domainRules[otherList].filter((item) => item !== domain),
    });
    return true;
  };

  const removeDomainRule = async (list: keyof PageWobbleDomainRules, domain: string) => {
    await updateDomainRules({
      ...domainRules,
      [list]: domainRules[list].filter((item) => item !== domain),
    });
  };

  const removeCurrentDomainRule = async () => {
    await updateDomainRules({
      whitelist: domainRules.whitelist.filter((item) => item !== currentDomain),
      blacklist: domainRules.blacklist.filter((item) => item !== currentDomain),
    });
  };

  const handleDomainSubmit = async (
    event: FormEvent<HTMLFormElement>,
    list: keyof PageWobbleDomainRules
  ) => {
    event.preventDefault();
    const input = list === 'whitelist' ? whitelistInput : blacklistInput;
    if (await addDomainRule(list, input)) {
      if (list === 'whitelist') {
        setWhitelistInput('');
      } else {
        setBlacklistInput('');
      }
    }
  };

  const domainAccess = getPageWobbleDomainAccess(currentDomain, domainRules);
  const isDomainAllowed = domainAccess === 'allowed';
  const isWobbleEffective = wobbleEnabled && isPageSupported && isDomainAllowed && !wobbleError;
  const hasCurrentDomainRule =
    domainRules.whitelist.includes(currentDomain) || domainRules.blacklist.includes(currentDomain);

  const handleToggleWobble = async () => {
    if (!currentTabId || !isPageSupported || !isDomainAllowed || wobblePending) {
      return;
    }

    setWobblePending(true);
    setWobbleError('');
    const nextEnabled = !wobbleEnabled;
    if (wobbleScope === 'global') {
      await saveWobbleEnabled(nextEnabled);
    }
    setWobbleEnabled(nextEnabled);
    setShowDomainRules(nextEnabled);

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
        domainAllowed: isDomainAllowed,
        config: wobbleConfig,
      });
      if (!status && nextEnabled) {
        throw new Error('Unable to communicate with current page');
      }
      setNextChangeAt(status?.nextChangeAt ?? null);
      setClock(Date.now());
    } catch {
      if (nextEnabled) {
        setWobbleError(t('popup_wobble_error'));
      }
    } finally {
      setWobblePending(false);
    }
  };

  const handleScopeChange = async (nextScope: PageWobbleScope) => {
    if (nextScope === wobbleScope) {
      return;
    }

    setWobblePending(true);
    setWobbleError('');
    // Keep the current switch state while moving between scopes. When changing
    // from global to current, storage stops the other tabs and the message
    // below immediately keeps the active tab running.
    const nextEnabled = wobbleEnabled;
    await saveWobbleScopeState(nextScope, nextEnabled);
    setWobbleScope(nextScope);
    setWobbleEnabled(nextEnabled);
    setShowDomainRules(nextEnabled);

    if (currentTabId && isPageSupported) {
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
          domainAllowed: isDomainAllowed,
          config: wobbleConfig,
        });
        setNextChangeAt(status?.nextChangeAt ?? null);
        setClock(Date.now());
      } catch {
        if (nextEnabled) {
          setWobbleError(t('popup_wobble_error'));
        }
      }
    }
    setWobblePending(false);
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
      return `${seconds} ${t('popup_wobble_seconds')}`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return [
      `${minutes} ${t('popup_wobble_minutes')}`,
      remainingSeconds > 0 ? `${remainingSeconds} ${t('popup_wobble_seconds')}` : '',
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
        <div className={`${styles.heroControl} ${styles.heroControlLeft}`}>
          <LanguageToggle language={language} onChange={onLanguageChange} compact />
        </div>
        <div className={styles.heroContent}>
          <h1>{t('extension_name')}</h1>
          <p>{t('popup_description')}</p>
        </div>
        <div className={`${styles.heroControl} ${styles.heroControlRight}`}>
          <ThemeToggle currentTheme={theme} onThemeChange={onThemeChange} compact />
        </div>
      </header>

      <section className={styles.wobbleCard}>
        <div className={styles.featureHeader}>
          <div>
            <h2>{t('popup_wobble_title')}</h2>
            <p>{t('popup_wobble_description')}</p>
            <div className={styles.scopeControl} role="group" aria-label={t('popup_wobble_scope')}>
              <button
                type="button"
                className={wobbleScope === 'current' ? styles.scopeOptionActive : ''}
                aria-pressed={wobbleScope === 'current'}
                onClick={() => void handleScopeChange('current')}
              >
                {t('popup_wobble_scope_current')}
              </button>
              <button
                type="button"
                className={wobbleScope === 'global' ? styles.scopeOptionActive : ''}
                aria-pressed={wobbleScope === 'global'}
                onClick={() => void handleScopeChange('global')}
              >
                {t('popup_wobble_scope_global')}
              </button>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={wobbleEnabled}
            aria-label={t('popup_wobble_title')}
            className={`${styles.switch} ${wobbleEnabled ? styles.switchActive : ''} ${
              !isPageSupported || !isDomainAllowed || wobbleError ? styles.switchUnavailable : ''
            }`}
            disabled={!isPageSupported || !isDomainAllowed || wobblePending}
            onClick={handleToggleWobble}
          >
            <span className={styles.switchThumb} />
          </button>
        </div>

        {!isPageSupported && !wobblePending && (
          <p className={styles.featureNotice}>{t('popup_wobble_unsupported')}</p>
        )}
        {isPageSupported && !isDomainAllowed && !wobblePending && (
          <p className={styles.featureNotice}>
            {t(
              domainAccess === 'blacklisted'
                ? 'popup_wobble_domain_blacklisted'
                : 'popup_wobble_domain_not_whitelisted'
            )}
          </p>
        )}
        {wobbleError && <p className={styles.featureError}>{wobbleError}</p>}

        {isWobbleEffective && (
          <div className={styles.wobbleControls}>
            <div className={styles.randomMode}>
              <div>
                <strong>{t('popup_wobble_random_angle')}</strong>
                <p>
                  {t(
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
                aria-label={t('popup_wobble_random_angle')}
                className={`${styles.switch} ${wobbleConfig.randomAngle ? styles.switchActive : ''}`}
                onClick={handleRandomAngleChange}
              >
                <span className={styles.switchThumb} />
              </button>
            </div>

            <div className={styles.controlHeader}>
              <span>
                {t(
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
              aria-label={t(
                wobbleConfig.randomAngle ? 'popup_wobble_max_angle' : 'popup_wobble_fixed_angle'
              )}
              onChange={handleAngleChange}
            />
            <div className={styles.rangeScale}>
              <span>{PAGE_WOBBLE_LIMITS.angle.min}°</span>
              <span>{PAGE_WOBBLE_LIMITS.angle.max}°</span>
            </div>

            <div className={`${styles.controlHeader} ${styles.cycleHeader}`}>
              <span>{t('popup_wobble_cycle')}</span>
              <strong>{formatDuration(wobbleConfig.cycleSeconds)}</strong>
            </div>
            <input
              className={styles.range}
              type="range"
              min={0}
              max={PAGE_WOBBLE_CYCLE_SLIDER_MAX}
              value={cycleSliderPosition}
              style={getRangeStyle(cycleSliderPosition, 0, PAGE_WOBBLE_CYCLE_SLIDER_MAX)}
              aria-label={t('popup_wobble_cycle')}
              onChange={handleCycleChange}
            />
            <div className={styles.rangeScale}>
              <span>
                {PAGE_WOBBLE_LIMITS.cycleSeconds.min} {t('popup_wobble_seconds')}
              </span>
              <span>60 {t('popup_wobble_minutes')}</span>
            </div>

            <div className={styles.nextChange}>
              <span className={styles.statusDot} />
              <span>{t('popup_wobble_next_change')}</span>
              <strong className={styles.countdown}>{formatCountdown(remainingSeconds)}</strong>
            </div>
          </div>
        )}

        {isPageSupported && currentDomain && (wobbleEnabled || showDomainRules) && (
          <div className={styles.domainControl}>
            <div className={styles.domainHeader}>
              <div>
                <span className={styles.domainLabel}>{t('popup_wobble_current_domain')}</span>
                <code title={currentDomain}>{currentDomain}</code>
              </div>
              <span
                className={`${styles.domainStatus} ${
                  isDomainAllowed ? styles.domainAllowed : styles.domainBlocked
                }`}
              >
                {t(isDomainAllowed ? 'popup_wobble_domain_allowed' : 'popup_wobble_domain_blocked')}
              </span>
            </div>

            <div className={styles.domainQuickActions}>
              <button
                type="button"
                aria-pressed={domainRules.whitelist.includes(currentDomain)}
                className={
                  domainRules.whitelist.includes(currentDomain) ? styles.domainActionActive : ''
                }
                onClick={() => void addDomainRule('whitelist', currentDomain)}
              >
                {t('popup_wobble_add_whitelist')}
              </button>
              <button
                type="button"
                aria-pressed={domainRules.blacklist.includes(currentDomain)}
                className={
                  domainRules.blacklist.includes(currentDomain) ? styles.domainActionDanger : ''
                }
                onClick={() => void addDomainRule('blacklist', currentDomain)}
              >
                {t('popup_wobble_add_blacklist')}
              </button>
              {hasCurrentDomainRule && (
                <button type="button" onClick={() => void removeCurrentDomainRule()}>
                  {t('popup_wobble_remove_current_rule')}
                </button>
              )}
            </div>

            <details className={styles.domainManager}>
              <summary>{t('popup_wobble_manage_domains')}</summary>
              <p className={styles.domainHint}>{t('popup_wobble_domain_rules_hint')}</p>

              {(['whitelist', 'blacklist'] as const).map((list) => {
                const input = list === 'whitelist' ? whitelistInput : blacklistInput;
                const setInput = list === 'whitelist' ? setWhitelistInput : setBlacklistInput;
                return (
                  <div className={styles.domainList} key={list}>
                    <strong>
                      {t(
                        list === 'whitelist' ? 'popup_wobble_whitelist' : 'popup_wobble_blacklist'
                      )}
                    </strong>
                    <form
                      className={styles.domainForm}
                      onSubmit={(event) => void handleDomainSubmit(event, list)}
                    >
                      <input
                        type="text"
                        value={input}
                        placeholder={t('popup_wobble_domain_placeholder')}
                        aria-label={t('popup_wobble_domain_placeholder')}
                        onChange={(event) => setInput(event.target.value)}
                      />
                      <button type="submit">{t('popup_wobble_add_domain')}</button>
                    </form>
                    <div className={styles.domainChips}>
                      {domainRules[list].length === 0 ? (
                        <span className={styles.domainEmpty}>
                          {t('popup_wobble_domain_list_empty')}
                        </span>
                      ) : (
                        domainRules[list].map((domain) => (
                          <span className={styles.domainChip} key={domain}>
                            <span title={domain}>{domain}</span>
                            <button
                              type="button"
                              aria-label={`${t('popup_wobble_remove_domain')} ${domain}`}
                              onClick={() => void removeDomainRule(list, domain)}
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </details>
          </div>
        )}
      </section>

      <div className={styles.buttonGroup}>
        {isNewTab && (
          <button className={styles.button} onClick={handleOpenSettings}>
            {t(isSettingsOpen ? 'settings_close' : 'settings_open')}
          </button>
        )}
        <button className={styles.button} onClick={handleOpenNewTab}>
          {t('popup_btn_open_new_tab')}
        </button>
        <button className={styles.button} onClick={handleOpenExtensionDetail}>
          {t('popup_btn_open_extension_detail')}
        </button>
        <button className={styles.button} onClick={handleOpenWebsitePermission}>
          {t('popup_btn_open_website_permission')}
        </button>
        <button className={styles.button} onClick={handleOpenShortcut}>
          {t('popup_btn_open_shortcut')}
        </button>
        <button className={styles.button} onClick={handleOpenFeedback}>
          {t('popup_btn_open_feedback')}
        </button>
      </div>
    </div>
  );
};
