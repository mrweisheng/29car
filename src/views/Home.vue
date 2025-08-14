<template>
  <div class="home">
    <AppHeader />

    <!-- 主要內容區域 -->
    <main class="main-content">
      <!-- 英雄區域 -->
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">
              {{ $t('home.hero.title') }}
            </h1>
            <p class="hero-subtitle">
              {{ $t('home.hero.subtitle') }}
            </p>
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">97,131</span>
                <span class="stat-label">{{ $t('home.hero.stats.vehicles') }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">15,420</span>
                <span class="stat-label">{{ $t('home.hero.stats.users') }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">8,756</span>
                <span class="stat-label">{{ $t('home.hero.stats.deals') }}</span>
              </div>
            </div>
                         <div class="hero-actions">
               <el-button class="sell-car-btn" size="large" @click="handleSellCar">
                 <el-icon><Plus /></el-icon>
                 {{ $t('home.hero.sellCar') }}
               </el-button>
               <el-button class="browse-cars-btn" size="large" @click="handleBrowseCars">
                 <el-icon><Search /></el-icon>
                 {{ $t('home.hero.browseCars') }}
               </el-button>
             </div>
          </div>
          <div class="hero-image">
            <img src="/car.jpg" alt="Car" />
          </div>
        </div>
      </section>

      <!-- 分类卡片区域 -->
      <div class="category-cards">
        <div
          v-for="cat in categories"
          :key="cat.value"
          class="category-card"
          @click="goToCategory(cat.value)"
        >
          <div class="category-card-inner">
            <div class="category-icon-wrapper">
              <el-icon class="category-icon">
                <component :is="cat.icon" />
              </el-icon>
            </div>
            <div class="category-content">
              <h3 class="category-title">{{ cat.label }}</h3>
              <p class="category-description">{{ cat.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 精選車輛區域 -->
      <section class="featured-cars">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">{{ $t('home.featured.title') }}</h2>
            <el-button link @click="handleViewAll">
              {{ $t('home.featured.viewAll') }}
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
          <div class="cars-grid">
            <!-- 加载状态 -->
            <div v-if="loadingFeatured" class="loading-cars">
              <el-skeleton :rows="3" animated v-for="i in 4" :key="i" />
            </div>
            
            <!-- 车辆卡片 -->
            <div 
              v-else-if="featuredCars.length > 0"
              class="car-card" 
              v-for="car in featuredCars" 
              :key="car.id" 
              @click="handleCarClick(car)"
            >
              <div class="car-image">
                <img 
                  :src="car.images && car.images.length > 0 ? car.images[0].image_url : '/default-car.jpg'" 
                  :alt="`${car.car_brand} ${car.car_model}`" 
                  @error="handleImageError"
                  @load="handleImageLoad"
                  loading="lazy"
                />
                <div class="car-badge" v-if="car.vehicle_status === 1">精選</div>
              </div>
              <div class="car-info">
                <h3 class="car-name">{{ car.car_brand }} {{ car.car_model }}</h3>
                <p class="car-details">{{ car.year }} | {{ car.fuel_type }} | {{ formatSeats(car.seats) }}</p>
                <div class="car-price">
                  <template v-if="getFormattedPrice(car) === '价格面议'">
                    <span class="price">价格面议</span>
                  </template>
                  <template v-else>
                    <div class="price-container">
                      <span class="current-price">{{ getFormattedPrice(car).currentPrice }}</span>
                      <span v-if="getFormattedPrice(car).hasDiscount" class="original-price">
                        {{ getFormattedPrice(car).originalPrice }}
                      </span>
                      <span v-if="getFormattedPrice(car).hasDiscount" class="discount-badge">
                        -{{ getFormattedPrice(car).discountPercent }}%
                      </span>
                    </div>
                  </template>
                </div>
                <div class="car-contact">
                  <el-icon><Phone /></el-icon>
                  <span>明哥 98702065</span>
                </div>
                <!-- 额外信息 -->
                <div class="car-extra" v-if="car.transmission || car.engine_volume">
                  <span v-if="car.transmission" class="extra-item">{{ car.transmission }}</span>
                  <span v-if="car.engine_volume" class="extra-item">{{ car.engine_volume }}</span>
                </div>
              </div>
            </div>
            
            <!-- 无数据时显示 -->
            <div v-else class="no-featured-cars">
              <el-empty description="暂无精选车辆" />
            </div>
          </div>
        </div>
      </section>

      <!-- 最新上架區域 -->
      <section class="latest-cars">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">{{ $t('home.latest.title') }}</h2>
            <el-button link @click="handleViewAll">
              {{ $t('home.latest.viewAll') }}
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
          <div class="cars-grid">
            <!-- 加载状态 -->
            <div v-if="loadingLatest" class="loading-cars">
              <el-skeleton :rows="3" animated v-for="i in 4" :key="i" />
            </div>
            
            <!-- 车辆卡片 -->
            <div 
              v-else-if="latestCars.length > 0"
              class="car-card" 
              v-for="car in latestCars" 
              :key="car.id" 
              @click="handleCarClick(car)"
            >
              <div class="car-image">
                <img 
                  :src="car.images && car.images.length > 0 ? car.images[0].image_url : '/default-car.jpg'" 
                  :alt="`${car.car_brand} ${car.car_model}`" 
                  @error="handleImageError"
                  @load="handleImageLoad"
                  loading="lazy"
                />
                <div class="car-badge new">{{ $t('home.car.new') }}</div>
              </div>
              <div class="car-info">
                <h3 class="car-name">{{ car.car_brand }} {{ car.car_model }}</h3>
                <p class="car-details">{{ car.year }} | {{ car.fuel_type }} | {{ formatSeats(car.seats) }}</p>
                <div class="car-price">
                  <template v-if="getFormattedPrice(car) === '价格面议'">
                    <span class="price">价格面议</span>
                  </template>
                  <template v-else>
                    <div class="price-container">
                      <span class="current-price">{{ getFormattedPrice(car).currentPrice }}</span>
                      <span v-if="getFormattedPrice(car).hasDiscount" class="original-price">
                        {{ getFormattedPrice(car).originalPrice }}
                      </span>
                      <span v-if="getFormattedPrice(car).hasDiscount" class="discount-badge">
                        -{{ getFormattedPrice(car).discountPercent }}%
                      </span>
                    </div>
                  </template>
                </div>
                <div class="car-contact">
                  <el-icon><Phone /></el-icon>
                  <span>明哥 98702065</span>
                </div>
                <!-- 额外信息 -->
                <div class="car-extra" v-if="car.transmission || car.engine_volume">
                  <span v-if="car.transmission" class="extra-item">{{ car.transmission }}</span>
                  <span v-if="car.engine_volume" class="extra-item">{{ car.engine_volume }}</span>
                </div>
              </div>
            </div>
            
            <!-- 无数据时显示 -->
            <div v-else class="no-latest-cars">
              <el-empty description="暂无最新上架车辆" />
            </div>
          </div>
        </div>
      </section>

      <!-- 查看更多车辆按钮区域 -->
      <section class="more-vehicles-section">
        <div class="container">
          <div class="more-vehicles-content">
            <h3 class="more-vehicles-title">{{ $t('home.moreVehicles.title') }}</h3>
            <p class="more-vehicles-subtitle">{{ $t('home.moreVehicles.subtitle') }}</p>
            <el-button 
              type="primary" 
              size="large" 
              class="more-vehicles-btn"
              @click="handleBrowseCars"
            >
              <el-icon><Search /></el-icon>
              {{ $t('home.moreVehicles.button') }}
            </el-button>
          </div>
        </div>
      </section>

      <!-- 服務特色區域 -->
      <section class="services">
        <div class="container">
          <h2 class="section-title">{{ $t('home.services.title') }}</h2>
          <div class="services-grid">
            <div class="service-card" v-for="service in services" :key="service.id">
              <div class="service-icon">
                <el-icon><component :is="service.icon" /></el-icon>
              </div>
              <h3 class="service-title">{{ service.title }}</h3>
              <p class="service-description">{{ service.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 頁腳 -->
    <AppFooter />

    <!-- 车辆详情抽屉 -->
    <VehicleDetailDrawer
      :visible="detailDrawerVisible"
      :data="detailData"
      :loading="detailLoading"
      :error="detailError"
      :image-index="detailImageIndex"
      @close="detailDrawerVisible = false"
      @reload="reloadDetail"
      @update:image-index="detailImageIndex = $event"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Van, Box, Bicycle, Star, Search, Phone, Lock, Setting, User, Wallet, ChatDotRound, Message, Close, Calendar, Tickets, Cpu, Plus, ArrowRight } from '@element-plus/icons-vue'
import { vehicleAPI } from '@/utils/api'
import VehicleDetailDrawer from '@/components/VehicleDetailDrawer.vue'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

// 注册组件
const components = {
  VehicleDetailDrawer
}

// 搜索相关状态
const searchKeyword = ref('')



// 事件處理

const handleSellCar = () => {
  ElMessage.success(t('messages.sellCarFeature'))
}

const handleBrowseCars = () => {
  router.push({ path: '/search' })
}

const handleSearch = () => {
  ElMessage.success(t('messages.searchFeature'))
}

// 精選車輛數據
const featuredCars = ref([])
const loadingFeatured = ref(false)

// 最新上架車輛數據
const latestCars = ref([])
const loadingLatest = ref(false)

// 服務特色數據
const services = computed(() => [
  {
    id: 1,
    icon: 'Lock',
    title: t('home.services.safety.title'),
    description: t('home.services.safety.description')
  },
  {
    id: 2,
    icon: 'Setting',
    title: t('home.services.inspection.title'),
    description: t('home.services.inspection.description')
  },
  {
    id: 3,
    icon: 'User',
    title: t('home.services.support.title'),
    description: t('home.services.support.description')
  },
  {
    id: 4,
    icon: 'Wallet',
    title: t('home.services.payment.title'),
    description: t('home.services.payment.description')
  }
])

const handleViewAll = () => {
  router.push({ path: '/search' })
}

// 格式化价格显示
const formatPrice = (currentPrice, originalPrice) => {
  if (!currentPrice || currentPrice === '0.00') return '价格面议'
  
  // 默认显示现价
  const formattedCurrentPrice = `HKD$${parseFloat(currentPrice).toLocaleString()}`
  
  // 如果有原价且原价大于现价，返回折扣信息
  if (originalPrice && originalPrice !== '0.00' && parseFloat(originalPrice) > parseFloat(currentPrice)) {
    return {
      currentPrice: formattedCurrentPrice,
      originalPrice: `HKD$${parseFloat(originalPrice).toLocaleString()}`,
      hasDiscount: true,
      discountPercent: Math.round(((parseFloat(originalPrice) - parseFloat(currentPrice)) / parseFloat(originalPrice)) * 100)
    }
  }
  
  // 没有折扣时，只返回现价
  return {
    currentPrice: formattedCurrentPrice,
    hasDiscount: false
  }
}

// 获取格式化的价格信息
const getFormattedPrice = (car) => {
  return formatPrice(car.current_price, car.original_price)
}

// 格式化座位数显示
const formatSeats = (seats) => {
  if (!seats) return '座位未知'
  
  // 提取数字部分
  const seatNumber = seats.match(/\d+/)
  if (seatNumber) {
    return `${seatNumber[0]}座`
  }
  
  return seats
}

// 图片加载失败处理
const handleImageError = (event) => {
  // 防止无限循环：如果当前已经是默认图片，则不再设置
  if (event.target.src.includes('default-car.jpg')) {
    return
  }
  
  // 设置默认图片
  event.target.src = '/default-car.jpg'
  event.target.classList.add('image-error')
  
  // 添加标记，防止重复处理
  event.target.dataset.errorHandled = 'true'
}

// 图片加载成功处理
const handleImageLoad = (event) => {
  event.target.classList.remove('image-error')
  // 移除错误处理标记
  delete event.target.dataset.errorHandled
}

// 获取精选车辆数据
const fetchFeaturedCars = async () => {
  loadingFeatured.value = true
  try {
    const response = await vehicleAPI.getFeaturedVehicles()
    featuredCars.value = response.vehicles || []
    console.log('精选车辆获取成功:', featuredCars.value)
  } catch (error) {
    console.error('获取精选车辆失败:', error)
    ElMessage.error('获取精选车辆失败，请稍后重试')
  } finally {
    loadingFeatured.value = false
  }
}

// 获取最新上架车辆数据
const fetchLatestCars = async () => {
  loadingLatest.value = true
  try {
    const response = await vehicleAPI.getLatestVehicles()
    latestCars.value = response.vehicles || []
    console.log('最新上架车辆获取成功:', latestCars.value)
  } catch (error) {
    console.error('获取最新上架车辆失败:', error)
    ElMessage.error('获取最新上架车辆失败，请稍后重试')
  } finally {
    loadingLatest.value = false
  }
}

// 移动端检测
const isMobile = ref(window.innerWidth <= 768)

// 详情抽屉相关状态
const detailDrawerVisible = ref(false)
const detailLoading = ref(false)
const detailError = ref('')
const detailData = ref(null)
const detailImageIndex = ref(0)
const currentDetailId = ref(null)

const handleCarClick = (car) => {
  // 打开详情弹出层
  openDetailDrawer(car.vehicle_id)
}

// 打开详情抽屉（复用Search.vue的逻辑）
const openDetailDrawer = async (vehicleId) => {
  console.log('🏠 Home页面 - 开始加载车辆详情，ID:', vehicleId)
  detailDrawerVisible.value = true
  detailLoading.value = true
  detailError.value = ''
  detailData.value = null
  detailImageIndex.value = 0
  currentDetailId.value = vehicleId
  try {
    console.log('📡 Home页面 - 调用API获取车辆详情...')
    // 兼容不同返回结构
    const res = await vehicleAPI.getVehicleDetail(vehicleId)
    console.log('✅ Home页面 - API响应原始数据:', res)
    
    const rawData = res?.vehicle || res
    console.log('🔄 Home页面 - 提取的原始数据:', rawData)
    
    // 数据格式转换，适配VehicleDetailDrawer组件
    if (rawData) {
      const transformedData = {
        id: rawData.id,
        vehicle_id: rawData.vehicle_id,
        brand: rawData.car_brand || rawData.brand,
        model: rawData.car_model || rawData.model,
        vehicle_type: rawData.vehicle_type_text || rawData.car_category || rawData.vehicle_type,
        fuel_type: rawData.fuel_type,
        seats: rawData.seats,
        year: rawData.year,
        description: rawData.description,
        current_price: rawData.current_price,
        original_price: rawData.original_price,
        contact_phone: rawData.phone_number || rawData.contact_phone,
        images: rawData.images?.map(img => typeof img === 'string' ? img : img.image_url) || []
      }
      console.log('🎯 Home页面 - 转换后的数据:', transformedData)
      // 使用JSON深拷贝避免响应式问题
      detailData.value = JSON.parse(JSON.stringify(transformedData))
      console.log('✨ Home页面 - 详情数据设置完成，抽屉应该显示数据:', detailData.value)
    } else {
      console.warn('⚠️ Home页面 - 没有获取到有效的车辆数据')
      detailError.value = '没有获取到车辆数据'
    }
  } catch (e) {
    console.error('❌ Home页面 - 加载车辆详情失败:', e)
    detailError.value = e?.message || '加载失败'
  } finally {
    detailLoading.value = false
    console.log('🏁 Home页面 - 详情加载完成，loading状态:', detailLoading.value, '错误状态:', detailError.value)
  }
}

// 重新加载详情
const reloadDetail = () => {
  if (currentDetailId.value) openDetailDrawer(currentDetailId.value)
}

// 格式化价格（港币格式）
const formatCurrencyHKD = (price) => {
  if (!price || price === 0) return '价格面议'
  return `¥${(price / 10000).toFixed(1)}万`
}

// 分类数据
const categories = computed(() => [
  { 
    label: t('home.category.private'), 
    value: 'private', 
    icon: 'Van',
    description: t('home.category.privateDesc')
  },
  { 
    label: t('home.category.van'), 
    value: 'van', 
    icon: 'Van',
    description: t('home.category.vanDesc')
  },
  { 
    label: t('home.category.truck'), 
    value: 'truck', 
    icon: 'Box',
    description: t('home.category.truckDesc')
  },
  { 
    label: t('home.category.motorcycle'), 
    value: 'motorcycle', 
    icon: 'Bicycle',
    description: t('home.category.motorcycleDesc')
  },
  { 
    label: t('home.category.classic'), 
    value: 'classic', 
    icon: 'Star',
    description: t('home.category.classicDesc')
  },
  { 
    label: t('home.category.searchMore'), 
    value: 'search-more', 
    icon: 'Search',
    description: t('home.category.searchMoreDesc')
  }
])

function goToCategory(category) {
  if (category === 'search-more') {
    router.push({ path: '/search' })
  } else {
    router.push({ path: '/search', query: { category } })
  }
}

const handleUserCommand = (command) => {
  if (command === 'logout') {
    userStore.logout()
    ElMessage.success(t('messages.logoutSuccess'))
    router.push('/')
  }
}

// 确保页面滚动到顶部
const scrollToTop = () => {
  window.scrollTo(0, 0)
  // 兼容移动端
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

onMounted(() => {
  scrollToTop()
  fetchFeaturedCars()
  fetchLatestCars()
})

onActivated(() => {
  scrollToTop()
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/global.scss';
.home {
  min-height: 100vh;
  background-color: $background-color-base;
  padding-top: 80px; /* 为固定的 AppHeader 留出空间 */
}

/* 移动端隐藏滚动条但保持滚动功能 */
@media (max-width: 768px) {
  :global(html) {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }
  
  :global(html::-webkit-scrollbar) {
    display: none; /* Chrome, Safari and Opera */
  }
  
  :global(body) {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }
  
  :global(body::-webkit-scrollbar) {
    display: none; /* Chrome, Safari and Opera */
  }
}

.hero {
          background: linear-gradient(135deg, $primary-color 0%, color-mix(in srgb, $primary-color 85%, black) 100%);
  color: white;
  padding: $spacing-xxl 0;

  .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-xl;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding-left: $spacing-lg;
    padding-right: $spacing-lg;
  }

  .hero-content {
    .hero-title {
      font-size: 48px;
      font-weight: bold;
      margin-bottom: $spacing-md;
      line-height: 1.2;
    }

    .hero-subtitle {
      font-size: $font-size-large;
      margin-bottom: $spacing-lg;
      opacity: 0.9;
    }

    .hero-stats {
      display: flex;
      gap: $spacing-lg;
      margin-bottom: $spacing-xl;

      .stat-item {
        text-align: center;

        .stat-number {
          display: block;
          font-size: 24px;
          font-weight: bold;
        }

        .stat-label {
          font-size: $font-size-small;
          opacity: 0.8;
        }
      }
    }

         .hero-actions {
       display: flex;
       gap: $spacing-md;
       
       .sell-car-btn {
         background: #ffffff;
         color: $primary-color;
         border: 2px solid #ffffff;
         font-weight: 600;
         
         &:hover {
           background: rgba(255, 255, 255, 0.9);
           border-color: rgba(255, 255, 255, 0.9);
           color: color-mix(in srgb, $primary-color 85%, black);
         }
         
         .el-icon {
           color: $primary-color;
         }
       }
       
       .browse-cars-btn {
         background: transparent;
         color: #ffffff;
         border: 2px solid #ffffff;
         font-weight: 600;
         
         &:hover {
           background: rgba(255, 255, 255, 0.1);
           border-color: #ffffff;
           color: #ffffff;
         }
         
         .el-icon {
           color: #ffffff;
         }
       }
     }
  }

  .hero-image {
    img {
      width: 100%;
      height: 400px;
      object-fit: cover;
      border-radius: $border-radius-large;
    }
  }
}

.category-cards {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: $spacing-sm;
  margin: $spacing-xxl 0;
  padding: 0 $spacing-md;
}

.category-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, $primary-color 0%, #1976d2 100%);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    
    &::before {
      transform: scaleX(1);
    }
    
    .category-icon-wrapper {
      background: linear-gradient(135deg, $primary-color 0%, #1976d2 100%);
      transform: scale(1.1);
      
      .category-icon {
        color: white;
        transform: scale(1.2);
      }
    }
    

  }
}

.category-card-inner {
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: $spacing-md;
  min-height: 120px;
}

.category-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.category-icon {
  font-size: 28px;
  color: $primary-color;
  transition: all 0.3s ease;
}

.category-content {
  .category-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: $spacing-xs;
    line-height: 1.4;
  }
  
  .category-description {
    font-size: 0.8rem;
    color: $text-secondary;
    line-height: 1.4;
  }
}



.search-section {
  background: white;
  padding: $spacing-xl 0;
  margin-top: -$spacing-lg;
  position: relative;
  z-index: 10;

  .search-box {
    background: white;
    border-radius: $border-radius-large;
    box-shadow: $box-shadow-light;
    padding: $spacing-lg;
  }

  .vehicle-tabs {
    :deep(.el-tabs__header) {
      margin-bottom: $spacing-lg;
    }
  }

  .search-content {
    display: flex;
    gap: $spacing-md;
    align-items: center;
    flex-wrap: wrap;

    .search-input {
      flex: 1;
      min-width: 200px;
    }

    .search-select {
      min-width: 150px;
    }
  }
}

// 響應式設計
@include mobile {
  .hero {
    padding: $spacing-lg 0;

    .container {
      grid-template-columns: 1fr;
      text-align: center;
      gap: $spacing-lg;
      padding-left: $spacing-md;
      padding-right: $spacing-md;
    }

    .hero-title {
      font-size: 28px;
      line-height: 1.3;
    }

    .hero-subtitle {
      font-size: $font-size-medium;
    }

    .hero-stats {
      justify-content: center;
      gap: $spacing-md;
      flex-wrap: wrap;

      .stat-item {
        .stat-number {
          font-size: 20px;
        }

        .stat-label {
          font-size: $font-size-extra-small;
        }
      }
    }

                   .hero-actions {
        justify-content: center;
        flex-wrap: nowrap;
        gap: $spacing-sm;
        
        .el-button {
          flex: 1;
          min-width: 0;
          white-space: nowrap;
        }
        
        .sell-car-btn {
          background: #ffffff;
          color: $primary-color;
          border: 2px solid #ffffff;
          font-weight: 600;
          
          &:hover {
            background: rgba(255, 255, 255, 0.9);
            border-color: rgba(255, 255, 255, 0.9);
            color: color-mix(in srgb, $primary-color 85%, black);
          }
          
          .el-icon {
            color: $primary-color;
          }
        }
        
        .browse-cars-btn {
          background: transparent;
          color: #ffffff;
          border: 2px solid #ffffff;
          font-weight: 600;
          
          &:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: #ffffff;
            color: #ffffff;
          }
          
          .el-icon {
            color: #ffffff;
          }
        }
      }

    .hero-image {
      img {
        height: 250px;
      }
    }
  }

  .search-content {
    flex-direction: column;
    align-items: stretch;

    .search-input,
    .search-select {
      width: 100%;
    }
  }

  .category-grid {
    padding: 0 $spacing-md;
    gap: 8px;
  }

  .featured-cars,
  .latest-cars {
    .container {
      padding-left: $spacing-md;
      padding-right: $spacing-md;
    }
  }

  .services {
    .container {
      padding-left: $spacing-md;
      padding-right: $spacing-md;
    }
  }


}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-xl;
}

.section-title {
  font-size: $font-size-extra-large;
  font-weight: bold;
  color: $text-primary;
  margin: 0;
}

.featured-cars,
.latest-cars {
  background: #f8f9fa;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: $spacing-xl;
    background: white;
    border-radius: $border-radius-large;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.06);
  }

  .cars-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: $spacing-lg;
  }

  .loading-cars {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: $spacing-lg;
  }

  .no-featured-cars,
  .no-latest-cars {
    grid-column: 1 / -1;
    text-align: center;
    padding: $spacing-xl 0;
  }
}

.car-card {
  background: white;
  border-radius: $border-radius-large;
  overflow: hidden;
  box-shadow: $box-shadow-light;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $box-shadow-dark;
  }

  .car-image {
    position: relative;
    height: 185px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .car-badge {
      position: absolute;
      top: $spacing-sm;
      right: $spacing-sm;
      background: $primary-color;
      color: white;
      padding: 4px 8px;
      border-radius: $border-radius-base;
      font-size: $font-size-extra-small;
      font-weight: bold;

      &.new {
        background: $success-color;
      }
    }
  }

  .car-info {
    padding: $spacing-md;

    .car-name {
      font-size: $font-size-medium;
      font-weight: bold;
      color: $text-primary;
      margin-bottom: $spacing-xs;
      line-height: 1.3;
    }

    .car-details {
      color: $text-secondary;
      font-size: $font-size-small;
      margin-bottom: $spacing-sm;
    }

    .car-price {
      margin-bottom: $spacing-sm;

      .price {
        font-size: $font-size-large;
        font-weight: bold;
        color: $primary-color;
      }

      .price-container {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }

      .current-price {
        font-size: 18px;
        font-weight: 600;
        color: $primary-color;
        line-height: 1.3;
      }

      .original-price {
        font-size: 14px;
        color: #909399;
        text-decoration: line-through;
        line-height: 1.3;
      }

      .discount-badge {
        background: #f56c6c;
        color: white;
        padding: 2px 6px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
        line-height: 1.2;
      }

      .price-unit {
        font-size: $font-size-small;
        color: $text-secondary;
        margin-left: 4px;
      }
    }

    .car-contact {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: #909399;
      margin-bottom: $spacing-sm;

      .el-icon {
        font-size: 16px;
      }
    }
    
    .car-extra {
      display: flex;
      gap: 6px;
      margin-top: 8px;
      flex-wrap: wrap;
      
      .extra-item {
        background: #f5f7fa;
        color: #606266;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 11px;
        border: 1px solid #e4e7ed;
        white-space: nowrap;
      }
    }
  }
}

.services {
  background: white;
  padding: $spacing-xxl 0;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding-left: $spacing-lg;
    padding-right: $spacing-lg;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: $spacing-xl;
  }

  .service-card {
    text-align: center;
    padding: $spacing-xl;

    .service-icon {
      font-size: 48px;
      color: $primary-color;
      margin-bottom: $spacing-md;
    }

    .service-title {
      font-size: $font-size-large;
      font-weight: bold;
      color: $text-primary;
      margin-bottom: $spacing-sm;
    }

    .service-description {
      color: $text-secondary;
      line-height: 1.6;
    }
  }
}



// 響應式設計
@include mobile {
  .cars-grid,
  .loading-cars {
    grid-template-columns: 1fr;
  }

  .car-price {
    .price-container {
      gap: 6px;
    }

    .current-price {
      font-size: 16px;
    }

    .original-price {
      font-size: 13px;
    }

    .discount-badge {
      font-size: 10px;
      padding: 1px 5px;
    }
  }

  .services-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-md;
  }

  .service-card {
    padding: $spacing-lg;
    
    .service-icon {
      font-size: 36px;
      margin-bottom: $spacing-sm;
    }
    
    .service-title {
      font-size: $font-size-medium;
      margin-bottom: $spacing-xs;
    }
    
    .service-description {
      font-size: $font-size-small;
      line-height: 1.5;
    }
  }

  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

// 分类区域响应式设计
@media (max-width: 1200px) {
  .category-cards {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 900px) {
  .category-cards {
    grid-template-columns: repeat(3, 1fr);
    gap: $spacing-xs;
    padding: 0 $spacing-xs;
  }
  
  .category-card-inner {
    padding: $spacing-md;
    gap: $spacing-sm;
  }
  
  .category-icon-wrapper {
    width: 56px;
    height: 56px;
  }
  
  .category-icon {
    font-size: 24px;
  }
}

@media (max-width: 600px) {
  .category-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-xs;
  }
  
  .category-card {
    &:hover {
      transform: translateY(-4px);
    }
  }
  
  .category-card-inner {
    padding: $spacing-sm;
    gap: $spacing-xs;
    min-height: 100px;
  }
  
  .category-icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 12px;
  }
  
  .category-icon {
    font-size: 20px;
  }
  
  .category-content {
    .category-title {
      font-size: 0.95rem;
    }
    
    .category-description {
      font-size: 0.7rem;
    }
  }
}

@media (max-width: 320px) {
  .category-cards {
    grid-template-columns: 1fr;
  }
}

// 服务特色区域移动端优化
@media (max-width: 768px) {
  .services {
    .services-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: $spacing-md;
    }
    
    .service-card {
      padding: $spacing-md;
      
      .service-icon {
        font-size: 32px;
        margin-bottom: $spacing-sm;
      }
      
      .service-title {
        font-size: $font-size-medium;
        margin-bottom: $spacing-xs;
      }
      
      .service-description {
        font-size: $font-size-small;
        line-height: 1.4;
      }
    }
  }
}

@media (max-width: 480px) {
  .services {
    .services-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: $spacing-sm;
    }
    
    .service-card {
      padding: $spacing-sm;
      
      .service-icon {
        font-size: 28px;
        margin-bottom: $spacing-xs;
      }
      
      .service-title {
        font-size: $font-size-small;
        margin-bottom: $spacing-xs;
      }
      
      .service-description {
        font-size: $font-size-extra-small;
        line-height: 1.3;
      }
    }
  }
}

// 查看更多车辆按钮区域样式
.more-vehicles-section {
  padding: $spacing-xl 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  margin-top: 0;
  // margin-top: $spacing-lg;
  
  .more-vehicles-content {
    text-align: center;
    padding: $spacing-xl $spacing-md;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #e2e8f0;
    
    .more-vehicles-title {
      font-size: $font-size-large;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: $spacing-sm;
      line-height: 1.4;
    }
    
    .more-vehicles-subtitle {
      font-size: $font-size-medium;
      color: $text-secondary;
      margin-bottom: $spacing-xl;
      line-height: 1.5;
    }
    
    .more-vehicles-btn {
      padding: 12px 32px;
      font-size: $font-size-medium;
      font-weight: 500;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(64, 158, 255, 0.4);
      }
      
      .el-icon {
        margin-right: 8px;
        font-size: 16px;
      }
    }
  }
}

// 移动端优化
@media (max-width: 768px) {
  .more-vehicles-section {
    padding: $spacing-lg 0;
    margin-top: $spacing-md;
    
    .more-vehicles-content {
      padding: $spacing-lg $spacing-md;
      border-radius: 12px;
      
      .more-vehicles-title {
        font-size: $font-size-medium;
      }
      
      .more-vehicles-subtitle {
        font-size: $font-size-small;
        margin-bottom: $spacing-lg;
      }
      
      .more-vehicles-btn {
        width: 100%;
        max-width: 280px;
        padding: 14px 24px;
        font-size: $font-size-medium;
      }
    }
  }
}

@media (max-width: 480px) {
  .more-vehicles-section {
    .more-vehicles-content {
      padding: $spacing-md;
      
      .more-vehicles-title {
        font-size: $font-size-small;
        margin-bottom: $spacing-xs;
      }
      
      .more-vehicles-subtitle {
        font-size: $font-size-extra-small;
        margin-bottom: $spacing-md;
      }
      
      .more-vehicles-btn {
        padding: 12px 20px;
        font-size: $font-size-small;
      }
    }
  }
}


</style>