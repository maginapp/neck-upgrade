import { useEffect } from 'react';
import styles from './NeckMode.module.scss';
import settingStyles from './Settings.module.scss';
import { getNeckModeLabel } from '@/utils/labels';
import { formatIntNumber, getRandomNumber } from '@/utils/base';
import { NeckMode as NeckModeType, NeckModeConfig } from '@/types/app';

interface NeckModeProps {
  neckConfig: NeckModeConfig;
  onModeChange: (mode: NeckModeConfig) => void;
}

const MOD_CONFIG = {
  [NeckModeType.Normal]: {
    min: 15,
    max: 60,
    duration: 0,
  },
  [NeckModeType.Training]: {
    min: 15,
    max: 60,
    duration: 5,
  },
  [NeckModeType.Intense]: {
    min: 80,
    max: 180,
    duration: 5,
  },
  [NeckModeType.Custom]: {
    min: 0,
    max: 360,
    duration: 5,
  },
};

interface CustomProps {
  nextCurDuration?: number;
  nextCurMaxRotate?: number;
}

export const NeckMode = (props: NeckModeProps) => {
  const { neckConfig, onModeChange } = props;
  const { mode, duration, cusMaxRotate, cusDuration, rotate } = neckConfig;
  const modes = Object.values(NeckModeType);

  const handleModeChange = (newMode: NeckModeType) => {
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
  };

  const handleCustomConfigChange = (params: CustomProps) => {
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
  };

  useEffect(() => {
    if (duration > 0) {
      const timer = setInterval(() => {
        handleModeChange(mode);
      }, duration * 1000);
      return () => clearInterval(timer);
    }
  }, [duration, mode, cusMaxRotate, rotate]);

  useEffect(() => {
    handleModeChange(mode);
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
