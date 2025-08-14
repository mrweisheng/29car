# 国际化开发规范指南

## 📋 概述

本文档旨在规范国际化（i18n）功能的开发流程，确保代码质量和功能稳定性。

## 🏗️ 架构设计

### 文件结构
```
src/i18n/
├── index.js          # 主配置文件
├── types.ts          # TypeScript 类型定义
└── locales/          # 语言文件
    ├── zh-CN.js      # 简体中文
    ├── en-US.js      # 英文
    └── zh-HK.js      # 繁体中文（回退语言）
```

### 键名命名规范

#### 1. 分层结构
```javascript
// ✅ 推荐：清晰的分层结构
{
  home: {
    category: {
      private: '私家车',
      van: '面包车'
    }
  },
  search: {
    filters: {
      priceRange: {
        title: '价格范围',
        options: {
          all: '全部',
          under50k: '5万以下'
        }
      }
    }
  }
}

// ❌ 避免：扁平结构
{
  'home.category.private': '私家车',
  'home.category.van': '面包车'
}
```

#### 2. 命名约定
- 使用小驼峰命名法（camelCase）
- 键名要具有描述性，避免缩写
- 保持英文键名的一致性

#### 3. 避免的命名
```javascript
// ❌ 避免：数字开头
'1stCategory': '第一类'

// ❌ 避免：特殊字符
'category-name': '分类名称'

// ❌ 避免：过长的键名
'veryLongKeyNameThatIsHardToRead': '很长的键名'
```

## 🔧 开发流程

### 1. 新增翻译前的检查清单

- [ ] 检查键名是否已存在
- [ ] 确认键路径结构是否合理
- [ ] 验证所有语言文件是否需要同步更新

### 2. 添加新翻译的步骤

```javascript
// 1. 在 types.ts 中添加类型定义
export interface I18nKeys {
  newFeature: {
    title: string;
    description: string;
  };
}

// 2. 在所有语言文件中添加翻译
// zh-CN.js
newFeature: {
  title: '新功能',
  description: '功能描述'
}

// en-US.js
newFeature: {
  title: 'New Feature',
  description: 'Feature description'
}

// zh-HK.js
newFeature: {
  title: '新功能',
  description: '功能描述'
}

// 3. 在组件中使用
const { t } = useI18n();
const title = t('newFeature.title');
```

### 3. 修改现有翻译的注意事项

- 不要删除正在使用的键
- 修改前确认所有引用位置
- 保持键名向后兼容

## 🚨 常见问题和解决方案

### 1. 键名冲突
```javascript
// ❌ 问题：重复定义
{
  search: {
    filters: {
      priceRange: '价格范围'  // 字符串
    }
  },
  search: {
    filters: {
      priceRange: {           // 对象 - 冲突！
        all: '全部'
      }
    }
  }
}

// ✅ 解决方案：重命名避免冲突
{
  search: {
    filters: {
      priceRangeTitle: '价格范围',  // 标题
      priceRange: {                 // 选项
        all: '全部'
      }
    }
  }
}
```

### 2. 路径不一致
```javascript
// ❌ 问题：不同组件使用不同路径
// 组件A
t('search.allVehicles')

// 组件B  
t('search.filters.allVehicles')

// ✅ 解决方案：统一路径
// 所有组件都使用
t('search.filters.allVehicles')
```

### 3. 回退语言缺失
```javascript
// ❌ 问题：回退语言缺少翻译
// zh-HK.js 缺少某些键，导致显示键名

// ✅ 解决方案：确保回退语言完整
// 每次添加新翻译时，同步更新所有语言文件
```

## 🧪 测试和验证

### 1. 运行验证脚本
```bash
npm run validate-i18n
```

### 2. 手动检查清单
- [ ] 所有语言文件结构一致
- [ ] 没有重复的键名
- [ ] 所有键都有对应的翻译
- [ ] 回退语言完整

### 3. 功能测试
- [ ] 切换语言功能正常
- [ ] 所有文本正确显示
- [ ] 没有显示键名的情况

## 📚 最佳实践

### 1. 组件中的使用
```vue
<template>
  <!-- ✅ 推荐：使用计算属性 -->
  <h1>{{ pageTitle }}</h1>
  
  <!-- ❌ 避免：模板中直接调用 -->
  <h1>{{ $t('page.title') }}</h1>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// ✅ 推荐：计算属性缓存翻译结果
const pageTitle = computed(() => t('page.title'));
</script>
```

### 2. 动态键名
```javascript
// ✅ 推荐：使用模板字符串
const fuelType = 'gasoline';
const fuelTypeText = t(`search.fuelTypes.${fuelType}`);

// ❌ 避免：字符串拼接
const fuelTypeText = t('search.fuelTypes.' + fuelType);
```

### 3. 复数处理
```javascript
// ✅ 推荐：使用参数化翻译
const count = 5;
const message = t('search.resultsFound', { count });

// 在语言文件中
{
  search: {
    resultsFound: '找到 {count} 辆车'
  }
}
```

## 🔍 调试技巧

### 1. 启用调试模式
```javascript
// 在 i18n/index.js 中
const i18n = createI18n({
  locale: getDefaultLocale(),
  fallbackLocale: 'zh-HK',
  messages,
  silentTranslationWarn: false, // 显示警告
  missingWarn: true,            // 显示缺失键警告
  fallbackWarn: true            // 显示回退警告
});
```

### 2. 浏览器控制台检查
```javascript
// 检查当前语言
console.log(i18n.global.locale.value);

// 检查所有可用键
console.log(i18n.global.messages.value);

// 测试翻译
console.log(i18n.global.t('test.key'));
```

## 📝 总结

遵循这些规范可以：
- 避免键名冲突和路径不一致
- 提高代码可维护性
- 减少国际化相关的 bug
- 提升开发效率

记住：**预防胜于治疗**，在开发过程中严格遵循规范，比后期修复问题要高效得多。
