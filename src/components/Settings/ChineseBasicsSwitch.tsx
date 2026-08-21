import { CHINESE_BASICS_CATEGORIES } from '@/constants';
import { useI18n } from '@/i18n';
import { ChineseBasicsCategory, ChineseBasicsConfig } from '@/types/app';
import { getChineseBasicsCategoryLabel } from '@/utils/labels';

import styles from './Settings.module.scss';

interface ChineseBasicsSwitchProps {
  config: ChineseBasicsConfig;
  onChange: (config: ChineseBasicsConfig) => void;
}

export const ChineseBasicsSwitch: React.FC<ChineseBasicsSwitchProps> = ({ config, onChange }) => {
  const { language } = useI18n();
  const categories = [ChineseBasicsCategory.All, ...CHINESE_BASICS_CATEGORIES];

  return (
    <div className={styles.buttonSwitch}>
      {categories.map((category) => (
        <button
          key={category}
          className={`${styles.typeButton} ${config.category === category ? styles.active : ''}`}
          onClick={() => onChange({ category })}
          aria-pressed={config.category === category}
        >
          {getChineseBasicsCategoryLabel(category, language)}
        </button>
      ))}
    </div>
  );
};
