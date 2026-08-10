import { readFileSync } from 'fs';
import { join } from 'path';

import { TEMP_DIR, MAX_SPECIAL_ADD_COUNT } from './config';
import {
  CacaoPoem,
  ChuciPoem,
  CommonArticle,
  NaLanXingDe,
  PoetryItem,
  PoetrySource,
  PoetrySourceCategory,
  QianJiaShi,
  QianZiWen,
  ShijingPoem,
  ShuimotangshiPoem,
  SongciPoem,
  TangshiPoem,
  YouMengYing,
  ZengGuangXianWen,
} from './types';
import { getPoemKey, fetchSongCiWithAuthor, fetchTangshiWithAuthor } from './utils';

const mergePoetryMetadata = (item: PoetryItem, source: PoetrySource, tags: string[] = []) => {
  item.sources = [...new Set([...item.sources, source])];
  item.tags = [...new Set([...(item.tags || []), ...tags])];
};

// 处理曹操诗集
function processCacaoPoems(caocao: CacaoPoem[]): PoetryItem[] {
  return caocao.map((poem) => ({
    title: poem.title,
    author: '曹操',
    paragraphs: poem.paragraphs,
    category: PoetrySourceCategory.Poem,
    sources: [PoetrySource.Caocao],
    tags: ['三国'],
  }));
}

// 处理楚辞
function processChuciPoems(chuci: ChuciPoem[]): PoetryItem[] {
  return chuci.map((poem) => ({
    title: poem.title,
    author: poem.author || '',
    paragraphs: poem.content,
    category: PoetrySourceCategory.Poem,
    sources: [PoetrySource.Chuci],
    tags: ['春秋战国', '楚辞', poem.section],
  }));
}

// 处理诗经
function processShijingPoems(shijing: ShijingPoem[]): PoetryItem[] {
  return shijing.map((poem) => ({
    title: poem.title,
    author: '',
    paragraphs: poem.content,
    category: PoetrySourceCategory.Poem,
    sources: [PoetrySource.Shijing],
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
        category: PoetrySourceCategory.Primer,
        sources: [PoetrySource.Zengguang],
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
    category: PoetrySourceCategory.Ci,
    sources: [PoetrySource.Nalan],
    tags: [],
  }));
}

// 处理论语
function processLunyu(lunyu: CommonArticle[]): PoetryItem[] {
  return lunyu.map((item) => ({
    title: item.chapter,
    author: '',
    paragraphs: item.paragraphs,
    category: PoetrySourceCategory.Classic,
    sources: [PoetrySource.Lunyu],
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
    category: PoetrySourceCategory.Classic,
    sources: [PoetrySource.Daxue],
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
        category: PoetrySourceCategory.Classic,
        sources: [PoetrySource.Mengzi],
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
      category: PoetrySourceCategory.Classic,
      sources: [PoetrySource.Zhongyong],
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
    category: PoetrySourceCategory.Essay,
    sources: [PoetrySource.Youmengying],
    tags: ['幽梦影'],
    align: 'left',
  }));
}

interface QianZiWenSemanticSection {
  chapter: string;
  title: string;
  /** 当前小节在原始 paragraphs 中的结束位置，不包含该位置。 */
  end: number;
}

// 保留相邻双句的韵律单元，再按完整语义合并为适合卡片学习的小节。
export const QIAN_ZI_WEN_SEMANTIC_SECTIONS: QianZiWenSemanticSection[] = [
  { chapter: '天地、人文与王道', title: '天地宇宙', end: 10 },
  { chapter: '天地、人文与王道', title: '物产与生灵', end: 18 },
  { chapter: '天地、人文与王道', title: '人文肇始', end: 22 },
  { chapter: '天地、人文与王道', title: '圣王与王道', end: 32 },
  { chapter: '天地、人文与王道', title: '德化万方', end: 36 },
  { chapter: '修身、家庭与处世', title: '身体与五常', end: 42 },
  { chapter: '修身、家庭与处世', title: '改过与谦信', end: 50 },
  { chapter: '修身、家庭与处世', title: '修德与惜时', end: 60 },
  { chapter: '修身、家庭与处世', title: '孝忠与勤谨', end: 66 },
  { chapter: '修身、家庭与处世', title: '君子仪范', end: 76 },
  { chapter: '修身、家庭与处世', title: '学仕与礼政', end: 82 },
  { chapter: '修身、家庭与处世', title: '家庭伦理', end: 90 },
  { chapter: '修身、家庭与处世', title: '交友与仁义', end: 96 },
  { chapter: '修身、家庭与处世', title: '守真与养性', end: 102 },
  { chapter: '都邑、制度、历史与山河', title: '两京形胜', end: 106 },
  { chapter: '都邑、制度、历史与山河', title: '宫殿与礼乐', end: 118 },
  { chapter: '都邑、制度、历史与山河', title: '典籍与群英', end: 122 },
  { chapter: '都邑、制度、历史与山河', title: '将相与封爵', end: 132 },
  { chapter: '都邑、制度、历史与山河', title: '贤臣辅政', end: 142 },
  { chapter: '都邑、制度、历史与山河', title: '春秋战国', end: 152 },
  { chapter: '都邑、制度、历史与山河', title: '九州山河', end: 162 },
  { chapter: '农事、退隐与日常生活', title: '农政与稼穑', end: 168 },
  { chapter: '农事、退隐与日常生活', title: '中庸与察人', end: 176 },
  { chapter: '农事、退隐与日常生活', title: '省身与知退', end: 188 },
  { chapter: '农事、退隐与日常生活', title: '田园景物', end: 196 },
  { chapter: '农事、退隐与日常生活', title: '读书与谨慎', end: 200 },
  { chapter: '农事、退隐与日常生活', title: '饮食与亲族', end: 206 },
  { chapter: '农事、退隐与日常生活', title: '女工与居室', end: 212 },
  { chapter: '农事、退隐与日常生活', title: '宴饮与祭祀', end: 220 },
  { chapter: '农事、退隐与日常生活', title: '书信与起居', end: 228 },
  { chapter: '农事、退隐与日常生活', title: '技艺与人物', end: 236 },
  { chapter: '农事、退隐与日常生活', title: '岁时与祈福', end: 242 },
  { chapter: '农事、退隐与日常生活', title: '仪态与自省', end: 248 },
  { chapter: '篇末收束', title: '文末语助', end: 250 },
];

export function processQianZiWen(qianZiWen: QianZiWen): PoetryItem[] {
  if (qianZiWen.paragraphs.length !== qianZiWen.spells.length) {
    throw new Error('千字文正文与拼音数量不一致');
  }

  const expectedLength = QIAN_ZI_WEN_SEMANTIC_SECTIONS.at(-1)?.end;
  if (qianZiWen.paragraphs.length !== expectedLength) {
    throw new Error(
      `千字文应包含 ${expectedLength} 个四字句，实际为 ${qianZiWen.paragraphs.length} 个`
    );
  }

  let start = 0;
  return QIAN_ZI_WEN_SEMANTIC_SECTIONS.map((section) => {
    if (section.end <= start || section.end % 2 !== 0) {
      throw new Error(`千字文语义小节“${section.title}”的边界配置无效`);
    }

    const item: PoetryItem = {
      title: `${qianZiWen.title} · ${section.title}`,
      author: qianZiWen.author || '周兴嗣',
      paragraphs: qianZiWen.paragraphs.slice(start, section.end),
      spells: qianZiWen.spells.slice(start, section.end),
      category: PoetrySourceCategory.Primer,
      sources: [PoetrySource.Qianziwen],
      tags: [qianZiWen.tags, qianZiWen.title, section.chapter, section.title].filter((tag) => tag),
    };

    start = section.end;
    return item;
  });
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
        mergePoetryMetadata(prevPoem, PoetrySource.Tang300, poem.tags);
      } else {
        const item: PoetryItem = {
          title: poem.title,
          author: poem.author || '佚名',
          paragraphs: poem.paragraphs,
          category: PoetrySourceCategory.Poem,
          sources: [PoetrySource.Tang300],
          tags: poem.tags || [],
        };
        tangShiMap.set(key, item);
        result.push(item);
      }
    })
  );

  // 处理蒙学千家诗
  for (const groupInfo of qianJiaShi.content) {
    for (const item of groupInfo.content) {
      const { chapter, author: authorDynasty, paragraphs } = item;
      const dynasty = authorDynasty.split('）')[0].slice(1);
      const author = authorDynasty.split('）')[1] || '佚名';
      const key = await getPoemKey(chapter, author);
      const prevPoem = tangShiMap.get(key);
      if (prevPoem) {
        mergePoetryMetadata(prevPoem, PoetrySource.Qianjiashi, dynasty ? [dynasty] : []);
      } else {
        const newItem: PoetryItem = {
          title: chapter,
          author,
          paragraphs,
          category: PoetrySourceCategory.Poem,
          sources: [PoetrySource.Qianjiashi],
          tags: dynasty ? [dynasty] : [],
        };
        result.push(newItem);
        tangShiMap.set(key, newItem);
      }
    }
  }

  // 处理唐诗分组
  const tangshiGroup = fetchTangshiWithAuthor();
  await Promise.all(
    tangshiGroup.map(async (poem) => {
      const key = await getPoemKey(poem.title, poem.author);
      const prevPoem = tangShiMap.get(key);
      if (prevPoem) {
        mergePoetryMetadata(prevPoem, PoetrySource.TangFamousSelected, poem.tags);
      } else {
        const item: PoetryItem = {
          title: poem.title,
          author: poem.author || '佚名',
          paragraphs: poem.paragraphs,
          category: PoetrySourceCategory.Poem,
          sources: [PoetrySource.TangFamousSelected],
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
        mergePoetryMetadata(prevPoem, PoetrySource.ShuimoTang, ['水墨唐诗']);
      } else {
        const item: PoetryItem = {
          title: poem.title,
          author: poem.author || '佚名',
          paragraphs: poem.paragraphs,
          category: PoetrySourceCategory.Poem,
          sources: [PoetrySource.ShuimoTang],
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
      const item: PoetryItem = {
        title: poem.rhythmic,
        author: poem.author || '佚名',
        paragraphs: poem.paragraphs,
        category: PoetrySourceCategory.Ci,
        sources: [PoetrySource.Songci300],
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
      const item: PoetryItem = {
        title: poem.rhythmic,
        author: poem.author || '佚名',
        paragraphs: poem.paragraphs,
        category: PoetrySourceCategory.Ci,
        sources: [PoetrySource.SongciFamousSelected],
        tags: poem.tags || [],
      };
      const key = await getPoemKey(item.title, item.author);
      const prevPoem = songciMap.get(key);
      if (prevPoem) {
        mergePoetryMetadata(prevPoem, PoetrySource.SongciFamousSelected, item.tags);
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
    const qianZiWen = JSON.parse(
      readFileSync(join(TEMP_DIR, '蒙学/qianziwen.json'), 'utf-8')
    ) as QianZiWen;

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
      ...processQianZiWen(qianZiWen),
      ...(await processTangPoems(tangshi, shuimotangshi, qianJiaShi)),
      ...(await processSongPoems(songci)),
    ];

    return result;
  } catch (error) {
    console.error('处理过程中出现错误：', error);
    return [];
  }
}
