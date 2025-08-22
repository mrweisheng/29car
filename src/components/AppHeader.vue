<template>
  <header class="header">
    <div class="container">
      <div class="mobile-menu">
        <el-button 
          class="hamburger-btn" 
          @click="toggleMobileMenu"
          :class="{ 'active': isMobileMenuOpen }"
        >
          <el-icon><Menu /></el-icon>
        </el-button>
        
        <div class="mobile-overlay" :class="{ 'open': isMobileMenuOpen }" @click="closeMobileMenu"></div>
        
        <div class="mobile-nav" :class="{ 'open': isMobileMenuOpen }">
          <div class="mobile-nav-header">
            <span class="mobile-nav-title">菜单</span>
            <el-button 
              class="close-btn" 
              @click="toggleMobileMenu"
            >
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
          <div class="mobile-nav-items">
            <div 
              class="mobile-nav-item" 
              :class="{ 'active': $route.path === '/' }"
              @click="handleNavigation('/')"
            >
              {{ $t('nav.home') }}
            </div>
            <div 
              class="mobile-nav-item"
              :class="{ 'active': $route.path === '/search' }"
              @click="handleNavigation('/search')"
            >
              {{ $t('nav.search') }}
            </div>
            <div 
              class="mobile-nav-item"
              :class="{ 'active': $route.path === '/about' }"
              @click="handleNavigation('/about')"
            >
              {{ $t('nav.about') }}
            </div>
            <div 
              class="mobile-nav-item"
              :class="{ 'active': $route.path === '/publish' }"
              @click="handleNavigation('/publish')"
            >
              {{ $t('nav.publish') }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="logo" @click="handleLogoClick">
        <img src="@/logo/eazycar.png" alt="明哥粤港车" class="logo-image" />
        <span class="logo-text">{{ $t('home.header.tagline') }}</span>
      </div>
      
      <nav class="desktop-nav">
        <div class="nav-item" :class="{ 'active': $route.path === '/' }" @click="handleNavigation('/')">{{ $t('nav.home') }}</div>
        <div class="nav-item" :class="{ 'active': $route.path === '/search' }" @click="handleNavigation('/search')">{{ $t('nav.search') }}</div>
        <div class="nav-item" :class="{ 'active': $route.path === '/about' }" @click="handleNavigation('/about')">{{ $t('nav.about') }}</div>
        <div class="nav-item" :class="{ 'active': $route.path === '/publish' }" @click="handleNavigation('/publish')">{{ $t('nav.publish') }}</div>
      </nav>
      
      <div class="header-actions">
        <LanguageSwitcher />
        <template v-if="!userStore.isLoggedIn">
          <el-button type="primary" @click="handleLoginRegister">
            <el-icon><User /></el-icon>
            {{ $t('common.login') }}/{{ $t('common.register') }}
          </el-button>
        </template>
        <template v-else>
          <el-dropdown @command="handleUserCommand">
            <div class="user-info">
              <el-avatar :size="40" class="user-avatar mobile-hidden">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="username">{{ userStore.userInfo?.username }}</span>
              <el-icon class="dropdown-arrow"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  {{ $t('common.logout') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { Menu, Close, Van, User, Setting, SwitchButton, ArrowDown } from '@element-plus/icons-vue'
const router = useRouter()
const userStore = useUserStore()
const isMobileMenuOpen = ref(false)

// 滚动到顶部函数
const scrollToTop = () => {
  if (window.scrollTo) {
    window.scrollTo(0, 0)
  }
  if (document.documentElement) {
    document.documentElement.scrollTop = 0
  }
  if (document.body) {
    document.body.scrollTop = 0
  }
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleLoginRegister = () => {
  router.push('/auth')
}

const handleUserCommand = (command) => {
  if (command === 'logout') {
    userStore.logout()
    router.push('/')
  }
}

// 导航点击处理，确保滚动到顶部
const handleNavigation = (path) => {
  // 关闭移动端菜单
  if (isMobileMenuOpen.value) {
    closeMobileMenu()
  }
  
  // 导航到目标页面
  router.push(path)
  
  // 延迟执行滚动重置，确保路由切换完成
  setTimeout(() => {
    scrollToTop()
  }, 100)
}

// Logo点击处理
const handleLogoClick = () => {
  // 如果当前不在主页，则导航到主页
  if (router.currentRoute.value.path !== '/') {
    handleNavigation('/')
  }
  // 如果已经在主页，则无任何效果
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e0e0e0;
  width: 100%;
  height: 80px;
  display: block;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  position: relative;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
}

.logo-image {
  height: 60px;
  width: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.logo-text {
  font-size: 18px;
  font-weight: normal;
  color: #333;
}

.logo-icon {
  font-size: 32px;
  margin-right: 12px;
  color: #ffd700;
}

.logo-text {
  margin-right: 8px;
}

.logo-tagline {
  font-size: 14px;
  font-weight: normal;
  opacity: 0.9;
}

.nav {
  display: flex;
  gap: 30px;
}

.desktop-nav {
  display: flex;
  gap: 30px;
}

.nav-item {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  user-select: none;
}

.nav-item:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.nav-item.active {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.user-info:hover {
  background: rgba(102, 126, 234, 0.1);
}

.user-avatar {
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.username {
  color: #333;
  font-weight: 500;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-arrow {
  color: #333;
  font-size: 12px;
}

.mobile-menu {
  display: none;
}

.hamburger-btn {
  background: transparent;
  border: none;
  color: #333;
  font-size: 24px;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.hamburger-btn:hover {
  background: rgba(102, 126, 234, 0.1);
}

.hamburger-btn.active {
  background: rgba(102, 126, 234, 0.2);
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.mobile-overlay.open {
  opacity: 1;
  visibility: visible;
}

.mobile-nav {
  position: fixed;
  top: 0;
  left: -300px;
  width: 300px;
  height: 100vh;
  background: white;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
}

.mobile-nav.open {
  left: 0;
}

.mobile-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #eee;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.mobile-nav-title {
  font-size: 18px;
  font-weight: bold;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
}

.mobile-nav-items {
  padding: 20px 0;
}

.mobile-nav-item {
  display: block;
  padding: 16px 20px;
  color: #333;
  text-decoration: none;
  border-bottom: 1px solid #f5f5f5;
  transition: all 0.3s ease;
  cursor: pointer;
  user-select: none;
}

.mobile-nav-item:hover {
  background: #f8f9fa;
  color: #667eea;
}

.mobile-nav-item.active {
  background: #667eea;
  color: white;
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }
  
  .mobile-menu {
    display: block;
  }
  
  .logo-tagline {
    display: none;
  }
  
  .logo-image {
    height: 50px;
    width: 50px;
  }
  
  .container {
    padding: 0 15px;
    width: 100%;
    max-width: 100%;
    gap: 5px;
  }
  
  .logo {
    margin-left: -5px;
    flex-shrink: 1;
  }
  
  .header {
    width: 100%;
    height: 80px;
  }
  
  .header-actions {
    gap: 10px;
    flex-shrink: 0;
  }
  
  .header-actions .el-button {
    padding: 8px 12px;
    font-size: 14px;
  }
  
  .mobile-hidden {
    display: none;
  }
  
  .username {
    max-width: 80px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 10px;
    width: 100%;
    max-width: 100%;
    gap: 3px;
  }
  
  .logo-image {
    height: 40px;
    width: 40px;
  }
  
  .logo-text {
    font-size: 14px;
    white-space: nowrap;
    writing-mode: horizontal-tb;
    text-orientation: mixed;
  }
  
  .logo-icon {
    font-size: 28px;
  }
  
  .header {
    width: 100%;
    height: 80px;
  }
  
  .header-actions {
    gap: 8px;
  }
  
  .header-actions .el-button {
    padding: 6px 8px;
    font-size: 12px;
  }
  
  .logo {
    flex-shrink: 1;
    min-width: 0;
    margin-left: -8px;
    gap: 6px;
  }
}
</style>
