import RefreshIcon from '@/assets/images/refresh.svg?react';

import { Loading } from './Loading';
import styles from './Toolbar.module.scss';

interface ToolbarProps {
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  onRefresh?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { size = 'medium', loading, onRefresh } = props;

  return (
    <div className={styles.toolbar}>
      {loading ? (
        <Loading size={size} />
      ) : (
        <RefreshIcon className={styles.refresh} onClick={onRefresh} />
      )}
    </div>
  );
};
