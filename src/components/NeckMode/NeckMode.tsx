import React from 'react';
import styles from './NeckMode.module.scss';
import { NeckMode } from '@/types/app';
import { getNeckModeLabel } from '@/utils/labels';

interface NeckModeProps {
  currentMode: NeckMode;
  onModeChange: (mode: NeckMode) => void;
}

export const NeckModeSelector: React.FC<NeckModeProps> = ({ currentMode, onModeChange }) => {
  const modes = Object.values(NeckMode);

  return (
    <div className={styles.neckMode}>
      {modes.map((mode) => (
        <button
          key={mode}
          className={`${styles.modeButton} ${currentMode === mode ? styles.active : ''}`}
          onClick={() => onModeChange(mode)}
        >
          {getNeckModeLabel(mode)}
        </button>
      ))}
    </div>
  );
};
