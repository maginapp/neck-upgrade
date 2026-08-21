import koFiIcon from '@/assets/images/ko_fi.webp';
import wxZanShangDark from '@/assets/images/wx_zan_shang.dark.png';
import wxZanShang from '@/assets/images/wx_zan_shang.png';
import { useI18n } from '@/i18n';
import { Theme } from '@/types/app';

import styles from './Appreciation.module.scss';

interface AppreciationProps {
  currentTheme: Theme.Dark | Theme.Light;
}

export const Appreciation: React.FC<AppreciationProps> = (props) => {
  const { currentTheme } = props;
  const { t } = useI18n();

  return (
    <>
      <p className={styles.description}>{t('settings_feedback_description')}</p>
      <div className={styles.feedback}>
        👉
        <a href="https://github.com/maginapp/neck-upgrade/issues" target="_blank" rel="noreferrer">
          {t('settings_submit_issue')}
        </a>
        ｜
        <a
          href="https://github.com/maginapp/neck-upgrade/discussions"
          target="_blank"
          rel="noreferrer"
        >
          {t('settings_discussions')}
        </a>
        ｜
        <a href="https://github.com/maginapp/neck-upgrade" target="_blank" rel="noreferrer">
          {t('settings_project_home')}
        </a>
      </div>
      <p className={styles.description}>{t('settings_support_description')}</p>
      <div className={styles.appreciation}>
        <div className={styles.qrCode}>
          <img
            src={currentTheme === Theme.Light ? wxZanShang : wxZanShangDark}
            alt={t('settings_donation_qr')}
          />
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
