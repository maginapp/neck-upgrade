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
      <p className={styles.description}>如果你对本项目感兴趣或反馈问题，欢迎与我们交流。</p>
      <div className={styles.feedback}>
        👉
        <a href="https://github.com/maginapp/neck-upgrade/issues" target="_blank" rel="noreferrer">
          提交 Issue
        </a>
        ｜
        <a
          href="https://github.com/maginapp/neck-upgrade/discussions"
          target="_blank"
          rel="noreferrer"
        >
          交流区
        </a>
        ｜
        <a href="https://github.com/maginapp/neck-upgrade" target="_blank" rel="noreferrer">
          项目主页
        </a>
      </div>
      <p className={styles.description}>如果这个扩展对你有帮助，欢迎赞赏支持</p>
      <div className={styles.appreciation}>
        <div className={styles.qrCode}>
          <img src={currentTheme === Theme.Light ? wxZanShang : wxZanShangDark} alt="赞赏码" />
        </div>
      </div>
      <div className={styles.sponsor}>
        <a
          className={styles.sponsorItem}
          href="https://ko-fi.com/magina"
          target="_blank"
          rel="noreferrer"
        >
          <img className={styles.koFiIcon} src={koFiIcon} alt="sponsor" />
          <span>Ko-fi</span>
        </a>
      </div>
    </>
  );
};
