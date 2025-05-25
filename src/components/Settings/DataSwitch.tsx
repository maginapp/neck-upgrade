import React from 'react';
import styles from './Settings.module.scss';
import { DataType } from '@/types/app';
import { getDataTypeLabel } from '@/utils/labels';

interface DataSwitchProps {
  currentType: DataType;
  onTypeChange: (type: DataType) => void;
}

export const DataSwitch: React.FC<DataSwitchProps> = ({ currentType, onTypeChange }) => {
  const types = Object.values(DataType);

  return (
    <div className={styles.buttonSwitch}>
      {types.map((type) => (
        <button
          key={type}
          className={`${styles.typeButton} ${currentType === type ? styles.active : ''}`}
          onClick={() => onTypeChange(type)}
        >
          {getDataTypeLabel(type)}
        </button>
      ))}
    </div>
  );
};
