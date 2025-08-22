import { defineStore } from 'pinia'
import { authAPI } from '@/utils/api'
import api from '@/utils/api'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    isLoggedIn: false,
    token: null,
    loading: false,
    isInitialized: false, // 添加初始化状态标记
    isInitializing: false // 添加正在初始化标记，防止并发初始化
  }),
  
  getters: {
    getUserInfo: (state) => state.userInfo,
    getLoginStatus: (state) => state.isLoggedIn,
    getLoading: (state) => state.loading
  },
  
  actions: {
    // 设置用户信息
    setUserInfo(userInfo) {
      this.userInfo = userInfo
      this.isLoggedIn = true
    },
    
    // 设置token
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    
    // 用户登录
    async login(loginData) {
      this.loading = true
      try {
        const data = await authAPI.login(loginData)
        this.setToken(data.token)
        this.setUserInfo(data.user)
        ElMessage.success('登录成功')
        return data
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 用户注册
    async register(registerData) {
      this.loading = true
      try {
        const data = await authAPI.register(registerData)
        ElMessage.success('注册成功，请登录')
        return data
      } catch (error) {
        console.error('注册失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 获取当前用户信息
    async getCurrentUser() {
      try {
        const userInfo = await authAPI.getCurrentUser()
        this.setUserInfo(userInfo)
        return userInfo
      } catch (error) {
        console.error('获取用户信息失败:', error)
        // 静默清除用户状态，不触发登出API调用
        this.userInfo = null
        this.isLoggedIn = false
        this.token = null
        localStorage.removeItem('token')
        throw error
      }
    },
    
    // 静默获取当前用户信息（用于初始化）
    async getCurrentUserSilent() {
      try {
        const userInfo = await authAPI.getCurrentUser(true)
        this.setUserInfo(userInfo)
        return userInfo
      } catch (error) {
        console.error('静默获取用户信息失败:', error)
        // 静默清除用户状态
        this.userInfo = null
        this.isLoggedIn = false
        this.token = null
        localStorage.removeItem('token')
        throw error
      }
    },
    
    // 用户登出
    async logout() {
      // 防止重复登出
      if (!this.token && !this.isLoggedIn) {
        return
      }
      
      try {
        if (this.token) {
          // 使用静默模式调用登出API，避免显示错误消息
          await api.post('/auth/logout', {}, { silent: true })
        }
      } catch (error) {
        console.error('登出失败:', error)
      } finally {
        this.userInfo = null
        this.isLoggedIn = false
        this.token = null
        localStorage.removeItem('token')
        ElMessage.success('已退出登录')
      }
    },
    
    // 初始化用户状态
    async initUserState() {
      // 防止重复初始化
      if (this.isInitialized || this.isInitializing) {
        console.log('🔐 用户状态已初始化或正在初始化，跳过重复初始化')
        return
      }
      
      this.isInitializing = true
      
      try {
        const token = localStorage.getItem('token')
        console.log('🔐 初始化用户状态，token:', token ? '存在' : '不存在')
        
        if (token) {
          this.token = token
          try {
            await this.getCurrentUserSilent()
            console.log('✅ 用户状态初始化成功:', this.userInfo?.username)
          } catch (error) {
            console.log('❌ 用户状态初始化失败:', error.message)
            // 静默清除无效的token，不显示错误消息
            this.userInfo = null
            this.isLoggedIn = false
            this.token = null
            localStorage.removeItem('token')
          }
        } else {
          console.log('ℹ️ 没有token，用户未登录')
        }
      } finally {
        // 标记为已初始化
        this.isInitialized = true
        this.isInitializing = false
      }
    }
  }
}) 