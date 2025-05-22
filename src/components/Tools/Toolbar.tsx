import React from 'react';
import styles from './Toolbar.module.scss';
import { Loading } from './Loading';

interface ToolbarProps {
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  onRefresh?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { size = 'medium', loading, onRefresh } = props;

  return (
    <div className={styles.toolbar}>
      {loading && <Loading size={size} />}
      {!loading && (
        <span className={styles.refresh} onClick={onRefresh}>
          🔁
        </span>
      )}
    </div>
  );
};
