import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
  state: () => ({
    // 搜索缓存，使用Map结构存储不同搜索条件的结果
    searchCaches: new Map(),
    // 最大缓存数量
    maxCacheSize: 5,
    // 缓存过期时间（30分钟）
    cacheExpiry: 30 * 60 * 1000,
    // 当前搜索的缓存键
    currentCacheKey: null
  }),
  
  getters: {
    // 获取当前搜索的缓存
    getCurrentCache: (state) => {
      if (!state.currentCacheKey) return null
      const cache = state.searchCaches.get(state.currentCacheKey)
      if (!cache) return null
      
      // 检查缓存是否过期
      if (Date.now() - cache.timestamp > state.cacheExpiry) {
        state.searchCaches.delete(state.currentCacheKey)
        return null
      }
      
      return cache
    },
    
    // 检查是否有有效缓存
    hasValidCache: (state) => (cacheKey) => {
      const cache = state.searchCaches.get(cacheKey)
      if (!cache) return false
      
      // 检查缓存是否过期
      if (Date.now() - cache.timestamp > state.cacheExpiry) {
        state.searchCaches.delete(cacheKey)
        return false
      }
      
      return true
    }
  },
  
  actions: {
    // 生成缓存键
    generateCacheKey(searchParams) {
      const { keyword, category, brand, priceRange, year } = searchParams
      const keyString = `${keyword || ''}_${category || 'all'}_${brand || ''}_${priceRange || 'all'}_${year || ''}`
      // 使用Base64编码并清理特殊字符
      return btoa(encodeURIComponent(keyString)).replace(/[^a-zA-Z0-9]/g, '')
    },
    
    // 设置当前搜索的缓存键
    setCurrentCacheKey(searchParams) {
      this.currentCacheKey = this.generateCacheKey(searchParams)
      return this.currentCacheKey
    },
    
    // 保存搜索结果到缓存
    saveSearchCache(searchParams, data) {
      const cacheKey = this.generateCacheKey(searchParams)
      
      // 如果缓存数量超过限制，删除最旧的缓存
      if (this.searchCaches.size >= this.maxCacheSize) {
        const oldestKey = this.searchCaches.keys().next().value
        this.searchCaches.delete(oldestKey)
      }
      
      // 保存缓存
      this.searchCaches.set(cacheKey, {
        searchParams: { ...searchParams },
        vehicles: [...data.vehicles],
        pagination: { ...data.pagination },
        // 滚动位置字段已移除
        timestamp: Date.now()
      })
      
      this.currentCacheKey = cacheKey
      console.log('搜索结果已缓存:', cacheKey, '缓存数量:', this.searchCaches.size)
    },
    
    // 滚动位置更新方法已移除
    
    // 获取缓存的搜索结果
    getCachedSearchResult(searchParams) {
      const cacheKey = this.generateCacheKey(searchParams)
      const cache = this.searchCaches.get(cacheKey)
      
      if (!cache) {
        console.log('未找到缓存:', cacheKey)
        return null
      }
      
      // 检查缓存是否过期
      if (Date.now() - cache.timestamp > this.cacheExpiry) {
        this.searchCaches.delete(cacheKey)
        console.log('缓存已过期:', cacheKey)
        return null
      }
      
      this.currentCacheKey = cacheKey
      console.log('使用缓存结果:', cacheKey)
      return cache
    },
    
    // 清除指定缓存
    clearCache(searchParams) {
      const cacheKey = this.generateCacheKey(searchParams)
      this.searchCaches.delete(cacheKey)
      console.log('缓存已清除:', cacheKey)
    },
    
    // 清除所有缓存
    clearAllCaches() {
      this.searchCaches.clear()
      this.currentCacheKey = null
      console.log('所有缓存已清除')
    },
    
    // 清理过期缓存
    cleanExpiredCaches() {
      const now = Date.now()
      const expiredKeys = []
      
      for (const [key, cache] of this.searchCaches) {
        if (now - cache.timestamp > this.cacheExpiry) {
          expiredKeys.push(key)
        }
      }
      
      expiredKeys.forEach(key => {
        this.searchCaches.delete(key)
      })
      
      if (expiredKeys.length > 0) {
        console.log('清理过期缓存:', expiredKeys.length, '个')
      }
    },
    
    // 获取缓存统计信息
    getCacheStats() {
      return {
        totalCaches: this.searchCaches.size,
        maxCacheSize: this.maxCacheSize,
        currentCacheKey: this.currentCacheKey,
        cacheKeys: Array.from(this.searchCaches.keys())
      }
    }
  }
})