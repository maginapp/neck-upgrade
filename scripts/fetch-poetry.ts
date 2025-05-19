import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, rmSync } from 'fs';
import { join } from 'path';

// 定义诗词数据结构
interface PoetryItem {
  title: string;
  author: string;
  content: string;
  dynasty: string;
  source: string;
}

interface RawPoem {
  title: string;
  author?: string;
  content: string[];
}

// 临时目录
const TEMP_DIR = 'temp/chinese-poetry';
const TARGET_DIR = 'src/data';
const POETRY_FILE = join(TARGET_DIR, 'poetry.json');
const LAST_UPDATE_FILE = join(TARGET_DIR, 'last-update-poetry.txt');

// 清理函数
function cleanup() {
  if (existsSync(TEMP_DIR)) {
    rmSync(TEMP_DIR, { recursive: true, force: true });
  }
}

// 获取远程仓库最新提交时间
function getRemoteLastCommit(): string {
  const output = execSync('git ls-remote --sort=-v:refname https://github.com/chinese-poetry/chinese-poetry.git HEAD').toString();
  return output.split('\t')[0];
}

// 检查是否需要更新
function checkNeedUpdate(): boolean {
  if (!existsSync(POETRY_FILE) || checkNeedUpdateGit()) {
    return true;
  }

  return false;
}

// 检查是否需要更新git
function checkNeedUpdateGit(): boolean {
  if (!existsSync(LAST_UPDATE_FILE)) {
    return true;
  }

  try {
    const lastCommit = readFileSync(LAST_UPDATE_FILE, 'utf-8').trim();
    const remoteCommit = getRemoteLastCommit();
    return lastCommit !== remoteCommit;
  } catch (error) {
    console.log('检查更新时出错，将重新下载数据');
    return true;
  }
}


// 确保目标目录存在
if (!existsSync(TARGET_DIR)) {
  execSync(`mkdir -p ${TARGET_DIR}`);
}

try {
  // 检查是否需要更新
  if (!checkNeedUpdate()) {
    console.log('本地数据已是最新，无需更新');
    process.exit(0);
  } else if (checkNeedUpdateGit()) {
    console.log('检测到新版本，开始更新数据...');
    // 清理之前的临时文件
    cleanup();
    // 克隆仓库
    console.log('正在下载诗词数据...');
    execSync(`git clone https://github.com/chinese-poetry/chinese-poetry.git ${TEMP_DIR}`);
  }

  // 保存最后更新时间
  const lastCommit = getRemoteLastCommit();
  writeFileSync(LAST_UPDATE_FILE, lastCommit);

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
  caocao.forEach((poem: RawPoem) => {
    result.push({
      title: poem.title,
      author: '曹操',
      content: poem.content.join('\n'),
      dynasty: '三国',
      source: '曹操诗集'
    });
  });

  // 处理楚辞
  chuci.forEach((poem: RawPoem) => {
    result.push({
      title: poem.title,
      author: poem.author || '佚名',
      content: poem.content.join('\n'),
      dynasty: '战国',
      source: '楚辞'
    });
  });

  // 处理诗经
  shijing.forEach((poem: RawPoem) => {
    result.push({
      title: poem.title,
      author: poem.author || '佚名',
      content: poem.content.join('\n'),
      dynasty: '周',
      source: '诗经'
    });
  });

  // 处理唐诗三百首
  tangshi.forEach((poem: RawPoem) => {
    result.push({
      title: poem.title,
      author: poem.author || '佚名',
      content: poem.content.join('\n'),
      dynasty: '唐',
      source: '唐诗三百首'
    });
  });

  // 处理宋词三百首
  songci.forEach((poem: RawPoem) => {
    result.push({
      title: poem.title,
      author: poem.author || '佚名',
      content: poem.content.join('\n'),
      dynasty: '宋',
      source: '宋词三百首'
    });
  });

  // 处理水墨唐诗
  shuimotangshi.forEach((poem: RawPoem) => {
    result.push({
      title: poem.title,
      author: poem.author || '佚名',
      content: poem.content.join('\n'),
      dynasty: '唐',
      source: '水墨唐诗'
    });
  });

  // 保存处理后的数据
  console.log('正在保存处理后的数据...');
  writeFileSync(POETRY_FILE, JSON.stringify(result, null, 2));

  console.log('数据处理完成！');
} catch (error) {
  console.error('处理过程中出现错误：', error);
  // 发生错误时清理临时文件
  // cleanup();
} 