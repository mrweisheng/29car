<template>
  <el-dropdown @command="handleLanguageChange" trigger="click">
    <el-button type="text" class="language-switcher">
      <span class="globe-icon">🌐</span>
      <span class="language-text">{{ currentLanguageName }}</span>
      <el-icon class="el-icon--right mobile-hidden"><ArrowDown /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item 
          v-for="lang in availableLanguages" 
          :key="lang.code"
          :command="lang.code"
          :class="{ 'is-active': currentLocale === lang.code }"
        >
          {{ typeof lang.name === 'function' ? lang.name() : lang.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

const { locale, t } = useI18n()

// 可用语言列表
const availableLanguages = [
  { code: 'zh-CN', get name() { return t('language.zhCN') } },
  { code: 'zh-HK', get name() { return t('language.zhHK') } },
  { code: 'en-US', get name() { return t('language.enUS') } }
]

// 当前语言代码
const currentLocale = computed(() => locale.value)

// 当前语言名称
const currentLanguageName = computed(() => {
  const lang = availableLanguages.find(l => l.code === currentLocale.value)
  return lang ? lang.name : '繁體中文'
})

// 切换语言
const handleLanguageChange = (langCode) => {
  locale.value = langCode
  localStorage.setItem('locale', langCode)
  ElMessage.success(t('messages.languageChanged'))
}
</script>

<style lang="scss" scoped>
.language-switcher {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  color: $text-regular;
  font-weight: 500;
  
  &:hover {
    color: $primary-color;
  }
}

.globe-icon {
  font-size: 16px;
  display: inline-block;
}

:deep(.el-dropdown-menu__item.is-active) {
  color: $primary-color;
  background-color: rgba($primary-color, 0.1);
}

@media (max-width: 768px) {
  .language-text {
    display: none;
  }
  
  .mobile-hidden {
    display: none;
  }
  
  .language-switcher {
    min-width: auto;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .language-switcher .el-icon {
    display: block !important;
  }
}
</style>