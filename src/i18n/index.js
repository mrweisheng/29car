import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import zhHK from './locales/zh-HK'
import enUS from './locales/en-US'

// 获取浏览器语言设置
const getDefaultLocale = () => {
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale) {
    return savedLocale
  }
  
  const browserLang = navigator.language || navigator.userLanguage
  if (browserLang.startsWith('zh')) {
    // 根据浏览器语言判断是简体还是繁体
    if (browserLang.includes('HK') || browserLang.includes('TW')) {
      return 'zh-HK'
    }
    return 'zh-CN'
  }
  
  return 'zh-CN' // 默认使用简体中文
}

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getDefaultLocale(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'zh-HK': zhHK,
    'en-US': enUS
  }
})

export default i18n