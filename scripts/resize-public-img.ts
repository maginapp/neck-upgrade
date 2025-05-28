// 协助生成，发布插件的介绍图片
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { Jimp } from 'jimp';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const INPUT_DIR = path.resolve(__dirname, '../zip');
const OUTPUT_DIR = path.resolve(__dirname, '../zip/format');
const SUPPORTED_EXTENSIONS = ['.png', '.jpeg', '.jpg', '.webp'];

const TARGET_SIZE_LIST = [
  [1280, 800],
  [440, 280],
  [1400, 560],
];

// 获取图片的主要颜色
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getDominantColor(image: any): Promise<number> {
  const colors = new Map<number, number>();
  const sampleSize = 100; // 采样大小

  // 随机采样像素点
  for (let i = 0; i < sampleSize; i++) {
    const x = Math.floor(Math.random() * image.width);
    const y = Math.floor(Math.random() * image.height);
    const color = image.getPixelColor(x, y);
    colors.set(color, (colors.get(color) || 0) + 1);
  }

  // 找出出现次数最多的颜色
  let maxCount = 0;
  let dominantColor = 0;
  colors.forEach((count, color) => {
    if (count > maxCount) {
      maxCount = count;
      dominantColor = color;
    }
  });

  return dominantColor;
}

function getOptimalSize(
  originalWidth: number,
  originalHeight: number,
  targetWidth: number,
  targetHeight: number
) {
  const targetRatio = targetWidth / targetHeight;
  const originalRatio = originalWidth / originalHeight;

  let scaleHeight: number;
  let scaleWidth: number;

  // 原图更宽，需要按宽度缩放
  if (originalRatio > targetRatio) {
    if (originalWidth > targetWidth) {
      const scale = Math.ceil(originalWidth / targetWidth);
      scaleHeight = originalHeight / scale;
      scaleWidth = originalWidth / scale;
    } else {
      const scale = Math.floor(targetWidth / originalWidth);
      scaleHeight = originalHeight * scale;
      scaleWidth = originalWidth * scale;
    }
  } else {
    if (originalWidth > targetWidth) {
      const scale = Math.ceil(originalHeight / targetHeight);
      scaleHeight = originalHeight / scale;
      scaleWidth = originalWidth / scale;
    } else {
      const scale = Math.floor(targetHeight / originalHeight);
      scaleHeight = originalHeight * scale;
      scaleWidth = originalWidth * scale;
    }
  }

  if (scaleHeight >= targetHeight * 0.8 || scaleWidth >= targetWidth * 0.8) {
    return {
      width: scaleWidth,
      height: scaleHeight,
    };
  }

  // 计算缩放比例
  const scale = Math.min(targetWidth / originalWidth, targetHeight / originalHeight);

  return {
    width: Math.round(originalWidth * scale),
    height: Math.round(originalHeight * scale),
  };
}

async function resizeImage(inputPath: string, targetWidth: number, targetHeight: number) {
  try {
    // 读取图片
    const image = await Jimp.read(inputPath);
    const originalWidth = image.width;
    const originalHeight = image.height;

    const { width: newWidth, height: newHeight } = getOptimalSize(
      originalWidth,
      originalHeight,
      targetWidth,
      targetHeight
    );

    // 创建新图片
    const newImage = new Jimp({ width: targetWidth, height: targetHeight });

    // 获取原图主要颜色作为背景色 透明 -> 4007971839
    const bgColor = (await getDominantColor(image)) || 4007971839;
    newImage.scan(0, 0, targetWidth, targetHeight, function (x, y) {
      this.setPixelColor(bgColor, x, y);
    });

    // 缩放原图
    image.resize({ w: newWidth, h: newHeight });

    // 计算居中位置
    const x = Math.floor((targetWidth - newWidth) / 2);
    const y = Math.floor((targetHeight - newHeight) / 2);

    // 将缩放后的图片复制到新图片上
    newImage.composite(image, x, y);

    // 确保输出目录存在
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // 生成输出路径
    const fileName = path.basename(inputPath);
    const outputPath = path.join(
      OUTPUT_DIR,
      `${fileName}-${targetWidth}x${targetHeight}.${path.extname(fileName)}`
    );

    // 保存图片
    await newImage.write(outputPath as `${string}.${string}`);
    console.log(`✅ 图片已处理: ${fileName}`);
  } catch (error) {
    console.error('❌ 图片处理失败:', path.basename(inputPath), error);
  }
}

async function processImages() {
  try {
    // 确保输入目录存在
    if (!fs.existsSync(INPUT_DIR)) {
      console.error('❌ 输入目录不存在:', INPUT_DIR);
      return;
    }

    // 读取目录中的所有文件
    const files = fs.readdirSync(INPUT_DIR);

    // 过滤出支持的图片文件
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return SUPPORTED_EXTENSIONS.includes(ext);
    });

    if (imageFiles.length === 0) {
      console.log('ℹ️ 没有找到需要处理的图片');
      return;
    }

    console.log('🔍 找到以下图片需要处理:');
    imageFiles.forEach((file) => console.log(`  - ${file}`));

    // 处理每个图片
    for (const file of imageFiles) {
      const filePath = path.join(INPUT_DIR, file);
      //   await resizeImage(filePath);
      for (const size of TARGET_SIZE_LIST) {
        await resizeImage(filePath, size[0], size[1]);
      }
    }

    console.log('✨ 所有图片处理完成');
  } catch (error) {
    console.error('❌ 处理过程出错:', error);
  }
}

// 执行脚本
processImages();
