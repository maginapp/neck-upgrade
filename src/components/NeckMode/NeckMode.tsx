import React from 'react';
import styles from './NeckMode.module.css';

type NeckModeType = 'normal' | 'training' | 'intense';

interface NeckModeProps {
  currentMode: NeckModeType;
  onModeChange: (mode: NeckModeType) => void;
}

export const NeckMode: React.FC<NeckModeProps> = ({
  currentMode,
  onModeChange,
}) => {
  const modes: NeckModeType[] = ['normal', 'training', 'intense'];

  return (
    <div className={styles.neckMode}>
      {modes.map((mode) => (
        <button
          key={mode}
          className={`${styles.modeButton} ${
            currentMode === mode ? styles.active : ''
          }`}
          onClick={() => onModeChange(mode)}
        >
          {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </button>
      ))}
    </div>
  );
}; 