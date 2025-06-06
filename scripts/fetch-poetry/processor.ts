import { execSync } from 'child_process';
import crypto from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { groupBy } from 'lodash-es';

import {
  TEMP_DIR,
  TARGET_DIR,
  POETRY_FILE,
  LAST_UPDATE_FILE,
  MAX_SPECIAL_ADD_COUNT,
} from './config';
import {
  CacaoPoem,
  ChuciPoem,
  CommonArticle,
  NaLanXingDe,
  PoetryItem,
  QianJiaShi,
  ShijingPoem,
  ShuimotangshiPoem,
  SongciPoem,
  TangshiPoem,
  YouMengYing,
  ZengGuangXianWen,
} from './types';
import {
  cleanup,
  getRemoteLastCommit,
  checkNeedUpdateGit,
  checkNeedUpdate,
  ensureTargetDir,
  getPoemKey,
  checkNeedUpdatePoem,
  fetchSongCiWithAuthor,
  fetchTangshiWithAuthor,
} from './utils';

export async function processPoetry() {
  try {
    // 确保目标目录存在
    ensureTargetDir(TARGET_DIR);

    console.log('校验git...');
    // 检查是否需要更新
    if (!checkNeedUpdate()) {
      console.log('本地数据已是最新，无需更新');
      // process.exit(0);
    } else if (checkNeedUpdateGit()) {
      console.log('检测到新版本，开始更新数据...');
      // 清理之前的临时文件
      cleanup();
      // 克隆仓库
      console.log('正在下载诗词数据...');
      execSync(`git clone https://github.com/chinese-poetry/chinese-poetry.git ${TEMP_DIR}`);
      // execSync(`git clone git@maginapp:chinese-poetry/chinese-poetry.git ${TEMP_DIR}`);

      // 保存最后更新时间
      const lastCommit = getRemoteLastCommit();
      writeFileSync(LAST_UPDATE_FILE, lastCommit);
    }

    console.log('处理通用诗词...');
    // 读取诗词数据
    const caocao = JSON.parse(readFileSync(join(TEMP_DIR, '曹操诗集/caocao.json'), 'utf-8'));
    const chuci = JSON.parse(readFileSync(join(TEMP_DIR, '楚辞/chuci.json'), 'utf-8'));
    const shijing = JSON.parse(readFileSync(join(TEMP_DIR, '诗经/shijing.json'), 'utf-8'));
    const tangshi = JSON.parse(readFileSync(join(TEMP_DIR, '全唐诗/唐诗三百首.json'), 'utf-8'));
    const songci = JSON.parse(readFileSync(join(TEMP_DIR, '宋词/宋词三百首.json'), 'utf-8'));
    const shuimotangshi = JSON.parse(
      readFileSync(join(TEMP_DIR, '水墨唐诗/shuimotangshi.json'), 'utf-8')
    );

    // 处理数据
    const result: PoetryItem[] = [];

    // 处理曹操诗集
    caocao.forEach((poem: CacaoPoem) => {
      result.push({
        title: poem.title,
        author: '曹操',
        paragraphs: poem.paragraphs,
        tags: ['三国'],
      });
    });

    // 处理楚辞
    chuci.forEach((poem: ChuciPoem) => {
      result.push({
        title: poem.title,
        author: poem.author || '',
        paragraphs: poem.content,
        tags: ['春秋战国', '楚辞', poem.section],
      });
    });

    // 处理诗经
    shijing.forEach((poem: ShijingPoem) => {
      result.push({
        title: poem.title,
        author: '',
        paragraphs: poem.content,
        tags: ['周', '诗经', poem.chapter, poem.section],
      });
    });

    //  增广贤文 千家詩 纳兰性德前20  四书五经 / 论语 幽梦影
    const zengGuangXianWen = JSON.parse(
      readFileSync(join(TEMP_DIR, '蒙学/zengguangxianwen.json'), 'utf-8')
    ) as ZengGuangXianWen;
    zengGuangXianWen.content.forEach((item) => {
      for (let i = 0; i < item.paragraphs.length; i += 6) {
        let paragraphs = item.paragraphs.slice(0, 6);
        if (paragraphs[paragraphs.length - 1].endsWith('；')) {
          paragraphs = item.paragraphs.slice(0, 5);
          i--;
        }
        result.push({
          title: `增广贤文 · ${item.chapter}`,
          author: zengGuangXianWen.author || '佚名',
          paragraphs,
          tags: [],
        });
      }
    });

    const nianLaXingDe = JSON.parse(
      readFileSync(join(TEMP_DIR, '纳兰性德/纳兰性德诗集.json'), 'utf-8')
    ) as NaLanXingDe;
    nianLaXingDe.slice(0, MAX_SPECIAL_ADD_COUNT).forEach((item) => {
      result.push({
        title: item.title,
        author: '纳兰性德',
        paragraphs: item.para,
        tags: [],
      });
    });

    // 幽梦影
    const lunyu = JSON.parse(
      readFileSync(join(TEMP_DIR, '论语/lunyu.json'), 'utf-8')
    ) as CommonArticle[];

    lunyu.forEach((item) => {
      result.push({
        title: item.chapter,
        author: '',
        paragraphs: item.paragraphs,
        tags: ['论语'],
      });
    });

    const daxue = JSON.parse(
      readFileSync(join(TEMP_DIR, '四书五经/daxue.json'), 'utf-8')
    ) as CommonArticle;

    result.push({
      title: daxue.chapter,
      author: '曾子',
      paragraphs: daxue.paragraphs,
      tags: ['大学'],
    });

    const mengzi = JSON.parse(
      readFileSync(join(TEMP_DIR, '四书五经/mengzi.json'), 'utf-8')
    ) as CommonArticle[];

    mengzi.forEach((item) => {
      result.push({
        title: item.chapter,
        author: '',
        paragraphs: item.paragraphs,
        tags: ['孟子'],
      });
    });

    const zhongyong = JSON.parse(
      readFileSync(join(TEMP_DIR, '四书五经/zhongyong.json'), 'utf-8')
    ) as CommonArticle;
    result.push({
      title: zhongyong.chapter,
      author: '',
      paragraphs: zhongyong.paragraphs,
      tags: ['中庸'],
    });

    const youMengYing = JSON.parse(
      readFileSync(join(TEMP_DIR, '幽梦影/youmengying.json'), 'utf-8')
    ) as YouMengYing[];

    youMengYing.forEach((item) => {
      result.push({
        title: '',
        author: '张潮',
        paragraphs: [item.content, ''].concat(item.comment),
        tags: ['幽梦影'],
      });
    });

    const tangShiMap = new Map<string, PoetryItem>();
    // 处理唐诗三百首，并合并水墨唐诗数据
    await Promise.all(
      tangshi.map(async (poem: TangshiPoem) => {
        const key = await getPoemKey(poem.title, poem.author);
        const prevPoem = tangShiMap.get(key);
        if (prevPoem) {
          prevPoem.tags = prevPoem.tags || poem.tags || [];
        } else {
          // 没有对应的水墨唐诗，直接添加原数据
          const item = {
            title: poem.title,
            author: poem.author || '佚名',
            paragraphs: poem.paragraphs,
            tags: poem.tags || [],
          };
          tangShiMap.set(key, item);
          result.push(item);
        }
      })
    );

    // 蒙学千家诗
    const qianJiaShi = JSON.parse(
      readFileSync(join(TEMP_DIR, '蒙学/qianjiashi.json'), 'utf-8')
    ) as QianJiaShi;
    await Promise.all(
      qianJiaShi.content.map((groupInfo) => {
        groupInfo.content.forEach(async (item) => {
          const { chapter, author: authorDynasty, paragraphs } = item;
          const dynasty = authorDynasty.split('）')[0].slice(1);
          const author = authorDynasty.split('）')[1];
          const key = await getPoemKey(chapter, author);
          const prevPoem = tangShiMap.get(key);
          if (prevPoem) {
            prevPoem.tags = prevPoem.tags || [];
            if (!prevPoem.tags.find((item) => item.includes(dynasty))) {
              // 唐宋元明 未使用繁体
              prevPoem.tags.unshift(dynasty);
            }
          } else {
            const item = {
              title: chapter,
              author: author || '佚名',
              paragraphs,
              tags: [dynasty],
            };
            result.push(item);
            tangShiMap.set(key, item);
          }
        });
      })
    );

    const tangshiGroup = fetchTangshiWithAuthor();
    // 处理唐诗
    await Promise.all(
      tangshiGroup.map(async (poem: TangshiPoem) => {
        const key = await getPoemKey(poem.title, poem.author);
        const prevPoem = tangShiMap.get(key);
        if (prevPoem) {
          prevPoem.tags = prevPoem.tags || poem.tags || [];
        } else {
          // 没有对应的水墨唐诗，直接添加原数据
          const item = {
            title: poem.title,
            author: poem.author || '佚名',
            paragraphs: poem.paragraphs,
            tags: poem.tags || [],
          };
          tangShiMap.set(key, item);
          result.push(item);
        }
      })
    );

    // 创建水墨唐诗的查找映射
    await Promise.all(
      shuimotangshi.map(async (poem: ShuimotangshiPoem) => {
        const key = await getPoemKey(poem.title, poem.author);
        const prevPoem = tangShiMap.get(key);
        if (prevPoem) {
          prevPoem.tags = prevPoem.tags || [];
          prevPoem.tags.unshift('水墨唐诗');
        } else {
          const item = {
            title: poem.title,
            author: poem.author || '佚名',
            paragraphs: poem.paragraphs,
            tags: ['水墨唐诗'],
            prologue: poem.prologue,
          };
          result.push(item);
          tangShiMap.set(key, poem);
        }
      })
    );

    const songciGroup = fetchSongCiWithAuthor();
    // 处理宋词三百首
    const songciMap = new Map<string, PoetryItem>();
    await Promise.all(
      songci.map(async (poem: SongciPoem) => {
        const item = {
          title: poem.rhythmic,
          author: poem.author || '佚名',
          paragraphs: poem.paragraphs,
          tags: poem.tags || [],
        };
        const key = await getPoemKey(item.title, item.author);
        songciMap.set(key, item);
        result.push(item);
      })
    );

    // 处理宋词
    await Promise.all(
      songciGroup.map(async (poem: SongciPoem) => {
        const item = {
          title: poem.rhythmic,
          author: poem.author || '佚名',
          paragraphs: poem.paragraphs,
          tags: poem.tags || [],
        };

        const key = await getPoemKey(item.title, item.author);
        const prevPoem = songciMap.get(key);
        if (prevPoem) {
          prevPoem.tags = prevPoem.tags || item.tags || [];
        } else {
          songciMap.set(key, item);
          result.push(item);
        }
      })
    );

    console.log(
      groupBy(result, 'author')
        ['白居易'].map((item) => item.title)
        .sort()
    );
    // 保存处理后的数据
    console.log('生成诗词hash...');
    const nameStr = result.map((item) => item.title).join('');
    const nameHash = crypto.createHash('md5').update(nameStr).digest('hex');

    if (!checkNeedUpdatePoem(nameHash)) {
      console.log('本地诗词数据已是最新，无需更新', result.length);
      return;
    }

    // 保存处理后的数据
    console.log('正在保存处理后的数据...', result.length, nameHash, nameStr.length);
    const first = readFileSync(LAST_UPDATE_FILE, 'utf8').split('\n');
    writeFileSync(LAST_UPDATE_FILE, first + '\n' + nameHash, 'utf8');
    writeFileSync(POETRY_FILE, JSON.stringify(result, null, 2));

    console.log('数据处理完成！');
  } catch (error) {
    console.error('处理过程中出现错误：', error);
  }
}
