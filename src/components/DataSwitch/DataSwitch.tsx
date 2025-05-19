import React from 'react';
import styles from './DataSwitch.module.css';

type DataType = 'poetry' | 'history' | 'english';

interface DataSwitchProps {
  currentType: DataType;
  onTypeChange: (type: DataType) => void;
}

export const DataSwitch: React.FC<DataSwitchProps> = ({
  currentType,
  onTypeChange,
}) => {
  const types: DataType[] = ['poetry', 'history', 'english'];

  return (
    <div className={styles.dataSwitch}>
      {types.map((type) => (
        <button
          key={type}
          className={`${styles.typeButton} ${
            currentType === type ? styles.active : ''
          }`}
          onClick={() => onTypeChange(type)}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );
}; 