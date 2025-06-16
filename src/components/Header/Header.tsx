import { useState, useEffect, useRef } from 'react';

import FindMoreIcon from '@/assets/images/find_more.svg?react';
import { HolidayDisplayInfo } from '@/types';
import { dateUtils, padZero } from '@/utils/base';
import { getLunarInfo, LunarInfo } from '@/utils/lunar';

import { getNextHoliday } from '../../utils/holidayApi';

import styles from './Header.module.scss';

const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

export const Header: React.FC = () => {
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

      const ymd = `${now.getFullYear()}年${padZero(now.getMonth() + 1)}月${padZero(now.getDate())}日 ${days[now.getDay()]}`;

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
  }, []);

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
          <span className={styles.lunarInfo}>{lunarInfo.lunarDate}</span>
          <FindMoreIcon
            className={styles.findMoreIcon}
            onClick={(e) => {
              e.stopPropagation();
              setShowLunarInfo(!showLunarInfo);
            }}
          />
          {/* hover */}
          {showLunarInfo && (
            <div className={styles.lunarInfoContent} ref={popupRef}>
              <div className={styles.lunarInfoContentTitle}>{currentDate}</div>
              <div className={styles.lunarInfoContentSubTitle}>
                <span>{lunarInfo.lunarDanZhiDate}</span>
              </div>
              {lunarInfo.festivals.length ? (
                <div className={styles.lunarInfoItem}>
                  <span className={styles.lunarInfoItemTitle}>节日</span>
                  <span>{lunarInfo.festivals.join(' ')}</span>
                </div>
              ) : null}
              <div className={styles.lunarInfoItem}>
                <span className={styles.lunarInfoItemTitle}>节气</span>
                <span>
                  {lunarInfo.term}
                  {lunarInfo.termDayIndex ? `第${lunarInfo.termDayIndex}天` : ''}
                </span>
              </div>
              {lunarInfo.daySuit.length ? (
                <div className={styles.lunarInfoItem}>
                  <span className={styles.lunarInfoItemTitle}>宜</span>
                  <span>{lunarInfo.daySuit.join(' ')}</span>
                </div>
              ) : null}
              {lunarInfo.dayAvoid.length ? (
                <div className={styles.lunarInfoItem}>
                  <span className={styles.lunarInfoItemTitle}>忌</span>
                  <span>{lunarInfo.dayAvoid.join(' ')}</span>
                </div>
              ) : null}
              <div className={styles.lunarInfoItem}>
                <span className={styles.lunarInfoItemTitle}>儒略日</span>
                <span>{lunarInfo.julianDay}</span>
              </div>
              <div className={styles.lunarInfoItem}>
                <span className={styles.lunarInfoItemTitle}>彭祖百忌</span>
                <span>{lunarInfo.pengZu.join('， ')}</span>
              </div>
              {lunarInfo.rainDay ? (
                <div className={styles.lunarInfoItem}>
                  <span className={styles.lunarInfoItemTitle}>梅雨</span>
                  <span>{lunarInfo.rainDay}</span>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
      {nextHoliday && (
        <div>
          距离下个休息日 - <span className={styles.holidayHighlight}>{nextHoliday.name}</span>还有
          <span className={styles.holidayHighlight}>{nextHoliday.rest}天</span>
        </div>
      )}
    </>
  );
};
