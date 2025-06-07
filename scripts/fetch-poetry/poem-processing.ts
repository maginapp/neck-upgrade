import { readFileSync } from 'fs';
import { join } from 'path';

import { TEMP_DIR, MAX_SPECIAL_ADD_COUNT } from './config';
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
import { getPoemKey, fetchSongCiWithAuthor, fetchTangshiWithAuthor } from './utils';

// 处理曹操诗集
function processCacaoPoems(caocao: CacaoPoem[]): PoetryItem[] {
  return caocao.map((poem) => ({
    title: poem.title,
    author: '曹操',
    paragraphs: poem.paragraphs,
    tags: ['三国'],
  }));
}

// 处理楚辞
function processChuciPoems(chuci: ChuciPoem[]): PoetryItem[] {
  return chuci.map((poem) => ({
    title: poem.title,
    author: poem.author || '',
    paragraphs: poem.content,
    tags: ['春秋战国', '楚辞', poem.section],
  }));
}

// 处理诗经
function processShijingPoems(shijing: ShijingPoem[]): PoetryItem[] {
  return shijing.map((poem) => ({
    title: poem.title,
    author: '',
    paragraphs: poem.content,
    tags: ['周', '诗经', poem.chapter, poem.section],
  }));
}

// 处理增广贤文
function processZengGuangXianWen(zengGuangXianWen: ZengGuangXianWen): PoetryItem[] {
  const result: PoetryItem[] = [];
  zengGuangXianWen.content.forEach((item) => {
    for (let i = 0; i < item.paragraphs.length; i += 6) {
      let paragraphs = item.paragraphs.slice(i, i + 6);
      if (paragraphs[paragraphs.length - 1].endsWith('；')) {
        paragraphs = item.paragraphs.slice(i, i + 5);
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
  return result;
}

// 处理纳兰性德诗集
function processNaLanXingDe(nianLaXingDe: NaLanXingDe): PoetryItem[] {
  return nianLaXingDe.slice(0, MAX_SPECIAL_ADD_COUNT).map((item) => ({
    title: item.title,
    author: '纳兰性德',
    paragraphs: item.para,
    tags: [],
  }));
}

// 处理论语
function processLunyu(lunyu: CommonArticle[]): PoetryItem[] {
  return lunyu.map((item) => ({
    title: item.chapter,
    author: '',
    paragraphs: item.paragraphs,
    tags: ['论语'],
    align: 'left',
  }));
}

// 处理大学
function processDaxue(daxue: CommonArticle): PoetryItem[] {
  return daxue.paragraphs.map((paragraph) => ({
    title: daxue.chapter,
    author: '曾子',
    paragraphs: paragraph.split(/(?<=[；！。](」|』|))/g).filter((p) => p),
    tags: ['大学'],
    align: 'left',
  }));
}

// 处理孟子
function processMengzi(mengzi: CommonArticle[]): PoetryItem[] {
  return mengzi
    .map((item) => {
      const base: PoetryItem = {
        title: item.chapter,
        author: '',
        paragraphs: [],
        tags: ['孟子'],
        align: 'left',
      };
      const result: PoetryItem[] = [];
      let prev = 0;
      for (let i = 0; i < item.paragraphs.length; i++) {
        const paragraph = item.paragraphs[i];
        if (
          [
            '見梁惠王',
            '梁惠王曰',
            '梁襄王',
            '齊宣王問',
            '莊暴見孟子',
            '齊宣王見',
            '孟子謂',
            '孟子見',
            '見孟子',
            '問曰',
            '孟子曰：「以力假仁者霸',
            '孟子將',
            '不得已而之景丑氏宿',
            '孟子之',
            '孟子為',
            '孟子自',
            '孟子去齊。',
            '滕文公問為國',
            '使畢戰問井地',
            '今也小國師大國而',
            '淳于髡曰',
            '魯欲使',
            '齊宣王欲短喪。',
          ].find((matches) => {
            return paragraph.includes(matches);
          })
        ) {
          if (
            i + 1 < item.paragraphs.length &&
            ['他日又求見孟子', '公孫丑問曰：「何謂也？」'].find((matches) => {
              return item.paragraphs[i + 1].includes(matches);
            })
          ) {
            continue;
          }
          const newItem = Object.assign({}, base, {
            paragraphs: item.paragraphs.slice(prev, i),
          });
          newItem.paragraphs.length && result.push(newItem);
          prev = i;
        } else if (i === item.paragraphs.length - 1) {
          const newItem = Object.assign({}, base, {
            paragraphs: item.paragraphs.slice(prev, i + 1),
          });
          newItem.paragraphs.length && result.push(newItem);
        }
      }
      return result;
    })
    .flat();
}

// 处理中庸
function processZhongyong(zhongyong: CommonArticle): PoetryItem[] {
  const result: PoetryItem[] = [];
  for (let i = 0; i < zhongyong.paragraphs.length; i += 5) {
    result.push({
      title: zhongyong.chapter,
      author: '',
      paragraphs: zhongyong.paragraphs.slice(i, i + 5),
      tags: ['中庸'],
      align: 'left',
    });
  }
  return result;
}

// 处理幽梦影
function processYouMengYing(youMengYing: YouMengYing[]): PoetryItem[] {
  return youMengYing.map((item) => ({
    title: '',
    author: '张潮',
    paragraphs: [item.content, ''].concat(item.comment),
    tags: ['幽梦影'],
    align: 'left',
  }));
}

// 处理唐诗相关
async function processTangPoems(
  tangshi: TangshiPoem[],
  shuimotangshi: ShuimotangshiPoem[],
  qianJiaShi: QianJiaShi
): Promise<PoetryItem[]> {
  const tangShiMap = new Map<string, PoetryItem>();
  const result: PoetryItem[] = [];

  // 处理唐诗三百首
  await Promise.all(
    tangshi.map(async (poem) => {
      const key = await getPoemKey(poem.title, poem.author);
      const prevPoem = tangShiMap.get(key);
      if (prevPoem) {
        prevPoem.tags = prevPoem.tags || poem.tags || [];
      } else {
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

  // 处理蒙学千家诗
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
          if (!prevPoem.tags.find((tag) => tag.includes(dynasty))) {
            prevPoem.tags.unshift(dynasty);
          }
        } else {
          const newItem = {
            title: chapter,
            author: author || '佚名',
            paragraphs,
            tags: [dynasty],
          };
          result.push(newItem);
          tangShiMap.set(key, newItem);
        }
      });
    })
  );

  // 处理唐诗分组
  const tangshiGroup = fetchTangshiWithAuthor();
  await Promise.all(
    tangshiGroup.map(async (poem) => {
      const key = await getPoemKey(poem.title, poem.author);
      const prevPoem = tangShiMap.get(key);
      if (prevPoem) {
        prevPoem.tags = prevPoem.tags || poem.tags || [];
      } else {
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

  // 处理水墨唐诗
  await Promise.all(
    shuimotangshi.map(async (poem) => {
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
        tangShiMap.set(key, item);
      }
    })
  );

  return result;
}

// 处理宋词相关
async function processSongPoems(songci: SongciPoem[]): Promise<PoetryItem[]> {
  const songciMap = new Map<string, PoetryItem>();
  const result: PoetryItem[] = [];

  // 处理宋词三百首
  await Promise.all(
    songci.map(async (poem) => {
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

  // 处理宋词分组
  const songciGroup = fetchSongCiWithAuthor();
  await Promise.all(
    songciGroup.map(async (poem) => {
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

  return result;
}

export async function processPoetry(): Promise<PoetryItem[]> {
  try {
    // 读取诗词数据
    const caocao = JSON.parse(
      readFileSync(join(TEMP_DIR, '曹操诗集/caocao.json'), 'utf-8')
    ) as CacaoPoem[];
    const chuci = JSON.parse(
      readFileSync(join(TEMP_DIR, '楚辞/chuci.json'), 'utf-8')
    ) as ChuciPoem[];
    const shijing = JSON.parse(
      readFileSync(join(TEMP_DIR, '诗经/shijing.json'), 'utf-8')
    ) as ShijingPoem[];
    const tangshi = JSON.parse(
      readFileSync(join(TEMP_DIR, '全唐诗/唐诗三百首.json'), 'utf-8')
    ) as TangshiPoem[];
    const songci = JSON.parse(
      readFileSync(join(TEMP_DIR, '宋词/宋词三百首.json'), 'utf-8')
    ) as SongciPoem[];
    const shuimotangshi = JSON.parse(
      readFileSync(join(TEMP_DIR, '水墨唐诗/shuimotangshi.json'), 'utf-8')
    ) as ShuimotangshiPoem[];
    const zengGuangXianWen = JSON.parse(
      readFileSync(join(TEMP_DIR, '蒙学/zengguangxianwen.json'), 'utf-8')
    ) as ZengGuangXianWen;
    const nianLaXingDe = JSON.parse(
      readFileSync(join(TEMP_DIR, '纳兰性德/纳兰性德诗集.json'), 'utf-8')
    ) as NaLanXingDe;
    const lunyu = JSON.parse(
      readFileSync(join(TEMP_DIR, '论语/lunyu.json'), 'utf-8')
    ) as CommonArticle[];
    const daxue = JSON.parse(
      readFileSync(join(TEMP_DIR, '四书五经/daxue.json'), 'utf-8')
    ) as CommonArticle;
    const mengzi = JSON.parse(
      readFileSync(join(TEMP_DIR, '四书五经/mengzi.json'), 'utf-8')
    ) as CommonArticle[];
    const zhongyong = JSON.parse(
      readFileSync(join(TEMP_DIR, '四书五经/zhongyong.json'), 'utf-8')
    ) as CommonArticle;
    const youMengYing = JSON.parse(
      readFileSync(join(TEMP_DIR, '幽梦影/youmengying.json'), 'utf-8')
    ) as YouMengYing[];
    const qianJiaShi = JSON.parse(
      readFileSync(join(TEMP_DIR, '蒙学/qianjiashi.json'), 'utf-8')
    ) as QianJiaShi;

    // 处理数据
    const result: PoetryItem[] = [
      ...processCacaoPoems(caocao),
      ...processChuciPoems(chuci),
      ...processShijingPoems(shijing),
      ...processZengGuangXianWen(zengGuangXianWen),
      ...processNaLanXingDe(nianLaXingDe),
      ...processLunyu(lunyu),
      ...processDaxue(daxue),
      ...processMengzi(mengzi),
      ...processZhongyong(zhongyong),
      ...processYouMengYing(youMengYing),
      ...(await processTangPoems(tangshi, shuimotangshi, qianJiaShi)),
      ...(await processSongPoems(songci)),
    ];

    return result;
  } catch (error) {
    console.error('处理过程中出现错误：', error);
    return [];
  }
}
