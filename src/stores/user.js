import { defineStore } from 'pinia'
import { authAPI } from '@/utils/api'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    isLoggedIn: false,
    token: null,
    loading: false
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
        this.logout()
        throw error
      }
    },
    
    // 用户登出
    async logout() {
      try {
        if (this.token) {
          await authAPI.logout()
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
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        try {
          await this.getCurrentUser()
        } catch (error) {
          // 如果获取用户信息失败，清除token
          this.logout()
        }
      }
    }
  }
}) 