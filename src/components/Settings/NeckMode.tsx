import { useCallback, useEffect, useRef } from 'react';

import { MOD_CONFIG } from '@/constants';
import { useI18n } from '@/i18n';
import { NeckMode as NeckModeType, NeckModeConfig } from '@/types/app';
import { formatIntNumber, getRandomNumber } from '@/utils/base';
import { getNeckModeLabel } from '@/utils/labels';

import styles from './NeckMode.module.scss';
import settingStyles from './Settings.module.scss';

interface NeckModeProps {
  neckConfig: NeckModeConfig;
  onModeChange: (mode: NeckModeConfig) => void;
}

interface CustomProps {
  nextCurDuration?: number;
  nextCurMaxRotate?: number;
}

export const NeckMode = (props: NeckModeProps) => {
  const { language, t } = useI18n();
  const { neckConfig, onModeChange } = props;
  const { mode, duration, cusMaxRotate, cusDuration, rotate } = neckConfig;
  const modes = Object.values(NeckModeType);
  const onModeChangeRef = useRef(onModeChange);

  useEffect(() => {
    onModeChangeRef.current = onModeChange;
  }, [onModeChange]);

  const handleCustomConfigChange = useCallback(
    (params: CustomProps) => {
      const { nextCurDuration, nextCurMaxRotate } = params;
      const config = MOD_CONFIG[NeckModeType.Custom];

      const duration = nextCurDuration ?? cusDuration ?? config.duration;
      const maxRotate = nextCurMaxRotate ?? cusMaxRotate ?? config.max;

      onModeChangeRef.current({
        mode: NeckModeType.Custom,
        rotate: getRandomNumber(config.min, maxRotate, rotate),
        duration,
        cusDuration: duration,
        cusMaxRotate: maxRotate,
      });
    },
    [cusDuration, cusMaxRotate, rotate]
  );

  const handleModeChange = useCallback(
    (newMode: NeckModeType) => {
      const config = MOD_CONFIG[newMode];

      if (newMode !== NeckModeType.Custom) {
        onModeChangeRef.current({
          mode: newMode,
          rotate: getRandomNumber(config.min, config.max, rotate),
          duration: config.duration,
          cusDuration,
          cusMaxRotate,
        });
      } else {
        handleCustomConfigChange({});
      }
    },
    [cusDuration, cusMaxRotate, rotate, handleCustomConfigChange]
  );

  const handleModeChangeRef = useRef(handleModeChange);

  useEffect(() => {
    handleModeChangeRef.current = handleModeChange;
  }, [handleModeChange]);

  useEffect(() => {
    if (duration <= 0) {
      return;
    }

    const cycleMs = duration * 1000;
    let timer: number | undefined;
    let timerGeneration = 0;
    let nextChangeAt: number | null = null;
    let pausedRemainingMs = cycleMs;

    const stopTimer = () => {
      timerGeneration += 1;
      if (timer !== undefined) {
        window.clearTimeout(timer);
        timer = undefined;
      }
      nextChangeAt = null;
    };

    const scheduleNextChange = (delayMs = cycleMs) => {
      stopTimer();
      const nextDelayMs = Math.max(0, delayMs);
      if (document.hidden) {
        pausedRemainingMs = nextDelayMs;
        return;
      }

      const generation = timerGeneration;
      nextChangeAt = Date.now() + nextDelayMs;
      timer = window.setTimeout(() => {
        if (generation !== timerGeneration) {
          return;
        }
        if (document.hidden) {
          pausedRemainingMs = 0;
          stopTimer();
          return;
        }

        handleModeChangeRef.current(mode);
        pausedRemainingMs = cycleMs;
        scheduleNextChange();
      }, nextDelayMs);
    };

    const pauseTimer = () => {
      if (nextChangeAt !== null) {
        pausedRemainingMs = Math.max(0, nextChangeAt - Date.now());
      }
      stopTimer();
    };

    const resumeTimer = () => {
      if (timer !== undefined) {
        return;
      }
      const remainingMs = pausedRemainingMs;
      pausedRemainingMs = cycleMs;
      scheduleNextChange(remainingMs);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseTimer();
      } else {
        resumeTimer();
      }
    };

    scheduleNextChange();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', pauseTimer);
    window.addEventListener('pageshow', resumeTimer);

    return () => {
      stopTimer();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', pauseTimer);
      window.removeEventListener('pageshow', resumeTimer);
    };
  }, [duration, mode]);

  useEffect(() => {
    console.log('🚀 ~ useEffect ~ mode:  ', mode);
    handleModeChange(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={settingStyles.buttonSwitch}>
        {modes.map((currentMode) => (
          <button
            key={currentMode}
            className={`${settingStyles.typeButton} ${currentMode === mode ? settingStyles.active : ''}`}
            onClick={() => handleModeChange(currentMode)}
          >
            {getNeckModeLabel(currentMode, language)}
          </button>
        ))}
      </div>

      {neckConfig.mode === NeckModeType.Custom && (
        <div className={styles.customConfig}>
          <div className={styles.configItem}>
            <label>{t('settings_change_interval_seconds')}</label>
            <input
              type="number"
              min="0"
              max="60"
              placeholder="0-60"
              value={cusDuration}
              onChange={(e) => {
                handleCustomConfigChange({
                  nextCurDuration: formatIntNumber(e.target.value, 0, 60),
                });
              }}
            />
          </div>
          <div className={styles.configItem}>
            <label>{t('settings_max_rotation_angle')}</label>
            <input
              type="number"
              min="0"
              max="360"
              placeholder="0-360"
              value={cusMaxRotate}
              onChange={(e) => {
                handleCustomConfigChange({
                  nextCurMaxRotate: formatIntNumber(e.target.value, 0, 360),
                });
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
