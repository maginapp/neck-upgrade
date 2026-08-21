import RefreshIcon from '@/assets/images/refresh.svg?react';
import { useI18n } from '@/i18n';

import { Loading } from './Loading';
import styles from './Toolbar.module.scss';

interface ToolbarProps {
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  onRefresh?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { t } = useI18n();
  const { size = 'medium', loading, onRefresh } = props;

  return (
    <div className={styles.toolbar}>
      {loading ? (
        <Loading size={size} />
      ) : (
        <RefreshIcon
          className={styles.refresh}
          role="button"
          aria-label={t('content_refresh')}
          onClick={onRefresh}
        />
      )}
    </div>
  );
};
