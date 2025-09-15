<template>
  <div class="special-offer-page">
    <AppHeader />
    
    <!-- 全局加载指示器 -->
    <div v-if="loading" class="global-loading-overlay">
      <div class="loading-spinner">
        <el-icon class="spinner-icon"><Loading /></el-icon>
        <p class="loading-text">正在加载特价车辆数据...</p>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <!-- 页面标题区域 -->
      <section class="page-header">
        <div class="container">
          <h1 class="page-title">{{ $t('specialOffer.title') }}</h1>
          <p class="page-subtitle">{{ $t('specialOffer.subtitle') }}</p>
        </div>
      </section>

      <!-- 特价车辆列表区域 -->
      <section class="special-offer-cars">
        <div class="container">
          <div class="cars-grid">
            <!-- 加载状态 -->
            <div v-if="loading" class="loading-cars">
              <el-skeleton :rows="3" animated v-for="i in 6" :key="i" />
            </div>
            
            <!-- 车辆卡片 -->
            <div 
              v-else-if="specialOfferCars.length > 0"
              class="car-card" 
              v-for="car in specialOfferCars" 
              :key="car.id" 
              @click="handleCarClick(car)"
            >
              <div class="car-image">
                <img 
                  :src="getCarImageUrl(car)" 
                  :alt="`${car.car_brand} ${car.car_model}`" 
                  @error="handleImageError"
                  @load="handleImageLoad"
                  loading="lazy"
                />
                <div class="car-badge special-offer">
                  <el-icon><Star /></el-icon>
                </div>
              </div>
              <div class="car-info">
                <h3 class="car-name">{{ car.car_brand }} {{ car.car_model }}</h3>
                <p class="car-details">{{ car.year }} | {{ car.fuel_type }} | {{ formatSeats(car.seats) }}</p>
                <div class="car-price special-offer-price">
                  <span class="current-price">{{ getFormattedPrice(car).currentPrice }}</span>
                </div>
                <div class="car-contact">
                  <el-icon><Phone /></el-icon>
                  <span v-if="car.is_special_offer === 1">明哥 98702065</span>
                  <span v-else-if="isMinggeUser">{{ car.contact_name || '明哥' }} {{ car.phone_number || '98702065' }}</span>
                  <span v-else>明哥 98702065</span>
                </div>
                <!-- 额外信息 -->
                <div class="car-extra" v-if="car.transmission || car.engine_volume">
                  <span v-if="car.transmission" class="extra-item">{{ car.transmission }}</span>
                  <span v-if="car.engine_volume" class="extra-item">{{ car.engine_volume }}</span>
                </div>
              </div>
            </div>
            
            <!-- 无数据时显示 -->
            <div v-else class="no-special-offer-cars">
              <el-empty description="暂无特价车辆" />
            </div>
          </div>
        </div>
      </section>
    </main>

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
import { ref, onMounted, onActivated, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import AppHeader from '@/components/AppHeader.vue'
import { Star, Phone, Loading } from '@element-plus/icons-vue'
import { vehicleAPI } from '@/utils/api'
import { getImageUrl } from '@/config/api'
import VehicleDetailDrawer from '@/components/VehicleDetailDrawer.vue'
import { useUserStore } from '@/stores/user'

const { t } = useI18n()

// 用户状态管理
const userStore = useUserStore()

// 判断是否为指定用户（mingge）
const isMinggeUser = computed(() => {
  // 确保用户状态已完全初始化
  if (!userStore.isInitialized || userStore.isInitializing) {
    return false
  }
  return userStore.isLoggedIn && userStore.userInfo?.username === 'mingge'
})

// 特价车辆数据
const specialOfferCars = ref([])
const loading = ref(false)

// 详情抽屉相关状态
const detailDrawerVisible = ref(false)
const detailLoading = ref(false)
const detailError = ref('')
const detailData = ref(null)
const detailImageIndex = ref(0)
const currentDetailId = ref(null)

// 获取特价车辆数据
const fetchSpecialOfferCars = async () => {
  loading.value = true
  try {
    const response = await vehicleAPI.getSpecialOfferVehicles()
    specialOfferCars.value = response.vehicles || []
    console.log('特价车辆获取成功:', specialOfferCars.value)
  } catch (error) {
    console.error('获取特价车辆失败:', error)
    ElMessage.error('获取特价车辆失败，请稍后重试')
  } finally {
    loading.value = false
  }
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

// 获取车辆图片URL
const getCarImageUrl = (car) => {
  const imageUrl = car.images && car.images.length > 0
    ? car.images[0].image_url
    : '/default-car.jpg'
  return getImageUrl(imageUrl)
}

// 格式化价格显示
const formatPrice = (currentPrice, originalPrice) => {
  // 如果已经是格式化的字符串，直接返回
  if (typeof currentPrice === 'string' && currentPrice.includes('HKD$98,000（包含车+两地牌）')) {
    return {
      currentPrice: currentPrice,
      hasDiscount: false
    }
  }
  
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
  // 特价车辆的价格显示逻辑
  if (car.is_special_offer === 1) {
    // 明哥用户看到真实价格
    if (isMinggeUser.value) {
      return formatPrice(car.current_price, car.original_price)
    }
    // 非明哥用户看到固定特价信息
    return {
      currentPrice: 'HKD$98,000（包含车+两地牌）',
      hasDiscount: false
    }
  }
  
  // 非特价车辆的正常价格显示
  return formatPrice(car.current_price, car.original_price)
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

const handleCarClick = (car) => {
  // 打开详情弹出层
  openDetailDrawer(car.vehicle_id)
}

// 打开详情抽屉（复用Home.vue的逻辑）
const openDetailDrawer = async (vehicleId) => {
  console.log('🎯 SpecialOffer页面 - 开始加载车辆详情，ID:', vehicleId)
  detailDrawerVisible.value = true
  detailLoading.value = true
  detailError.value = ''
  detailData.value = null
  detailImageIndex.value = 0
  currentDetailId.value = vehicleId
  try {
    console.log('📡 SpecialOffer页面 - 调用API获取车辆详情...')
    // 兼容不同返回结构
    const res = await vehicleAPI.getVehicleDetail(vehicleId)
    console.log('✅ SpecialOffer页面 - API响应原始数据:', res)
    
    const rawData = res?.vehicle || res
    console.log('🔄 SpecialOffer页面 - 提取的原始数据:', rawData)
    
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
        is_special_offer: rawData.is_special_offer, // 添加特价标识字段
        // 根据用户权限和特价标识过滤价格信息
        current_price: isMinggeUser.value ? rawData.current_price : (rawData.is_special_offer === 1 ? 'HKD$98,000（包含车+两地牌）' : rawData.current_price),
        original_price: isMinggeUser.value ? rawData.original_price : (rawData.is_special_offer === 1 ? null : rawData.original_price),
        // 根据用户权限和特价标识过滤联系信息
        contact_name: isMinggeUser.value ? rawData.contact_name : '明哥',
        phone_number: isMinggeUser.value ? rawData.phone_number : '98702065',
        contact_phone: isMinggeUser.value ? (rawData.phone_number || rawData.contact_phone) : '98702065',
        images: rawData.images?.map(img => getImageUrl(typeof img === 'string' ? img : img.image_url)) || []
      }
      console.log('🎯 SpecialOffer页面 - 转换后的数据:', transformedData)
      // 使用JSON深拷贝避免响应式问题
      detailData.value = JSON.parse(JSON.stringify(transformedData))
      console.log('✨ SpecialOffer页面 - 详情数据设置完成，抽屉应该显示数据:', detailData.value)
    } else {
      console.warn('⚠️ SpecialOffer页面 - 没有获取到有效的车辆数据')
      detailError.value = '没有获取到车辆数据'
    }
  } catch (e) {
    console.error('❌ SpecialOffer页面 - 加载车辆详情失败:', e)
    detailError.value = e?.message || '加载失败'
  } finally {
    detailLoading.value = false
    console.log('🏁 SpecialOffer页面 - 详情加载完成，loading状态:', detailLoading.value, '错误状态:', detailError.value)
  }
}

// 重新加载详情
const reloadDetail = () => {
  if (currentDetailId.value) openDetailDrawer(currentDetailId.value)
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
  fetchSpecialOfferCars()
})

onActivated(() => {
  scrollToTop()
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/global.scss';

.special-offer-page {
  min-height: 100vh;
  background-color: $background-color-base;
  padding-top: 80px; /* 为固定的 AppHeader 留出空间 */
}

.main-content {
  padding-top: 0;
}

.page-header {
  background: linear-gradient(135deg, $primary-color 0%, color-mix(in srgb, $primary-color 85%, black) 100%);
  color: white;
  padding: $spacing-xl 0;
  text-align: center;

  .page-title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: $spacing-sm;
    line-height: 1.2;
  }

  .page-subtitle {
    font-size: $font-size-medium;
    opacity: 0.9;
    margin: 0;
  }
}

.special-offer-cars {
  background: #f8f9fa;
  padding: $spacing-lg 0;

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

  .no-special-offer-cars {
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

      &.special-offer {
        background: #f56c6c;
        color: white;
        padding: 6px;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        .el-icon {
          font-size: 16px;
        }
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

      .current-price {
        font-size: 18px;
        font-weight: 600;
        color: $primary-color;
        line-height: 1.3;
      }
    }

    // 特价车样式由全局样式处理

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

// 特价车样式由全局样式处理

/* 全局加载指示器 */
.global-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
  
  .loading-spinner {
    text-align: center;
    
    .spinner-icon {
      font-size: 48px;
      color: #409eff;
      animation: rotate 1s linear infinite;
      margin-bottom: 16px;
    }
    
    .loading-text {
      font-size: 16px;
      color: #606266;
      margin: 0;
      font-weight: 500;
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 移动端响应式设计
@include mobile {
  .page-header {
    padding: $spacing-lg 0;

    .page-title {
      font-size: 24px;
    }

    .page-subtitle {
      font-size: $font-size-small;
    }
  }

  .special-offer-cars {
    .container {
      padding: $spacing-md 10px !important;
    }
  }

  .cars-grid,
  .loading-cars {
    grid-template-columns: 1fr;
  }

  .car-price {
    .current-price {
      font-size: 16px;
    }
  }
}
</style>
