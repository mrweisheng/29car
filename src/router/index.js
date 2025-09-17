import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'nav.home'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: {
      title: 'nav.about'
    }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Search.vue'),
    meta: {
      title: 'nav.search',
      keepAlive: true
    }
  },
  {
    path: '/auth',
    name: 'LoginRegister',
    component: () => import('@/views/LoginRegister.vue'),
    meta: {
      title: 'auth.title'
    }
  },
  {
    path: '/publish',
    name: 'Publish',
    component: () => import('@/views/Publish.vue'),
    meta: {
      title: 'publish.title',
      requiresAuth: true
    }
  },
  {
    path: '/my-vehicles',
    name: 'MyVehicles',
    component: () => import('@/views/MyVehicles.vue'),
    meta: {
      title: '我的车辆',
      requiresAuth: true
    }
  },
  {
    path: '/vehicle/:id',
    name: 'VehicleDetail',
    component: () => import('@/views/VehicleDetail.vue'),
    meta: {
      title: 'vehicleDetail.title'
    }
  },
  {
    path: '/special-offer',
    name: 'SpecialOffer',
    component: () => import('@/views/SpecialOffer.vue'),
    meta: {
      title: 'specialOffer.title'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 如果是浏览器前进后退操作，保持原有位置
    if (savedPosition) {
      return savedPosition
    }
    
    // 如果是新的页面导航，强制滚动到顶部
    if (to.path !== from.path) {
      return { 
        top: 0, 
        behavior: 'instant' // 使用instant避免动画延迟
      }
    }
    
    // 默认滚动到顶部
    return { top: 0, behavior: 'instant' }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    // 这里暂时使用固定的标题，因为路由守卫中无法直接使用 i18n
    const titleMap = {
      'nav.home': '首頁',
      'nav.about': '關於我們',
      'nav.search': '搜索結果',
      'auth.title': '登錄註冊',
      'publish.title': '發佈車輛',
      'vehicleDetail.title': '車輛詳情',
      'specialOffer.title': '特價車+牌組合',
      '我的车辆': '我的车辆'
    }
    const title = titleMap[to.meta.title] || to.meta.title
    document.title = `${title} - 明哥粤港车`
  }
  
  // 检查需要认证的路由
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      // 未登录，跳转到登录页面
      next({
        path: '/auth',
        query: { redirect: to.fullPath }
      })
      return
    }

    // 验证 token 是否有效（检查 token 格式和过期时间）
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]))
      if (tokenData.exp && tokenData.exp * 1000 < Date.now()) {
        // token 过期，清除并跳转到登录页面
        localStorage.removeItem('token')
        next({
          path: '/auth',
          query: { redirect: to.fullPath }
        })
        return
      }
    } catch (error) {
      // token 格式错误，清除并跳转到登录页面
      localStorage.removeItem('token')
      next({
        path: '/auth',
        query: { redirect: to.fullPath }
      })
      return
    }
  }
  
  next()
})

export default router