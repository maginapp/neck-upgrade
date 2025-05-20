/**
 * 加载JSON数据文件
 * @param path 数据文件路径
 * @returns 解析后的JSON数据
 */
export async function loadJsonData<T>(path: string): Promise<T> {
  try {
    const response = await fetch(chrome.runtime.getURL(path));
    if (!response.ok) {
      throw new Error(`Failed to load data from ${path}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error loading data from ${path}:`, error);
    throw error;
  }
}
