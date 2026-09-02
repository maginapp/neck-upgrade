import {
  getPoetrySourceOptions,
  POETRY_SOURCE_GROUPS,
  PoetrySource,
  PoetrySourceCategory,
} from '@/constants/poetry';
import { useI18n } from '@/i18n';
import { PoetrySourceConfig } from '@/types/app';
import { getPoetryCategoryLabel, getPoetrySourceLabel } from '@/utils/labels';

import styles from './Settings.module.scss';

interface PoetrySourceSwitchProps {
  config: PoetrySourceConfig;
  onChange: (config: PoetrySourceConfig) => void;
}

export const PoetrySourceSwitch: React.FC<PoetrySourceSwitchProps> = ({ config, onChange }) => {
  const { language, t } = useI18n();
  const sourceOptions = getPoetrySourceOptions(config.category);

  const handleCategoryChange = (category: PoetrySourceCategory) => {
    onChange({ category, sources: [] });
  };

  const handleSourceChange = (source: PoetrySource) => {
    if (config.sources.length === 0) {
      onChange({ ...config, sources: [source] });
      return;
    }

    const selected = config.sources.includes(source)
      ? config.sources.filter((item) => item !== source)
      : [...config.sources, source];

    // 至少保留一个有效来源；切换到全部来源应使用明确的“全部”按钮。
    if (selected.length > 0) {
      onChange({ ...config, sources: selected });
    }
  };

  return (
    <div className={styles.poetrySourceConfig}>
      <div className={styles.buttonSwitch}>
        <button
          className={`${styles.typeButton} ${config.category === PoetrySourceCategory.All ? styles.active : ''}`}
          onClick={() => handleCategoryChange(PoetrySourceCategory.All)}
          aria-pressed={config.category === PoetrySourceCategory.All}
        >
          {getPoetryCategoryLabel(PoetrySourceCategory.All, language)}
        </button>
        {POETRY_SOURCE_GROUPS.map((group) => (
          <button
            key={group.category}
            className={`${styles.typeButton} ${config.category === group.category ? styles.active : ''}`}
            onClick={() => handleCategoryChange(group.category)}
            aria-pressed={config.category === group.category}
          >
            {getPoetryCategoryLabel(group.category, language)}
          </button>
        ))}
      </div>

      {sourceOptions.length > 0 && (
        <div className={styles.poetrySourceDetail}>
          <div className={styles.settingHint}>{t('settings_specific_sources')}</div>
          <div className={styles.buttonSwitch}>
            <button
              className={`${styles.typeButton} ${config.sources.length === 0 ? styles.active : ''}`}
              onClick={() => onChange({ ...config, sources: [] })}
              aria-pressed={config.sources.length === 0}
            >
              {getPoetryCategoryLabel(PoetrySourceCategory.All, language)}
            </button>
            {sourceOptions.map((source) => (
              <button
                key={source.value}
                className={`${styles.typeButton} ${config.sources.includes(source.value) ? styles.active : ''}`}
                onClick={() => handleSourceChange(source.value)}
                aria-pressed={config.sources.includes(source.value)}
              >
                {getPoetrySourceLabel(source.value, language)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
