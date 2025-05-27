import wxZanShangDark from '@/assets/images/wx_zan_shang.dark.png';
import wxZanShang from '@/assets/images/wx_zan_shang.png';
import { Theme } from '@/types/app';

import styles from './Appreciation.module.scss';

interface AppreciationProps {
  currentTheme: Theme.Dark | Theme.Light;
}

export const Appreciation: React.FC<AppreciationProps> = (props) => {
  const { currentTheme } = props;

  return (
    <div className={styles.appreciation}>
      <div className={styles.qrCode}>
        <img src={currentTheme === Theme.Light ? wxZanShang : wxZanShangDark} alt="赞赏码" />
      </div>
    </div>
  );
};
