import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    const { code, message, data } = response.data
    
    // 如果返回的状态码不是200或201，说明接口有问题，应该提示用户
    if (code !== 200 && code !== 201) {
      ElMessage.error(message || '请求失败')
      return Promise.reject(new Error(message || '请求失败'))
    }
    
    return data
  },
  (error) => {
    let message = '网络错误'
    
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          message = data?.message || '请求参数错误'
          break
        case 401:
          message = '未授权，请重新登录'
          // 清除token并跳转到登录页
          localStorage.removeItem('token')
          window.location.href = '/auth'
          break
        case 403:
          message = '禁止访问'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = data?.message || `请求失败 (${status})`
      }
    } else if (error.request) {
      message = '网络连接失败'
    }
    
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

// API方法
export const authAPI = {
  // 获取验证码
  getCaptcha() {
    return api.get('/captcha')
  },
  
  // 用户注册
  register(data) {
    return api.post('/auth/register', data)
  },
  
  // 用户登录
  login(data) {
    return api.post('/auth/login', data)
  },
  
  // 获取当前用户信息
  getCurrentUser() {
    return api.get('/auth/me')
  },
  
  // 用户登出
  logout() {
    return api.post('/auth/logout')
  }
}

// 车辆相关API
export const vehicleAPI = {
  // 获取车辆列表
  getVehicles(params = {}) {
    return api.get('/vehicles', { params })
  },
  
  // 获取车辆详情
  getVehicleDetail(vehicleId) {
    return api.get(`/vehicles/${vehicleId}`)
  },
  
  // 获取车辆统计
  getVehicleStats() {
    return api.get('/vehicles/stats')
  },
  
  // 获取汽车品牌列表
  getBrands() {
    return api.get('/vehicles/brands')
  },
  
  // 获取精选车辆
  getFeaturedVehicles() {
    return api.get('/vehicles/featured')
  },
  
  // 获取最新上架车辆
  getLatestVehicles() {
    return api.get('/vehicles/latest')
  }
}

export default api
