import { NEWS_URL, CACHE_KEYS } from '@/constants';
import { NewsItem } from '@/types';

import { dateUtils } from '../base';
import { fetchUtils } from '../fetch';

import { createNewsManager } from './newsManager';

interface CustomHTMLElement extends HTMLElement {
  dataset: DOMStringMap & {
    'za-extra-module': string;
  };
}

const getZhihuQuestionId = (linkElement: CustomHTMLElement | null) => {
  try {
    if (!linkElement) return '';
    const zaExtraModule = linkElement.dataset.zaExtraModule;
    if (!zaExtraModule) return '';
    const attachedInfoBytes = JSON.parse(zaExtraModule).attached_info_bytes;

    return attachedInfoBytes.matchAll(/\d{18,20}/g)[0];
  } catch (error) {
    console.error('获取知乎问题ID失败:', error, linkElement?.dataset?.zaExtraModule);
    return '';
  }
};

const fetchZhihuPage = async (url: string) => {
  try {
    const timeStr = dateUtils.getCurISOString();
    // 通过 background 脚本获取新闻
    const response = await fetchUtils(url, { cacheFetch: true });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();

    // 创建临时 DOM 解析 HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const newsItems: NewsItem[] = [];
    // 获取新闻列表
    const articles = doc.querySelectorAll('.HotList-item');

    articles.forEach((article) => {
      const titleElement = article.querySelector('.HotList-itemTitle');
      const tagElement = article.querySelector('.HotList-itemMetrics');
      const linkElement: CustomHTMLElement | null = article.querySelector('.HotList-item');
      const imgElement: HTMLImageElement | null = article.querySelector(
        '.HotList-itemImgContainer img'
      );
      if (titleElement) {
        const title = titleElement.textContent?.trim() ?? '';

        const quesId = getZhihuQuestionId(linkElement);

        // 构建知乎问题链接
        const link = quesId
          ? `https://www.zhihu.com/question/${quesId}`
          : `https://www.zhihu.com/search?type=content&q=${title}`;

        newsItems.push({
          title,
          link,
          source: '',
          time: timeStr,
          tag: (tagElement?.textContent ?? '').replace('热度', '').trim(),
          newsImg: imgElement?.src ?? '',
        });
      }
    });

    return newsItems;
  } catch (error) {
    console.error('获取新闻失败:', error);
    return [];
  }
};

export const zhihuHotNews = createNewsManager(CACHE_KEYS.ZHIHU_HOT, () => {
  return fetchZhihuPage(NEWS_URL.ZHIHU_HOT);
});
