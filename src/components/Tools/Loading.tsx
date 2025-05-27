import styles from './Loading.module.scss';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  writingMode?: 'initial';
}

export const Loading: React.FC<LoadingProps> = (props) => {
  const { size = 'medium', className, writingMode } = props;
  return (
    <div className={`${styles.loading} ${className || ''}`}>
      <div
        className={`${styles.bounceContainer} ${styles[size]} ${styles[`writingMode__${writingMode}`]}`}
      >
        <div className={styles.bounce}></div>
        <div className={styles.bounce}></div>
        <div className={styles.bounce}></div>
      </div>
    </div>
  );
};
