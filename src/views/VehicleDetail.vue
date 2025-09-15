<template>
  <div class="vehicle-detail">
    <AppHeader />
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <el-result icon="error" :title="$t('vehicleDetail.error.title')" :sub-title="error">
        <template #extra>
          <el-button type="primary" @click="$router.go(-1)">{{ $t('common.goBack') }}</el-button>
        </template>
      </el-result>
    </div>
    
    <!-- 车辆详情内容 -->
    <div v-else-if="vehicle" class="detail-content">
      <!-- 面包屑导航 -->
      <div class="breadcrumb-container">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">{{ $t('nav.home') }}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/search' }">{{ $t('nav.search') }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ vehicle.car_brand }} {{ vehicle.car_model }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      
      <!-- 主要内容区域 -->
      <div class="main-container">
        <!-- 左侧：图片展示 -->
        <div class="image-section">
          <div class="main-image">
            <el-image
              :src="currentImage"
              :alt="`${vehicle.car_brand} ${vehicle.car_model}`"
              fit="cover"
            >
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                  <span>{{ $t('common.noImage') }}</span>
                </div>
              </template>
            </el-image>
            
            <!-- 移动端悬浮返回按钮 -->
            <div class="mobile-back-btn" @click="goBack">
              <el-icon><ArrowLeft /></el-icon>
            </div>
            
            <!-- 车辆状态标签 -->
            <div class="status-badge" :class="vehicle.vehicle_status === 1 ? 'available' : 'sold'">
              {{ vehicle.vehicle_status_text }}
            </div>
          </div>
          
          <!-- 缩略图列表 -->
          <div v-if="vehicle.images && vehicle.images.length > 1" class="thumbnail-list">
            <div
              v-for="(image, index) in vehicle.images"
              :key="image.id"
              class="thumbnail-item"
              :class="{ active: index === currentImageIndex }"
              @click="currentImageIndex = index"
            >
              <el-image :src="getImageUrl(image.image_url)" fit="cover">
                <template #error>
                  <div class="thumbnail-error">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </div>
          </div>
          
          <!-- 车辆描述 (PC端显示在缩略图下方) -->
          <el-card v-if="vehicle.description" class="description-card desktop-only">
            <template #header>
              <h3>{{ $t('vehicleDetail.description') }}</h3>
            </template>
            <p class="description-text">{{ vehicle.description }}</p>
          </el-card>
        </div>
        
        <!-- 右侧：车辆信息 -->
        <div class="info-section">
          <!-- 基本信息卡片 -->
          <el-card class="basic-info-card">
            <template #header>
              <div class="card-header">
                <h1 class="vehicle-title">{{ vehicle.car_brand }} {{ vehicle.car_model }}</h1>
                <span class="vehicle-year">{{ vehicle.year }}</span>
              </div>
            </template>
            
            <!-- 价格信息 -->
            <div class="price-section">
              <div class="current-price">
                <span class="price-label">{{ $t('vehicleDetail.currentPrice') }}</span>
                <span class="price-value" :class="{ 'special-offer-price': vehicle.is_special_offer === 1 }">{{ getFormattedPrice(vehicle).currentPrice }}</span>
              </div>
              <div v-if="getFormattedPrice(vehicle).hasDiscount" class="original-price">
                <span class="price-label">{{ $t('vehicleDetail.originalPrice') }}</span>
                <span class="price-value original">{{ getFormattedPrice(vehicle).originalPrice }}</span>
                <span class="discount">{{ $t('vehicleDetail.discount', { amount: getFormattedPrice(vehicle).discountAmount }) }}</span>
              </div>
            </div>
            
            <!-- 基本参数 -->
            <div class="specs-grid">
              <div class="spec-item">
                <span class="spec-label">{{ $t('vehicleDetail.vehicleType') }}</span>
                <span class="spec-value">{{ vehicle.vehicle_type_text }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">{{ $t('vehicleDetail.fuelType') }}</span>
                <span class="spec-value">{{ vehicle.fuel_type }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">{{ $t('vehicleDetail.seats') }}</span>
                <span class="spec-value">{{ vehicle.seats }}{{ $t('vehicleDetail.seatsUnit') }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">{{ $t('vehicleDetail.engineVolume') }}</span>
                <span class="spec-value">{{ vehicle.engine_volume }}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">{{ $t('vehicleDetail.transmission') }}</span>
                <span class="spec-value">{{ vehicle.transmission }}</span>
              </div>
              <div v-if="vehicle.extra_fields?.mileage" class="spec-item">
                <span class="spec-label">{{ $t('vehicleDetail.mileage') }}</span>
                <span class="spec-value">{{ vehicle.extra_fields.mileage }}{{ $t('vehicleDetail.mileageUnit') }}</span>
              </div>
              <div v-if="vehicle.extra_fields?.color" class="spec-item">
                <span class="spec-label">{{ $t('vehicleDetail.color') }}</span>
                <span class="spec-value">{{ vehicle.extra_fields.color }}</span>
              </div>
            </div>
            
            <!-- 联系信息 -->
            <div class="contact-section">
              <h3>{{ $t('vehicleDetail.contactInfo') }}</h3>
              <div class="contact-details">
                <div class="contact-item">
                  <el-icon><User /></el-icon>
                  <span>{{ contactInfo.name }}</span>
                </div>
                <div class="contact-item">
                  <el-icon><Phone /></el-icon>
                  <span>{{ contactInfo.phone }}</span>
                </div>
              </div>
              <el-button type="primary" size="large" class="contact-btn" @click="handleContact">
                <el-icon><ChatDotRound /></el-icon>
                {{ $t('vehicleDetail.contactSeller') }}
              </el-button>
            </div>
          </el-card>
          
          <!-- 车辆描述 (移动端显示在右侧) -->
          <el-card v-if="vehicle.description" class="description-card mobile-only">
            <template #header>
              <h3>{{ $t('vehicleDetail.description') }}</h3>
            </template>
            <p class="description-text">{{ vehicle.description }}</p>
          </el-card>
          
          <!-- 特色配置 -->
          <el-card v-if="vehicle.extra_fields?.features && vehicle.extra_fields.features.length" class="features-card">
            <template #header>
              <h3>{{ $t('vehicleDetail.features') }}</h3>
            </template>
            <div class="features-list">
              <el-tag
                v-for="feature in vehicle.extra_fields.features"
                :key="feature"
                class="feature-tag"
                type="info"
              >
                {{ feature }}
              </el-tag>
            </div>
          </el-card>
          

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Picture, User, Phone, ChatDotRound, ArrowLeft } from '@element-plus/icons-vue'
import AppHeader from '@/components/AppHeader.vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { getImageUrl } from '@/config/api'

export default {
  name: 'VehicleDetail',
  components: {
    AppHeader,
    Picture,
    User,
    Phone,
    ChatDotRound,
    ArrowLeft
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()
    
    const loading = ref(true)
    const error = ref(null)
    const vehicle = ref(null)
    const currentImageIndex = ref(0)
    
    // 计算属性
    const currentImage = computed(() => {
      if (!vehicle.value?.images || vehicle.value.images.length === 0) {
        return getImageUrl('/default-car.jpg')
      }
      const imageUrl = vehicle.value.images[currentImageIndex.value]?.image_url || '/default-car.jpg'
      return getImageUrl(imageUrl)
    })
    
    const imageList = computed(() => {
      if (!vehicle.value?.images) return [getImageUrl('/default-car.jpg')]
      return vehicle.value.images.map(img => getImageUrl(img.image_url))
    })
    
    // 用户状态管理
    const userStore = useUserStore()
    
    // 明哥用户检测
    const isMinggeUser = computed(() => {
      // 确保用户状态已完全初始化
      if (!userStore.isInitialized || userStore.isInitializing) {
        return false
      }
      return userStore.isLoggedIn && userStore.userInfo?.username === 'mingge'
    })
    
    // 联系信息计算属性
    const contactInfo = computed(() => {
      // 特价车辆：只有明哥用户能看到原始联系信息，其他用户都显示硬编码
      if (vehicle.value?.is_special_offer === 1) {
        // 特价车辆逻辑
        if (isMinggeUser.value) {
          // 明哥用户看特价车原始联系信息
          return {
            name: vehicle.value.contact_name || '明哥',
            phone: vehicle.value.phone_number || '98702065'
          }
        } else {
          // 非明哥用户看特价车硬编码信息
          return {
            name: '明哥',
            phone: '98702065'
          }
        }
      } else {
        // 非特价车辆：任何非明哥用户都显示硬编码
        if (isMinggeUser.value && vehicle.value) {
          // 明哥用户看真实联系信息
          return {
            name: vehicle.value.contact_name || '明哥',
            phone: vehicle.value.phone_number || '98702065'
          }
        } else {
          // 非明哥用户显示硬编码信息
          return {
            name: '明哥',
            phone: '98702065'
          }
        }
      }
    })
    
    // 方法
    const fetchVehicleDetail = async () => {
      try {
        loading.value = true
        error.value = null
        
        const vehicleId = route.params.id
        if (!vehicleId) {
          throw new Error(t('vehicleDetail.error.invalidId'))
        }
        
        // 调用真实API
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
        const response = await fetch(`${apiBaseUrl}/vehicles/${vehicleId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(t('vehicleDetail.error.notFound'))
          }
          throw new Error(t('vehicleDetail.error.serverError'))
        }
        
        const data = await response.json()
        if (data.code !== 200) {
          throw new Error(data.message || t('vehicleDetail.error.serverError'))
        }
        
        vehicle.value = data.data
        loading.value = false
        
      } catch (err) {
        error.value = err.message
        loading.value = false
      }
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
          discountAmount: `HKD$${(parseFloat(originalPrice) - parseFloat(currentPrice)).toLocaleString()}`,
          hasDiscount: true
        }
      }
      
      // 没有折扣的情况
      return {
        currentPrice: formattedCurrentPrice,
        hasDiscount: false
      }
    }
    
    // 获取格式化的价格信息
    const getFormattedPrice = (car) => {
      // 特价车辆的价格显示逻辑
      if (car?.is_special_offer === 1) {
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
    
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const { locale } = useI18n()
      return new Date(dateString).toLocaleDateString(locale.value)
    }
    
    const handleContact = async () => {
      try {
        const phone = contactInfo.value.phone
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(phone)
        } else {
          const input = document.createElement('input')
          input.value = phone
          document.body.appendChild(input)
          input.select()
          document.execCommand('copy')
          document.body.removeChild(input)
        }
        ElMessage.success('手机号已复制')
      } catch (e) {
        ElMessage.error(`复制失败，请手动复制：${contactInfo.value.phone}`)
      }
    }
    
    const goBack = () => {
      router.go(-1)
    }
    
    // 生命周期
    onMounted(() => {
      fetchVehicleDetail()
    })
    
    return {
      loading,
      error,
      vehicle,
      currentImageIndex,
      currentImage,
      imageList,
      contactInfo,
      getFormattedPrice,
      formatDate,
      handleContact,
      goBack
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.vehicle-detail {
  min-height: 100vh;
  background-color: $background-color-light;
}

.loading-container {
  padding: $spacing-xl;
  max-width: 1200px;
  margin: 0 auto;
}

.error-container {
  padding: $spacing-xl;
  max-width: 600px;
  margin: 0 auto;
}

.detail-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px $spacing-lg $spacing-lg;
}

.breadcrumb-container {
  margin-top: $spacing-md;
  margin-bottom: $spacing-lg;
  
  .el-breadcrumb {
    font-size: 1rem;
    font-weight: 500;
  }
}

.main-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-xl;
  align-items: start;
}

// 图片区域
.image-section {
  .main-image {
    position: relative;
    margin-bottom: $spacing-md;
    border-radius: $border-radius-lg;
    overflow: hidden;
    box-shadow: $box-shadow-base;
    
    .el-image {
      width: 100%;
      height: 360px;
      display: block;
    }
    
    .image-slot {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: $text-secondary;
      background-color: $background-color-light;
      
      .el-icon {
        font-size: 3rem;
        margin-bottom: $spacing-sm;
      }
    }
    
    .mobile-back-btn {
      position: fixed;
      top: 80px;
      left: $spacing-md;
      width: 40px;
      height: 40px;
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 50%;
      display: none;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 1000;
      
      .el-icon {
        color: white;
        font-size: 1.2rem;
      }
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.8);
        transform: scale(1.1);
      }
    }
    
    .status-badge {
      position: absolute;
      top: $spacing-md;
      right: $spacing-md;
      padding: $spacing-xs $spacing-sm;
      border-radius: $border-radius-lg;
      font-weight: 600;
      font-size: 0.9rem;
      
      &.available {
        background-color: $success-color;
        color: white;
      }
      
      &.sold {
        background-color: $danger-color;
        color: white;
      }
    }
  }
  
  .thumbnail-list {
    display: flex;
    gap: $spacing-sm;
    overflow-x: auto;
    padding: $spacing-xs 0;
    
    .thumbnail-item {
      flex-shrink: 0;
      width: 80px;
      height: 50px;
      border-radius: $border-radius-lg;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: $primary-color;
      }
      
      &.active {
        border-color: $primary-color;
        box-shadow: $box-shadow-light;
      }
      
      .el-image {
        width: 100%;
        height: 100%;
      }
      
      .thumbnail-error {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        background-color: $background-color-light;
        color: $text-secondary;
      }
    }
  }
}

// 信息区域
.info-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.basic-info-card {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .vehicle-title {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 700;
      color: $text-primary;
    }
    
    .vehicle-year {
      background-color: #409eff;
      color: white;
      padding: 4px 8px;
      border-radius: 8px;
      font-weight: 600;
    }
  }
}

.price-section {
  margin-bottom: $spacing-lg;
  padding: $spacing-lg;
  background: linear-gradient(135deg, $primary-light, $primary-color);
  border-radius: $border-radius-lg;
  color: white;
  
  .current-price {
    margin-bottom: $spacing-sm;
    
    .price-label {
      display: block;
      font-size: 0.9rem;
      opacity: 0.9;
      margin-bottom: $spacing-xs;
    }
    
    .price-value {
      font-size: 2.2rem;
      font-weight: 700;
      
      // 特价车样式由全局样式处理
    }
  }
  
  .original-price {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: 0.9rem;
    
    .price-value.original {
      text-decoration: line-through;
      opacity: 0.8;
    }
    
    .discount {
      background-color: rgba(255, 255, 255, 0.2);
      padding: $spacing-xs $spacing-sm;
      border-radius: $border-radius-sm;
      font-weight: 600;
    }
  }
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
  
  .spec-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-sm $spacing-md;
      background-color: $background-color-light;
      border-radius: $border-radius-lg;
    
    .spec-label {
      color: $text-secondary;
      font-size: 0.9rem;
    }
    
    .spec-value {
      font-weight: 600;
      color: $text-primary;
    }
  }
}

.contact-section {
  h3 {
    margin: 0 0 $spacing-md 0;
    color: $text-primary;
  }
  
  .contact-details {
    margin-bottom: $spacing-lg;
    
    .contact-item {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      margin-bottom: $spacing-sm;
      color: $text-primary;
      
      .el-icon {
        color: $primary-color;
      }
    }
  }
  
  .contact-btn {
    width: 100%;
    height: 48px;
    font-size: 1.1rem;
    font-weight: 600;
  }
}

.description-card {
  .description-text {
    line-height: 1.6;
    color: $text-primary;
    margin: 0;
  }
}

.features-card {
  .features-list {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
    
    .feature-tag {
      font-size: 0.9rem;
    }
  }
}

.update-info {
  text-align: center;
  color: $text-secondary;
  font-size: 0.85rem;
  padding-top: $spacing-md;
  border-top: 1px solid $border-color-base;
}

// 响应式显示控制
.desktop-only {
  display: block;
}

.mobile-only {
  display: none;
}

// 响应式设计
@media (max-width: 900px) {
  .main-container {
    grid-template-columns: 1fr;
    gap: $spacing-lg;
  }
  
  .detail-content {
    padding: $spacing-md;
  }
  
  .image-section .main-image .el-image {
    height: 280px;
  }
  
  .specs-grid {
    grid-template-columns: 1fr;
  }
  
  // 移动端显示控制
  .desktop-only {
    display: none;
  }
  
  .mobile-only {
    display: block;
  }
  
  // 移动端显示返回按钮
  .image-section .main-image .mobile-back-btn {
    display: flex;
  }
  
  .detail-content {
    padding: 60px $spacing-md $spacing-md;
  }
}

@media (max-width: 600px) {
  .detail-content {
    padding: $spacing-sm;
  }
  
  .basic-info-card .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-sm;
    
    .vehicle-title {
      font-size: 1.5rem;
    }
  }
  
  .price-section {
    padding: $spacing-md;
    
    .current-price .price-value {
      font-size: 1.8rem;
    }
  }
  
  .thumbnail-list {
    .thumbnail-item {
      width: 60px;
      height: 45px;
    }
  }
}
</style>