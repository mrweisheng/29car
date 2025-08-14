#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 国际化文件路径
const localesPath = path.join(__dirname, '../src/i18n/locales');
const locales = ['zh-CN.js', 'en-US.js', 'zh-HK.js'];

// 检查结果
const results = {
  duplicateKeys: [],
  missingKeys: [],
  inconsistentPaths: [],
  errors: []
};

// 获取所有键路径
function getAllKeys(obj, prefix = '') {
  const keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

// 检查重复键
function checkDuplicateKeys(localeData, localeName) {
  const allKeys = getAllKeys(localeData);
  const seen = new Set();
  
  allKeys.forEach(key => {
    if (seen.has(key)) {
      results.duplicateKeys.push({
        locale: localeName,
        key: key
      });
    }
    seen.add(key);
  });
}

// 检查缺失键
function checkMissingKeys(baseLocale, otherLocale, otherLocaleName) {
  const baseKeys = new Set(getAllKeys(baseLocale));
  const otherKeys = new Set(getAllKeys(otherLocale));
  
  baseKeys.forEach(key => {
    if (!otherKeys.has(key)) {
      results.missingKeys.push({
        locale: otherLocaleName,
        key: key
      });
    }
  });
}

// 检查路径一致性
function checkPathConsistency(locales) {
  const allKeys = new Set();
  const localeKeys = {};
  
  // 收集所有键
  locales.forEach(({ name, data }) => {
    localeKeys[name] = getAllKeys(data);
    localeKeys[name].forEach(key => allKeys.add(key));
  });
  
  // 检查每个键是否在所有语言中都存在
  allKeys.forEach(key => {
    const missingIn = [];
    locales.forEach(({ name }) => {
      if (!localeKeys[name].includes(key)) {
        missingIn.push(name);
      }
    });
    
    if (missingIn.length > 0) {
      results.inconsistentPaths.push({
        key: key,
        missingIn: missingIn
      });
    }
  });
}

// 主验证函数
function validateI18n() {
  console.log('🔍 开始验证国际化文件...\n');
  
  try {
    const localeData = {};
    
    // 读取所有语言文件
    locales.forEach(locale => {
      const filePath = path.join(localesPath, locale);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        // 移除 export default 和 module.exports
        const cleanContent = content
          .replace(/export\s+default\s*/, '')
          .replace(/module\.exports\s*=\s*/, '');
        
        try {
          const data = eval(`(${cleanContent})`);
          localeData[locale] = data;
          
          // 检查重复键
          checkDuplicateKeys(data, locale);
        } catch (error) {
          results.errors.push({
            file: locale,
            error: error.message
          });
        }
      }
    });
    
    // 检查缺失键（以 zh-CN 为基准）
    if (localeData['zh-CN.js'] && localeData['en-US.js']) {
      checkMissingKeys(localeData['zh-CN.js'], localeData['en-US.js'], 'en-US.js');
    }
    if (localeData['zh-CN.js'] && localeData['zh-HK.js']) {
      checkMissingKeys(localeData['zh-CN.js'], localeData['zh-HK.js'], 'zh-HK.js');
    }
    
    // 检查路径一致性
    const localesArray = Object.entries(localeData).map(([name, data]) => ({ name, data }));
    checkPathConsistency(localesArray);
    
    // 输出结果
    console.log('📊 验证结果:');
    
    if (results.duplicateKeys.length > 0) {
      console.log('\n❌ 发现重复键:');
      results.duplicateKeys.forEach(item => {
        console.log(`  ${item.locale}: ${item.key}`);
      });
    }
    
    if (results.missingKeys.length > 0) {
      console.log('\n⚠️  发现缺失键:');
      results.missingKeys.forEach(item => {
        console.log(`  ${item.locale}: ${item.key}`);
      });
    }
    
    if (results.inconsistentPaths.length > 0) {
      console.log('\n⚠️  发现路径不一致:');
      results.inconsistentPaths.forEach(item => {
        console.log(`  ${item.key} - 缺失于: ${item.missingIn.join(', ')}`);
      });
    }
    
    if (results.errors.length > 0) {
      console.log('\n❌ 解析错误:');
      results.errors.forEach(item => {
        console.log(`  ${item.file}: ${item.error}`);
      });
    }
    
    if (results.duplicateKeys.length === 0 && 
        results.missingKeys.length === 0 && 
        results.inconsistentPaths.length === 0 && 
        results.errors.length === 0) {
      console.log('\n✅ 所有检查通过！国际化文件结构完整且一致。');
    } else {
      console.log('\n🔧 请修复上述问题以确保国际化功能正常。');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ 验证过程中发生错误:', error.message);
    process.exit(1);
  }
}

// 运行验证
validateI18n();
