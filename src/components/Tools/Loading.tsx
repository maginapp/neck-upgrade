import React from 'react';
import styles from './Loading.module.scss';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = 'medium', className }) => {
  return (
    <div className={`${styles.loading} ${className || ''}`}>
      <div className={`${styles.bounceContainer} ${styles[size]}`}>
        <div className={styles.bounce}></div>
        <div className={styles.bounce}></div>
        <div className={styles.bounce}></div>
      </div>
    </div>
  );
};
