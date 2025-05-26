// 自动生成暗黑模式图片
import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const IMAGE_DIR = path.resolve(__dirname, '../src/assets/images');
const SUPPORTED_EXTENSIONS = ['.png', '.jpeg', '.jpg', '.webp'];

async function convertToDarkMode(inputPath: string) {
  try {
    // 确保文件存在
    if (!fs.existsSync(inputPath)) {
      console.error('❌ 文件不存在:', inputPath);
      return;
    }

    const darkPath = inputPath.replace(/(\.[^.]+)$/, '.dark$1');
    const sourceStats = fs.statSync(inputPath);
    const sourceMtime = sourceStats.mtimeMs;

    // 检查暗黑模式图片是否存在且是否需要更新
    if (fs.existsSync(darkPath)) {
      const darkStats = fs.statSync(darkPath);
      const darkMtime = darkStats.mtimeMs;

      if (darkMtime >= sourceMtime) {
        console.log('⏭️  暗黑模式图片已是最新:', path.basename(darkPath));
        return;
      } else {
        console.log('🔄  源图片已更新，重新生成暗黑模式图片:', path.basename(darkPath));
      }
    }

    // 读取图片
    const image = await Jimp.read(Buffer.from(fs.readFileSync(inputPath)));
    image.invert(); // 反转颜色：黑变白，白变黑
    await image.write(darkPath as `${string}.${string}`);
    console.log('✅ 暗黑模式图片已生成:', path.basename(darkPath));
  } catch (error) {
    console.error('❌ 图片处理失败:', path.basename(inputPath), error);
  }
}

async function processImages() {
  try {
    // 确保目录存在
    if (!fs.existsSync(IMAGE_DIR)) {
      console.error('❌ 图片目录不存在:', IMAGE_DIR);
      return;
    }

    // 读取目录中的所有文件
    const files = fs.readdirSync(IMAGE_DIR);

    // 过滤出支持的图片文件
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return SUPPORTED_EXTENSIONS.includes(ext) && !file.includes('.dark.');
    });

    if (imageFiles.length === 0) {
      console.log('ℹ️  没有找到需要处理的图片');
      return;
    }

    console.log('🔍 找到以下图片需要处理:');
    imageFiles.forEach((file) => console.log(`  - ${file}`));

    // 处理每个图片
    for (const file of imageFiles) {
      const filePath = path.join(IMAGE_DIR, file);
      await convertToDarkMode(filePath);
    }

    console.log('✨ 所有图片处理完成');
  } catch (error) {
    console.error('❌ 处理过程出错:', error);
  }
}

// 执行脚本
processImages();
