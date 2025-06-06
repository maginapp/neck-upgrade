import { join } from 'path';

export const TEMP_DIR = 'temp/chinese-poetry';
export const TARGET_DIR = 'public/data';
export const POETRY_FILE = join(TARGET_DIR, 'poetry.json');
export const LAST_UPDATE_FILE = join(TARGET_DIR, 'last-update-poetry.txt');

export const SPECIAL_AUTHORS = [
  '李白',
  '杜甫',
  '白居易',
  '王维',
  '孟浩然',
  '韩愈',
  '柳宗元',
  '杜牧',
  '李商隐',
  '岑参',
  '张若虚',
  '王昌龄',
  '高适',
  '贾岛',
  '杜秋娘',
  '骆宾王',
  '王安石',
  '苏轼',
  '辛弃疾',
  '李清照',
  '柳永',
  '欧阳修',
  '晏殊',
  '晏几道',
  '周邦彦',
  '范仲淹',
  '贺铸',
  '秦观',
  '向子諲',
  '张炎',
  '陆游',
  '苏洵',
  '苏辙',
  '曾巩',
];

export const TANG_SHI_CONFIG = {
  basePath: '全唐诗',
  matches: 'poet.tang',
};

export const SONG_CI_CONFIG = {
  basePath: '宋词',
  matches: 'ci.song',
};

export const MAX_SPECIAL_ADD_COUNT = 30;
export const MAX_SPECIAL_THROTTLE_NUMERATOR = 10;
