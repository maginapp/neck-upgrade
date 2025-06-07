import { useCallback, useEffect } from 'react';

import { MOD_CONFIG } from '@/constants';
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
  const { neckConfig, onModeChange } = props;
  const { mode, duration, cusMaxRotate, cusDuration, rotate } = neckConfig;
  const modes = Object.values(NeckModeType);

  const handleCustomConfigChange = useCallback(
    (params: CustomProps) => {
      const { nextCurDuration, nextCurMaxRotate } = params;
      const config = MOD_CONFIG[NeckModeType.Custom];

      const duration = nextCurDuration ?? cusDuration ?? config.duration;
      const maxRotate = nextCurMaxRotate ?? cusMaxRotate ?? config.max;

      onModeChange({
        mode: NeckModeType.Custom,
        rotate: getRandomNumber(config.min, maxRotate, rotate),
        duration,
        cusDuration: duration,
        cusMaxRotate: maxRotate,
      });
    },
    [cusDuration, cusMaxRotate, onModeChange, rotate]
  );

  const handleModeChange = useCallback(
    (newMode: NeckModeType) => {
      const config = MOD_CONFIG[newMode];

      if (newMode !== NeckModeType.Custom) {
        onModeChange({
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
    [cusDuration, cusMaxRotate, onModeChange, rotate, handleCustomConfigChange]
  );

  useEffect(() => {
    if (duration > 0) {
      const timer = setInterval(() => {
        handleModeChange(mode);
      }, duration * 1000);
      return () => clearInterval(timer);
    }
  }, [duration, mode, handleModeChange]);

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
            {getNeckModeLabel(currentMode)}
          </button>
        ))}
      </div>

      {neckConfig.mode === NeckModeType.Custom && (
        <div className={styles.customConfig}>
          <div className={styles.configItem}>
            <label>切换间隔（秒）</label>
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
            <label>最大旋转角度</label>
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
