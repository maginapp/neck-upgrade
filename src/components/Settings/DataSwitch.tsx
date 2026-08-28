import { DATA_TYPE_OPTIONS } from '@/constants';
import { useI18n } from '@/i18n';
import { DataType } from '@/types/app';
import { getDataTypeLabel } from '@/utils/labels';

import styles from './Settings.module.scss';

interface DataSwitchProps {
  currentType: DataType;
  onTypeChange: (type: DataType) => void;
}

export const DataSwitch: React.FC<DataSwitchProps> = ({ currentType, onTypeChange }) => {
  const { language } = useI18n();
  return (
    <div className={styles.buttonSwitch}>
      {DATA_TYPE_OPTIONS.map((type) => (
        <button
          key={type}
          className={`${styles.typeButton} ${currentType === type ? styles.active : ''}`}
          onClick={() => onTypeChange(type)}
        >
          {getDataTypeLabel(type, language)}
        </button>
      ))}
    </div>
  );
};
