import { useI18n } from '@/i18n';
import { KnowledgeMode } from '@/types/app';
import { getKnowledgeModeLabel } from '@/utils/labels';

import styles from './Settings.module.scss';

interface KnowledgeModeProps {
  currentMode: KnowledgeMode;
  onModeChange: (type: KnowledgeMode) => void;
}

export const KnowledgeSwtich: React.FC<KnowledgeModeProps> = ({ currentMode, onModeChange }) => {
  const { language } = useI18n();
  const types = Object.values(KnowledgeMode);

  return (
    <div className={styles.buttonSwitch}>
      {types.map((type) => (
        <button
          key={type}
          className={`${styles.typeButton} ${currentMode === type ? styles.active : ''}`}
          onClick={() => onModeChange(type)}
        >
          {getKnowledgeModeLabel(type, language)}
        </button>
      ))}
    </div>
  );
};
