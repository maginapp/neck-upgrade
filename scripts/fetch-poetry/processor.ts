import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { CacaoPoem, ChuciPoem, PoetryItem, ShijingPoem, ShuimotangshiPoem, SongciPoem, TangshiPoem } from './types';
import { TEMP_DIR, TARGET_DIR, POETRY_FILE, LAST_UPDATE_FILE } from './config';
import { cleanup, getRemoteLastCommit, checkNeedUpdateGit, checkNeedUpdate, ensureTargetDir } from './utils';

export async function processPoetry() {
    try {
      // 确保目标目录存在
      ensureTargetDir(TARGET_DIR);

        // 检查是否需要更新
    if (!checkNeedUpdate()) {
      console.log('本地数据已是最新，无需更新');
      // process.exit(0);
      return;
    } else if (checkNeedUpdateGit()) {
      console.log('检测到新版本，开始更新数据...');
      // 清理之前的临时文件
      cleanup();
      // 克隆仓库
      console.log('正在下载诗词数据...');
      execSync(`git clone https://github.com/chinese-poetry/chinese-poetry.git ${TEMP_DIR}`);

      // 保存最后更新时间
      const lastCommit = getRemoteLastCommit();
      writeFileSync(LAST_UPDATE_FILE, lastCommit);
    }
  
    // 读取诗词数据
    const caocao = JSON.parse(readFileSync(join(TEMP_DIR, '曹操诗集/caocao.json'), 'utf-8'));
    const chuci = JSON.parse(readFileSync(join(TEMP_DIR, '楚辞/chuci.json'), 'utf-8'));
    const shijing = JSON.parse(readFileSync(join(TEMP_DIR, '诗经/shijing.json'), 'utf-8'));
    const tangshi = JSON.parse(readFileSync(join(TEMP_DIR, '全唐诗/唐诗三百首.json'), 'utf-8'));
    const songci = JSON.parse(readFileSync(join(TEMP_DIR, '宋词/宋词三百首.json'), 'utf-8'));
    const shuimotangshi = JSON.parse(readFileSync(join(TEMP_DIR, '水墨唐诗/shuimotangshi.json'), 'utf-8'));

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

    // 创建水墨唐诗的查找映射
    const shuimotangshiMap = new Map<string, ShuimotangshiPoem>();
    shuimotangshi.forEach((poem: ShuimotangshiPoem) => {
      const key = `${poem.title}-${poem.author}`;
      shuimotangshiMap.set(key, poem);
    });

    // 处理唐诗三百首，并合并水墨唐诗数据
    tangshi.forEach((poem: TangshiPoem) => {
      const key = `${poem.title}-${poem.author}`;
      const shuimoPoem = shuimotangshiMap.get(key);
      
      if (shuimoPoem) {
        // 合并数据
        result.push({
          title: poem.title,
          author: poem.author || shuimoPoem.author || '佚名',
          paragraphs: poem.paragraphs,
          prologue: shuimoPoem.prologue,
          tags: ['水墨唐诗', ...poem.tags],
        });
        // 从映射中删除已处理的项
        shuimotangshiMap.delete(key);
      } else {
        // 没有对应的水墨唐诗，直接添加原数据
        result.push({
          title: poem.title,
          author: poem.author || '佚名',
          paragraphs: poem.paragraphs,
          tags: poem.tags,
        });
      }
    });

    // 处理剩余的未匹配的水墨唐诗
    shuimotangshiMap.forEach((poem: ShuimotangshiPoem) => {
      result.push({
        title: poem.title,
        author: poem.author || '佚名',
        paragraphs: poem.paragraphs,
        tags: ['水墨唐诗'],
        prologue: poem.prologue,
      });
    });

    // 处理宋词三百首
    songci.forEach((poem: SongciPoem) => {
      result.push({
        title: poem.rhythmic,
        author: poem.author || '佚名',
        paragraphs: poem.paragraphs,
        tags: poem.tags,
      });
    });

    // 保存处理后的数据
    console.log('正在保存处理后的数据...');
    writeFileSync(POETRY_FILE, JSON.stringify(result, null, 2));

    console.log('数据处理完成！');
  } catch (error) {
    console.error('处理过程中出现错误：', error);
  }
} 