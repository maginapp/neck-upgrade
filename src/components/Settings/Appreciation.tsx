import koFiIcon from '@/assets/images/ko_fi.webp';
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
    <>
      <div className={styles.appreciation}>
        <div className={styles.qrCode}>
          <img src={currentTheme === Theme.Light ? wxZanShang : wxZanShangDark} alt="赞赏码" />
        </div>
      </div>
      <div className={styles.sponsor}>
        <a className={styles.sponsorItem} href="https://ko-fi.com/magina">
          <img className={styles.koFiIcon} src={koFiIcon} alt="sponsor" />
          <span>Ko-fi</span>
        </a>
      </div>
    </>
  );
};
