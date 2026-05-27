// API 基础配置
// 统一使用相对路径，本地和线上都通过同源 API

export const API_BASE_URL = '/api';

// 封装 fetch，自动添加基础 URL
export async function apiFetch(url: string, options?: RequestInit) {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  return fetch(fullUrl, options);
}
