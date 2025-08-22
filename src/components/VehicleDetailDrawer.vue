<template>
  <el-drawer
    :model-value="visible"
    :direction="isMobile ? 'btt' : 'rtl'"
    :size="drawerSize"
    :show-close="false"
    class="vehicle-detail-drawer"
    @close="$emit('close')"
  >
    <template #header>
      <div class="drawer-header">
        <div class="title-area">
          <div class="title-line">
            <h3 class="vehicle-title">{{ props.data ? `${props.data.brand || ''} ${props.data.model || ''}`.trim() || '车辆详情' : '车辆详情' }}</h3>
            <span v-if="props.data?.year" class="vehicle-year">{{ props.data.year }}</span>
          </div>
          <div v-if="props.data && (props.data.vehicle_type || props.data.fuel_type)" class="subtitle">
            <span>{{ props.data.vehicle_type || '未知' }}</span>
            <span class="dot">·</span>
            <span>{{ props.data.fuel_type || '未知' }}</span>
          </div>
        </div>
        <div class="action-area">
          <button class="floating-close" @click="$emit('close')" aria-label="关闭">
            <el-icon><Close /></el-icon>
          </button>
        </div>
      </div>
    </template>
    <div class="vehicle-drawer-content">
      <!-- 抽屉内容 -->
      <div class="drawer-body">
        <!-- 调试信息 -->
        <div style="display: none;">
          {{ console.log('🎭 VehicleDetailDrawer 渲染状态:', { loading: props.loading, error: props.error, data: !!props.data, hasData: !!props.data && !props.loading }) }}
        </div>
        <!-- 加载状态 -->
        <div v-if="props.loading && !props.data" class="loading-container">
          <div class="loading-header">
            <el-skeleton-item variant="h3" style="width: 200px; height: 24px;" />
            <el-skeleton-item variant="text" style="width: 150px; height: 16px; margin-top: 8px;" />
          </div>
          <div class="loading-content">
            <!-- 移动端加载布局 -->
            <div v-if="isMobile" class="mobile-loading-layout">
              <el-skeleton-item variant="image" style="width: 100%; height: 190px; border-radius: 8px; margin-bottom: 16px;" />
              <div class="loading-info">
                <el-skeleton-item variant="h3" style="width: 80%; height: 20px; margin-bottom: 12px;" />
                <el-skeleton-item variant="text" style="width: 60%; height: 14px; margin-bottom: 8px;" />
                <el-skeleton-item variant="text" style="width: 40%; height: 16px; margin-bottom: 8px;" />
                <el-skeleton-item variant="text" style="width: 70%; height: 14px; margin-bottom: 16px;" />
                <div class="loading-specs">
                  <div v-for="i in 4" :key="i" class="loading-spec-item">
                    <el-skeleton-item variant="text" style="width: 100%; height: 40px; border-radius: 8px;" />
                  </div>
                </div>
              </div>
            </div>
            <!-- 桌面端加载布局 -->
            <div v-else class="desktop-loading-layout">
              <div class="loading-image-section">
                <el-skeleton-item variant="image" style="width: 100%; height: 280px; border-radius: 8px;" />
                <div class="loading-thumbs">
                  <div v-for="i in 4" :key="i" class="loading-thumb">
                    <el-skeleton-item variant="image" style="width: 72px; height: 48px; border-radius: 6px;" />
                  </div>
                </div>
              </div>
              <div class="loading-info-section">
                <el-skeleton-item variant="h3" style="width: 80%; height: 20px; margin-bottom: 12px;" />
                <el-skeleton-item variant="text" style="width: 60%; height: 14px; margin-bottom: 8px;" />
                <el-skeleton-item variant="text" style="width: 40%; height: 16px; margin-bottom: 16px;" />
                <div class="loading-specs">
                  <div v-for="i in 5" :key="i" class="loading-spec-item">
                    <el-skeleton-item variant="text" style="width: 100%; height: 40px; border-radius: 8px;" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



        <!-- 错误状态：仅当存在错误且没有可用数据时展示 -->
        <div v-else-if="!!props.error && !props.data" class="error-container">
          <el-empty :description="typeof props.error === 'string' ? props.error : '加载失败'">
            <el-button type="primary" @click="$emit('reload')">重新加载</el-button>
          </el-empty>
        </div>

        <!-- 数据展示 -->
        <div v-else-if="props.data" class="detail-content">
          <!-- 渐进式加载覆盖层 -->
          <div v-if="props.loading && props.data._isPreloaded" class="progressive-loading-overlay">
            <div class="progressive-loading-content">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span>正在加载详细信息...</span>
            </div>
          </div>
          
          <!-- 移动端布局（吸收 VehicleDetail.vue 风格） -->
          <div v-if="isMobile" class="mobile-detail-layout">
            <div class="image-block">
              <div class="image-container">
                <img
                  :src="currentImage"
                  :alt="props.data.brand + ' ' + props.data.model"
                  class="hero-image"
                  @load="handleImageLoad"
                  @error="handleImageError"
                />
                <div v-if="imageLoading" class="image-loading-overlay">
                  <el-icon class="is-loading"><Loading /></el-icon>
                </div>
              </div>
              <div class="thumbs" v-if="props.data.images && props.data.images.length > 1">
                <div
                  v-for="(img, idx) in props.data.images"
                  :key="idx"
                  class="thumb"
                  :class="{ active: idx === props.imageIndex }"
                  @click="$emit('update:imageIndex', idx)"
                >
                  <img :src="img" :alt="`${props.data.brand} ${props.data.model} 图片 ${idx + 1}`" @error="$event.target.src = '/default-car.jpg'" />
                </div>
              </div>
            </div>

            <div class="scroll-area">
              <el-card class="basic-info-card" shadow="never">
                <div class="price-section">
                  <div class="current-price">
                    <span class="price-label">现价</span>
                    <span class="price-value" :class="{ 'special-offer-price': props.data.is_special_offer === 1 }">
                      {{ formatCurrencyHKD(props.data.current_price) }}
                    </span>
                  </div>
                  <div v-if="shouldShowOriginalPrice" class="original-price">
                    <span class="price-label">原价</span>
                    <span class="price-value original">{{ formatCurrencyHKD(props.data.original_price) }}</span>
                    <span class="discount">省 {{ formatCurrencyHKD(Number(props.data.original_price) - Number(props.data.current_price)) }}</span>
                  </div>
                </div>

                <div class="specs-grid">
                  <div class="spec-item">
                    <span class="spec-label">车辆类型</span>
                    <span class="spec-value">{{ props.data.vehicle_type || '未知' }}</span>
                  </div>
                  <div class="spec-item" v-if="props.data.fuel_type">
                    <span class="spec-label">燃料类型</span>
                    <span class="spec-value">{{ props.data.fuel_type }}</span>
                  </div>
                  <div class="spec-item" v-if="props.data.seats">
                    <span class="spec-label">座位数</span>
                    <span class="spec-value">{{ props.data.seats }}</span>
                  </div>
                  <div class="spec-item" v-if="props.data.engine_volume">
                    <span class="spec-label">排量</span>
                    <span class="spec-value">{{ props.data.engine_volume }}</span>
                  </div>
                  <div class="spec-item" v-if="props.data.transmission">
                    <span class="spec-label">变速箱</span>
                    <span class="spec-value">{{ props.data.transmission }}</span>
                  </div>
                </div>

                <el-card v-if="props.data.description" class="desc-card" shadow="never">
                  <template #header>
                    <span>车辆描述</span>
                  </template>
                  <div class="desc">{{ props.data.description }}</div>
                </el-card>

                <div class="contact-section">
                  <h3>联系方式</h3>
                  <div class="contact-details">
                    <div class="contact-item">
                      <el-icon><Phone /></el-icon>
                      <span>{{ contactInfo.name }} {{ contactInfo.phone }}</span>
                    </div>
                  </div>
                  <div class="contact-buttons">
                    <el-button type="primary" class="contact-btn phone-btn" @click="handleCopyPhone">
                      <el-icon><Phone /></el-icon>
                      复制号码
                    </el-button>
                  </div>
                </div>
              </el-card>
            </div>
          </div>

          <!-- 桌面端布局（两栏，参考 VehicleDetail.vue） -->
          <div v-else class="detail-main">
            <div class="image-section">
              <div class="image-container">
                <img 
                  :src="currentImage" 
                  :alt="props.data.brand + ' ' + props.data.model" 
                  class="main-image" 
                  @load="handleImageLoad"
                  @error="handleImageError"
                />
                <div v-if="imageLoading" class="image-loading-overlay">
                  <el-icon class="is-loading"><Loading /></el-icon>
                </div>
              </div>

              <div class="thumbs" v-if="props.data.images && props.data.images.length > 1">
                <div v-for="(img, idx) in props.data.images" :key="idx" class="thumb" :class="{ active: idx === props.imageIndex }" @click="$emit('update:imageIndex', idx)">
                  <img :src="img" :alt="`${props.data.brand} ${props.data.model} 图片 ${idx + 1}`" @error="$event.target.src = '/default-car.jpg'" />
                </div>
              </div>

              <el-card v-if="props.data.description" class="desc-card desktop-only" shadow="never">
                <template #header>
                  <span>车辆描述</span>
                </template>
                <div class="desc">{{ props.data.description }}</div>
              </el-card>
            </div>

            <div class="info-section">
              <el-card class="basic-info-card" shadow="never">
                <div class="price-section">
                  <div class="current-price">
                    <span class="price-label">现价</span>
                    <span class="price-value" :class="{ 'special-offer-price': props.data.is_special_offer === 1 }">
                      {{ formatCurrencyHKD(props.data.current_price) }}
                    </span>
                  </div>
                  <div v-if="shouldShowOriginalPrice" class="original-price">
                    <span class="price-label">原价</span>
                    <span class="price-value original">{{ formatCurrencyHKD(props.data.original_price) }}</span>
                    <span class="discount">省 {{ formatCurrencyHKD(Number(props.data.original_price) - Number(props.data.current_price)) }}</span>
                  </div>
                </div>

                <div class="specs-grid">
                  <div class="spec-item">
                    <span class="spec-label">车辆类型</span>
                    <span class="spec-value">{{ props.data.vehicle_type || '未知' }}</span>
                  </div>
                  <div class="spec-item" v-if="props.data.fuel_type">
                    <span class="spec-label">燃料类型</span>
                    <span class="spec-value">{{ props.data.fuel_type }}</span>
                  </div>
                  <div class="spec-item" v-if="props.data.seats">
                    <span class="spec-label">座位数</span>
                    <span class="spec-value">{{ props.data.seats }}</span>
                  </div>
                  <div class="spec-item" v-if="props.data.engine_volume">
                    <span class="spec-label">排量</span>
                    <span class="spec-value">{{ props.data.engine_volume }}</span>
                  </div>
                  <div class="spec-item" v-if="props.data.transmission">
                    <span class="spec-label">变速箱</span>
                    <span class="spec-value">{{ props.data.transmission }}</span>
                  </div>
                </div>

                <div class="contact-section">
                  <h3>联系方式</h3>
                  <div class="contact-details">
                    <div class="contact-item">
                      <el-icon><Phone /></el-icon>
                      <span>{{ contactInfo.name }} {{ contactInfo.phone }}</span>
                    </div>
                  </div>
                  <div class="contact-buttons">
                    <el-button type="primary" class="contact-btn phone-btn" @click="handleCopyPhone">
                      <el-icon><Phone /></el-icon>
                      复制号码
                    </el-button>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </div>

        <!-- 无数据状态 -->
        <div v-else class="no-data-container">
          <el-empty description="暂无数据">
            <el-button type="primary" @click="$emit('reload')">重新加载</el-button>
          </el-empty>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Close, Van, Phone, Calendar, Cpu, User as UserIcon, ChatDotRound } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: [Boolean, String, Object, null],
    default: false
  },
  imageIndex: {
    type: Number,
    default: 0
  }
})

// 监听props变化，添加调试信息
watch(() => props.visible, (newVal) => {
  console.log('🎭 VehicleDetailDrawer - visible变化:', newVal)
})

watch(() => props.data, (newVal) => {
  console.log('📊 VehicleDetailDrawer - data变化:', newVal)
})

watch(() => props.loading, (newVal) => {
  console.log('⏳ VehicleDetailDrawer - loading变化:', newVal)
})

watch(() => props.error, (newVal) => {
  console.log('🚨 VehicleDetailDrawer - error变化:', newVal)
})

const emit = defineEmits(['close', 'reload', 'update:imageIndex', 'contact'])

// 用户状态管理
const userStore = useUserStore()

// 判断是否为指定用户（mingge）
const isMinggeUser = computed(() => {
  // 确保用户状态已完全初始化
  if (!userStore.isInitialized || userStore.isInitializing) {
    return false
  }
  const result = userStore.isLoggedIn && userStore.userInfo?.username === 'mingge'
  console.log('👤 用户状态检查:', {
    isLoggedIn: userStore.isLoggedIn,
    username: userStore.userInfo?.username,
    isMinggeUser: result,
    isInitialized: userStore.isInitialized,
    isInitializing: userStore.isInitializing
  })
  return result
})

// 是否显示原价的计算属性
const shouldShowOriginalPrice = computed(() => {
  // 必须有原价且原价大于现价
  if (!props.data?.original_price || Number(props.data.original_price) <= Number(props.data.current_price)) {
    return false
  }
  
  // 特价车辆：只有明哥用户能看到原价
  if (props.data?.is_special_offer === 1) {
    return isMinggeUser.value
  }
  
  // 普通车辆：所有用户都能看到原价
  return true
})

// 联系信息计算属性
const contactInfo = computed(() => {
  // 特价车辆：只有明哥用户能看到原始联系信息，其他用户都显示硬编码
  if (props.data?.is_special_offer === 1) {
    // 特价车辆逻辑
    if (isMinggeUser.value) {
      // 明哥用户看特价车原始联系信息
      return {
        name: props.data.contact_name || '明哥',
        phone: props.data.phone_number || '98702065'
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
    if (isMinggeUser.value && props.data) {
      // 明哥用户看真实联系信息
      return {
        name: props.data.contact_name || '明哥',
        phone: props.data.phone_number || '98702065'
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

// 移动端检测
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// 图片加载状态
const imageLoading = ref(true)

// 图片加载处理
const handleImageLoad = () => {
  imageLoading.value = false
}

const handleImageError = (event) => {
  imageLoading.value = false
  event.target.src = '/default-car.jpg'
}

// 监听图片索引变化，重置加载状态
watch(() => props.imageIndex, () => {
  imageLoading.value = true
})

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

// 抽屉尺寸
const drawerSize = computed(() => {
  return isMobile.value ? '85%' : '60%'
})

// 当前图片
const currentImage = computed(() => {
  console.log('🖼️ VehicleDetailDrawer - 计算当前图片:', {
    data: props.data,
    images: props.data?.images,
    imageIndex: props.imageIndex
  })
  if (!props.data?.images?.length) {
    console.log('🖼️ 没有图片，使用默认图片')
    return '/default-car.jpg'
  }
  const result = props.data.images[props.imageIndex] || props.data.images[0] || '/default-car.jpg'
  console.log('🖼️ 当前图片结果:', result)
  return result
})

// 图片预加载
const preloadImages = (images) => {
  if (!images || !Array.isArray(images)) return
  
  images.forEach(imgSrc => {
    if (imgSrc && imgSrc !== '/default-car.jpg') {
      const img = new Image()
      img.src = imgSrc
    }
  })
}

// 监听数据变化，预加载图片
watch(() => props.data?.images, (newImages) => {
  if (newImages && newImages.length > 0) {
    // 延迟预加载，避免阻塞主线程
    setTimeout(() => {
      preloadImages(newImages)
    }, 100)
  }
}, { immediate: true })



// 格式化价格
const formatPrice = (price) => {
  if (!price) return '面议'
  return `¥${parseFloat(price).toFixed(1)}万`
}

// HKD 价格格式化（与 VehicleDetail 页面一致）
const formatCurrencyHKD = (value) => {
  // 如果已经是格式化的字符串，直接返回
  if (typeof value === 'string' && value.includes('HKD$98,000（包含车+两地牌）')) {
    return value
  }
  
  if (value === undefined || value === null || value === '' || Number(value) === 0) {
    return '价格面议'
  }
  
  // 特价车辆的价格显示逻辑
  if (props.data?.is_special_offer === 1) {
    // 明哥用户看到真实价格
    if (isMinggeUser.value) {
      return `HKD$${Number(value).toLocaleString()}`
    }
    // 非明哥用户看到固定特价信息
    return 'HKD$98,000（包含车+两地牌）'
  }
  
  // 非特价车辆的正常价格显示
  return `HKD$${Number(value).toLocaleString()}`
}

// 仅复制号码
const handleCopyPhone = async () => {
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
</script>

<style scoped>
/* 全局覆盖Element Plus的drawer header样式 */
:global(.el-drawer__header) {
  margin-bottom: 0 !important;
}

@media (max-width: 768px) {
  :global(.el-drawer__header) {
    margin-bottom: 0 !important;
  }
}
/* 详情抽屉样式 */
.vehicle-detail-drawer {
  :deep(.el-drawer__header) {
    display: block;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    position: sticky;
    top: 0;
    z-index: 10;
    background: #fff;
  }
  
  :deep(.el-drawer__body) {
  padding: 0;
  
  /* 移动端隐藏滚动条但保持滚动功能 */
  @media (max-width: 768px) {
    /* 隐藏 Webkit 浏览器的滚动条 */
    &::-webkit-scrollbar {
      display: none;
    }
    
    /* 隐藏 Firefox 的滚动条 */
    scrollbar-width: none;
    
    /* 隐藏 IE 的滚动条 */
    -ms-overflow-style: none;
  }
}
}

.vehicle-drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  position: relative;
  /* 预留关闭按钮空间，避免标题文本被覆盖 */
  padding-right: 64px;
}

.drawer-header .title-area h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.drawer-header .title-area .title-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.drawer-header .title-area .vehicle-year {
  background: #409eff;
  color: #fff;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 12px;
}

.drawer-header .title-area .subtitle {
  margin-top: 2px;
  font-size: 12px;
  color: #909399;
}

.drawer-header .title-area .subtitle .dot {
  margin: 0 4px;
}

.drawer-header .action-area .close-btn.prominent {
  border: 1px solid #409eff;
  background: #409eff;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

.drawer-header .action-area .close-btn.prominent .el-icon {
  font-size: 20px;
  color: #fff;
}

/* 悬浮关闭按钮（避免与标题挤在一起） */
.floating-close {
  position: absolute;
  top: 12px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #409eff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  cursor: pointer;
}
.floating-close .el-icon { font-size: 20px; }

/* 移动端同样保持在抽屉头部内，不悬浮在遮罩上 */

.drawer-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 确保flex子元素可以收缩 */
}

.detail-content {
  position: relative; /* 为渐进式加载覆盖层定位 */
}

.loading-container, .error-container {
  padding: 20px;
  text-align: center;
}

/* 渐进式加载覆盖层 */
.progressive-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.progressive-loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(64, 158, 255, 0.15);
  min-width: 200px;
  text-align: center;
}

.progressive-loading-content .el-icon {
  font-size: 28px;
  color: #409eff;
  animation: spin 1s linear infinite;
}

.progressive-loading-content span {
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 加载状态样式 */
.loading-container {
  .loading-header {
    margin-bottom: 20px;
  }
  
  .loading-content {
    .mobile-loading-layout {
      .loading-info {
        .loading-specs {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          margin-top: 16px;
        }
      }
    }
    
    .desktop-loading-layout {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 16px;
      
      .loading-image-section {
        .loading-thumbs {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }
      }
      
      .loading-info-section {
        .loading-specs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 8px;
          margin-top: 16px;
        }
      }
    }
  }
}

.detail-main {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 16px;
  overflow: hidden; /* 防止内容溢出 */
}

.image-container {
  position: relative;
  width: 100%;
  height: 280px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.image-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
}

.image-loading-overlay .el-icon {
  font-size: 24px;
  color: #409eff;
}

.thumbs {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  max-width: 100%; /* 限制最大宽度 */
}

.thumbs::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.thumb {
  width: 72px;
  height: 48px;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb.active {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64,158,255,0.3);
}

.below-thumbs {
  margin-top: 12px;
  width: 100%;
}

/* 新的右侧信息区风格 */
.image-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0; /* 允许flex子元素收缩 */
  overflow: hidden; /* 防止内容溢出 */
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0; /* 允许flex子元素收缩 */
  overflow: hidden; /* 防止内容溢出 */
}

.basic-info-card {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .vehicle-title {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #303133;
  }
  .vehicle-year {
    background: #409eff;
    color: #fff;
    padding: 2px 8px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 12px;
  }
}

.price-section {
  margin-bottom: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #79bbff, #409eff);
  border-radius: 12px;
  color: #fff;
}

.current-price .price-label {
  display: block;
  opacity: 0.9;
  margin-bottom: 4px;
}

.current-price .price-value {
  font-size: 22px;
  font-weight: 700;
}

  /* 特价车样式由全局样式处理 */

.original-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.original-price .price-value.original {
  text-decoration: line-through;
  opacity: 0.95;
}

.original-price .discount {
  background: rgba(255,255,255,0.18);
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 600;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
  margin-bottom: 12px;
  overflow: hidden; /* 防止内容溢出 */
}

.specs-grid .spec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.specs-grid .spec-label {
  color: #606266;
  font-size: 13px;
}

.specs-grid .spec-value {
  color: #303133;
  font-weight: 600;
}

.desc-card, .contact-card {
  margin-bottom: 16px;
}

.desc-card .desc {
  line-height: 1.6;
  color: #606266;
}

.contact-card .contact {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #333;
  cursor: pointer;
}

.contact-card .contact:hover {
  color: #409eff;
}

.contact-card .contact .el-icon {
  color: #409eff;
  font-size: 18px;
}

/* 移动端样式 */
.mobile-detail-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.mobile-detail-layout .image-block { flex-shrink: 0; }

.mobile-detail-layout .image-block .image-container {
  position: relative;
  width: 100%;
  height: 190px;
  min-height: 190px;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #f5f5f5;
  overflow: hidden;
}

.mobile-detail-layout .image-block .hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.mobile-detail-layout .scroll-area {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  min-height: 0; /* 确保可以收缩 */
  height: 0; /* 强制使用flex布局的高度 */
  
  /* 隐藏滚动条但保持滚动功能 */
  /* 隐藏 Webkit 浏览器的滚动条 */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* 隐藏 Firefox 的滚动条 */
  scrollbar-width: none;
  
  /* 隐藏 IE 的滚动条 */
  -ms-overflow-style: none;
}

/* 联系区复用 VehicleDetail 风格 */
.contact-section h3 {
  margin: 0 0 8px 0;
  color: #303133;
}
.contact-section .contact-details {
  margin-bottom: 12px;
}
.contact-section .contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #303133;
}
.contact-section .contact-buttons {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.contact-section .contact-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.contact-section .contact-btn .el-icon {
  font-size: 16px;
}

.contact-section .whatsapp-btn {
  background: #25d366;
  border-color: #25d366;
}

.contact-section .whatsapp-btn:hover {
  background: #128c7e;
  border-color: #128c7e;
}

.mobile-detail-layout .info-block {
  padding: 8px 0;
}

@media (max-width: 768px) {
  .vehicle-detail-drawer :deep(.el-drawer__header) {
    margin-bottom: 0 !important; /* 移动端去掉默认的margin-bottom */
  }
  
  /* 更强的选择器优先级 */
  .el-drawer.vehicle-detail-drawer .el-drawer__header {
    margin-bottom: 0 !important;
  }
  
  .detail-main {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .specs-grid {
    grid-template-columns: 1fr;
  }
  
  .main-image {
    height: 200px;
  }
  
  .thumb {
    width: 60px;
    height: 40px;
    flex: 0 0 60px; /* 防止缩略图被压缩，确保完整显示 */
  }
  
  /* 移动端加载覆盖层优化 */
  .progressive-loading-content {
    padding: 24px 20px;
    min-width: 180px;
    border-radius: 12px;
  }
  
  .progressive-loading-content .el-icon {
    font-size: 24px;
  }
  
  .progressive-loading-content span {
    font-size: 13px;
  }
}
</style>