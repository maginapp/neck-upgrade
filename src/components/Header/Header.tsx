import { useState, useEffect, useRef } from 'react';

import FindMoreIcon from '@/assets/images/find_more.svg?react';
import { useI18n } from '@/i18n';
import { HolidayDisplayInfo } from '@/types';
import { AppLanguage } from '@/types/app';
import { dateUtils, padZero } from '@/utils/base';
import { getLunarInfo, LunarInfo } from '@/utils/lunar';
import {
  formatLunarDate,
  formatLunarGanZhiDate,
  formatSolarTerm,
  translateFestival,
  translateHolidayName,
  translateLunarActivity,
  translatePengZuTaboo,
} from '@/utils/lunarI18n';

import { getNextHoliday } from '../../utils/holidayApi';

import styles from './Header.module.scss';

export const Header: React.FC = () => {
  const { language, t } = useI18n();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [nextHoliday, setNextHoliday] = useState<HolidayDisplayInfo | null>(null);
  const [lunarInfo, setLunarInfo] = useState<LunarInfo | null>(null);
  const [showLunarInfo, setShowLunarInfo] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const fetchNextHoliday = async () => {
    try {
      const holiday = await getNextHoliday();
      setNextHoliday(holiday);
    } catch (error) {
      console.error('获取下一个节假日失败:', error);
    }
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = dateUtils.getNow();
      setCurrentTime(
        `${padZero(now.getHours())}:${padZero(now.getMinutes())}:${padZero(now.getSeconds())}`
      );

      const ymd =
        language !== AppLanguage.En
          ? `${now.getFullYear()}年${padZero(now.getMonth() + 1)}月${padZero(
              now.getDate()
            )}日 ${new Intl.DateTimeFormat(language === AppLanguage.ZhTW ? 'zh-TW' : 'zh-CN', {
              weekday: 'long',
            }).format(now)}`
          : new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              weekday: 'long',
            }).format(now);

      setCurrentDate((prev) => {
        if (prev !== ymd) {
          setLunarInfo(getLunarInfo(now));
          fetchNextHoliday();
        }
        return ymd;
      });
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, [language]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        event.target instanceof Node &&
        !popupRef.current.contains(event.target)
      ) {
        setShowLunarInfo(false);
      }
    };

    document.body.addEventListener('click', handleClickOutside);

    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className={styles.timeSection}>
        <span className={styles.currentTime}>{currentTime}</span>
        <span className={styles.currentDate}>{currentDate}</span>
      </div>
      {lunarInfo && (
        <div className={styles.lunarInfoSection}>
          <span className={styles.lunarInfo}>{formatLunarDate(lunarInfo, language, t)}</span>
          <FindMoreIcon
            className={styles.findMoreIcon}
            onClick={(e) => {
              e.stopPropagation();
              setShowLunarInfo(!showLunarInfo);
            }}
          />
          {/* hover */}
          {showLunarInfo && (
            <div
              className={`${styles.lunarInfoContent} ${
                language === AppLanguage.En ? styles.lunarInfoContentEnglish : ''
              }`}
              ref={popupRef}
            >
              <div className={styles.lunarInfoContentTitle}>{currentDate}</div>
              <div className={styles.lunarInfoContentSubTitle}>
                <span>{formatLunarGanZhiDate(lunarInfo, language, t)}</span>
              </div>
              {lunarInfo.festivals.length ? (
                <div className={styles.lunarInfoItem}>
                  <span className={styles.lunarInfoItemTitle}>{t('header_festivals')}</span>
                  <span>
                    {lunarInfo.festivals
                      .map((item) => translateFestival(item, language, t))
                      .join(' ')}
                  </span>
                </div>
              ) : null}
              <div className={styles.lunarInfoItem}>
                <span className={styles.lunarInfoItemTitle}>{t('header_solar_term')}</span>
                <span>{formatSolarTerm(lunarInfo.term, lunarInfo.termDayIndex, language, t)}</span>
              </div>
              {lunarInfo.daySuit.length ? (
                <div className={styles.lunarInfoItem}>
                  <span className={styles.lunarInfoItemTitle}>{t('header_suitable')}</span>
                  <span>
                    {lunarInfo.daySuit
                      .map((item) => translateLunarActivity(item, language, t))
                      .join(' ')}
                  </span>
                </div>
              ) : null}
              {lunarInfo.dayAvoid.length ? (
                <div className={styles.lunarInfoItem}>
                  <span className={styles.lunarInfoItemTitle}>{t('header_avoid')}</span>
                  <span>
                    {lunarInfo.dayAvoid
                      .map((item) => translateLunarActivity(item, language, t))
                      .join(' ')}
                  </span>
                </div>
              ) : null}
              <div className={styles.lunarInfoItem}>
                <span className={styles.lunarInfoItemTitle}>{t('header_julian_day')}</span>
                <span>{lunarInfo.julianDay}</span>
              </div>
              <div className={styles.lunarInfoItem}>
                <span className={styles.lunarInfoItemTitle}>{t('header_pengzu')}</span>
                <span>
                  {lunarInfo.pengZu
                    .map((item) => translatePengZuTaboo(item, language, t))
                    .join(language === AppLanguage.En ? '; ' : '， ')}
                </span>
              </div>
              {lunarInfo.rainDay ? (
                <div className={styles.lunarInfoItem}>
                  <span className={styles.lunarInfoItemTitle}>{t('header_plum_rain')}</span>
                  <span>{lunarInfo.rainDay}</span>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
      {nextHoliday && (
        <div>
          {t('header_next_break')} -{' '}
          <span className={styles.holidayHighlight}>
            {translateHolidayName(nextHoliday.name, language, t)}
          </span>
          {t('header_break_in')}
          <span className={styles.holidayHighlight}>
            {nextHoliday.rest}
            {t(nextHoliday.rest === 1 ? 'header_day' : 'header_days')}
          </span>
        </div>
      )}
    </>
  );
};
