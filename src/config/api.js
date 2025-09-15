// API配置
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_IMAGE_BASE_URL || 'https://www.eazycar.top',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
}

// 图片URL处理函数
export const getImageUrl = (url) => {
  if (!url) return '/default-car.jpg'

  // 如果是以 /uploads 开头的相对路径，拼接域名
  if (url.startsWith('/uploads/')) {
    return `${API_CONFIG.BASE_URL}${url}`
  }

  // 如果是完整的URL或者默认图片，直接返回
  return url
}