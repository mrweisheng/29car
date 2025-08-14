<template>
  <div class="search-page">
    <AppHeader />

    <!-- 搜索内容区域 -->
    <div class="search-content">
      <!-- 左侧筛选条件（桌面端） -->
      <div class="filters desktop-filters">
        <!-- 分类筛选 -->
        <div class="filter-section">
          <h3>{{ $t('search.filters.category') }}</h3>
          <div class="filter-options">
            <el-button
              :type="selectedCategory === 'all' ? 'primary' : 'default'"
              @click="selectCategory('all')"
              class="filter-btn"
              :class="{ 'is-selected': selectedCategory === 'all' }"
            >
              <el-icon><Grid /></el-icon>
              {{ $t('search.filters.allVehicles') }}
            </el-button>
            <el-button
              v-for="category in categories"
              :key="category.value"
              :type="selectedCategory === category.value ? 'primary' : 'default'"
              @click="selectCategory(category.value)"
              class="filter-btn"
              :class="{ 'is-selected': selectedCategory === category.value }"
            >
              <el-icon><component :is="category.icon" /></el-icon>
              {{ category.label }}
            </el-button>
          </div>
        </div>

        <!-- 品牌筛选（桌面端） -->
        <div class="filter-section">
          <h3>{{ $t('search.filters.brand') }}</h3>
          <div class="filter-content">
            <el-select
              v-model="selectedBrand"
              :placeholder="$t('search.filters.selectBrand')"
              @change="selectBrand"
              class="brand-select"
              clearable
            >
                                 <el-option
                     v-for="brand in brands"
                     :key="brand.brand"
                     :label="brand.brand"
                     :value="brand.brand"
                   />
            </el-select>
          </div>
        </div>

        <!-- 价格和年份筛选（桌面端） -->
        <div class="price-year-wrapper">
          <div class="filter-section price-year-section">
            <h3>{{ $t('search.filters.priceRangeTitle') }}</h3>
            <div class="filter-content">
              <el-select
                v-model="selectedPriceRange"
                :placeholder="$t('search.filters.selectPriceRange')"
                @change="selectPriceRange"
                class="price-range-select"
                clearable
              >
                <el-option
                  v-for="range in priceRanges"
                  :key="range.value"
                  :label="range.label"
                  :value="range.value"
                />
              </el-select>
            </div>
          </div>

          <div class="filter-section price-year-section">
            <h3>{{ $t('search.filters.year') }}</h3>
            <div class="filter-content">
              <el-select
                v-model="selectedYear"
                :placeholder="$t('search.filters.selectYear')"
                @change="selectYear"
                class="year-select"
                clearable
              >
                <el-option
                  v-for="year in availableYears"
                  :key="year"
                  :label="year.toString()"
                  :value="year"
                />
              </el-select>
            </div>
          </div>
        </div>

        <!-- 重置按钮 -->
        <div class="filter-section">
          <el-button 
            type="default" 
            @click="resetFilters"
            class="reset-btn"
          >
            {{ $t('search.filters.resetFilters') }}
          </el-button>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="results">
        <!-- 移动端搜索和筛选容器 -->
        <div ref="mobileSearchFilterContainer" class="mobile-search-filter-container" :style="{ display: isMobile ? 'block' : 'none' }">
          <!-- 上方搜索框 -->
          <div class="search-section">
            <el-input
              v-model="searchKeyword"
              :placeholder="$t('search.placeholder')"
              class="search-input"
              clearable
              @keyup.enter="doSearch"
            >
              <template #append>
                <el-button type="primary" @click="doSearch">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>

          <!-- 移动端筛选栏 -->
          <div class="mobile-filter-bar">
            <div class="filter-item" @click="openFilterDrawer">
              <span class="filter-label">分类</span>
              <span class="filter-value">{{ getCategoryDisplayName() }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <div class="filter-item" @click="openFilterDrawer">
              <span class="filter-label">品牌</span>
              <span class="filter-value">{{ getBrandDisplayName() }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <div class="filter-item" @click="openFilterDrawer">
              <span class="filter-label">价格</span>
              <span class="filter-value">{{ getPriceDisplayName() }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <div class="filter-item" @click="openFilterDrawer">
              <span class="filter-label">年份</span>
              <span class="filter-value">{{ getYearDisplayName() }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
          </div>
        </div>

        <!-- 桌面端搜索框 -->
        <div class="search-section desktop-search" :style="{ display: isMobile ? 'none' : 'block' }">
          <el-input
            v-model="searchKeyword"
            :placeholder="$t('search.placeholder')"
            class="search-input"
            clearable
            @keyup.enter="doSearch"
          >
            <template #append>
              <el-button type="primary" @click="doSearch">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>

        <!-- 结果标题（固定） -->
        <div class="results-header" :style="isMobile ? { marginTop: `${mobileHeaderHeight}px` } : {}">
          <h2>{{ getResultsTitle() }}</h2>
          <p class="results-count">
            {{ filteredCars.length }} {{ $t('search.resultsFound') }}
            <span v-if="pagination.total_count > 0" class="pagination-info">
              (第 {{ pagination.current_page }} 页，共 {{ pagination.total_pages }} 页)
            </span>
          </p>
        </div>

        <!-- 车辆列表（可滚动） -->
        <div class="cars-container">
          <!-- 加载状态 -->
          <div v-if="loading" class="loading-container">
            <el-skeleton :rows="3" animated />
            <el-skeleton :rows="3" animated />
            <el-skeleton :rows="3" animated />
          </div>
          
          <!-- 车辆列表 -->
          <div v-else-if="filteredCars.length > 0" class="cars-grid">
            <div 
              class="car-card" 
              v-for="car in filteredCars" 
              :key="car.id" 
              :data-id="car.vehicle_id"
              @click="handleCarClick(car)"
            >
              <div class="car-image">
                <img 
                  :src="car.image || '/default-car.jpg'" 
                  :alt="car.name" 
                  @error="handleImageError"
                  @load="handleImageLoad"
                  loading="lazy"
                />
                <div class="car-badge" v-if="car.badge" :data-status="car.badge">{{ car.badge }}</div>
              </div>
              <div class="car-info">
                <h3 class="car-name">{{ car.name }}</h3>
                <p class="car-details">{{ car.year }} | {{ car.fuelType }} | {{ formatSeats(car.seats) }}</p>
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
                <div class="car-extra" v-if="car.transmission || car.engineVolume">
                  <span v-if="car.transmission" class="extra-item">{{ car.transmission }}</span>
                  <span v-if="car.engineVolume" class="extra-item">{{ car.engineVolume }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 无结果时显示 -->
          <div v-else class="no-results">
            <el-empty :description="$t('search.noResults')" />
          </div>
          
          <!-- 加载更多状态 -->
          <div v-if="loadingMore" class="loading-more">
            <el-skeleton :rows="2" animated />
          </div>
          
          <!-- 没有更多数据提示 -->
          <div v-if="!loading && !loadingMore && vehicles.length > 0 && !pagination.has_next" class="no-more-data">
            <el-divider content-position="center">
              <span class="no-more-text">没有更多数据了</span>
            </el-divider>
          </div>
        </div>
      </div>
    </div>

    <!-- 移动端筛选抽屉 -->
    <el-drawer
      v-model="filterDrawerVisible"
      direction="btt"
      size="70%"
      :with-header="false"
      class="mobile-filter-drawer"
    >
      <div class="filter-drawer-content">
        <!-- 抽屉头部 -->
        <div class="drawer-header">
          <h3>筛选条件</h3>
          <el-button type="text" @click="closeFilterDrawer">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>

        <!-- 已选择的筛选条件汇总 -->
        <div class="selected-filters-summary" v-if="hasSelectedFilters">
          <div class="summary-items">
            <div class="summary-item" v-if="tempCategory !== 'all'">
              {{ getCategoryDisplayName(tempCategory) }}
            </div>
            <div class="summary-item" v-if="tempBrand !== ''">
              {{ tempBrand }}
            </div>
            <div class="summary-item" v-if="tempPriceRange !== 'all'">
              {{ getPriceDisplayName(tempPriceRange) }}
            </div>
            <div class="summary-item" v-if="tempYear !== null">
              {{ getYearDisplayName(tempYear) }}年
            </div>
          </div>
        </div>

        <!-- 选项卡 -->
        <el-tabs v-model="activeTab" class="filter-tabs">
          <!-- 分类选项卡 -->
          <el-tab-pane label="分类" name="category">
            <div class="tab-content">
              <div class="filter-options-mobile">
                <el-button
                  :type="tempCategory === 'all' ? 'primary' : 'default'"
                  @click="tempCategory = 'all'"
                  class="filter-btn-mobile"
                  :class="{ 'is-selected': tempCategory === 'all' }"
                >
                  <el-icon><Grid /></el-icon>
                  {{ $t('search.filters.allVehicles') }}
                </el-button>
                <el-button
                  v-for="category in categories"
                  :key="category.value"
                  :type="tempCategory === category.value ? 'primary' : 'default'"
                  @click="tempCategory = category.value"
                  class="filter-btn-mobile"
                  :class="{ 'is-selected': tempCategory === category.value }"
                >
                  <el-icon><component :is="category.icon" /></el-icon>
                  {{ category.label }}
                </el-button>
              </div>
            </div>
          </el-tab-pane>

          <!-- 品牌选项卡 -->
          <el-tab-pane label="品牌" name="brand">
            <div class="tab-content">
              <div class="filter-options-mobile">
                <el-button
                  :type="tempBrand === '' ? 'primary' : 'default'"
                  @click="tempBrand = ''"
                  class="filter-btn-mobile"
                  :class="{ 'is-selected': tempBrand === '' }"
                >
                  不限品牌
                </el-button>
                <el-button
                  v-for="brand in brands"
                  :key="brand.brand"
                  :type="tempBrand === brand.brand ? 'primary' : 'default'"
                  @click="tempBrand = brand.brand"
                  class="filter-btn-mobile"
                  :class="{ 'is-selected': tempBrand === brand.brand }"
                >
                  {{ brand.brand }}
                </el-button>
              </div>
            </div>
          </el-tab-pane>

          <!-- 价格选项卡 -->
          <el-tab-pane label="价格" name="price">
            <div class="tab-content">
              <div class="filter-options-mobile">
                <el-button
                  v-for="range in priceRanges"
                  :key="range.value"
                  :type="tempPriceRange === range.value ? 'primary' : 'default'"
                  @click="tempPriceRange = range.value"
                  class="filter-btn-mobile"
                  :class="{ 'is-selected': tempPriceRange === range.value }"
                >
                  {{ range.label }}
                </el-button>
              </div>
            </div>
          </el-tab-pane>

          <!-- 年份选项卡 -->
          <el-tab-pane label="年份" name="year">
            <div class="tab-content">
              <div class="filter-options-mobile">
                <el-button
                  :type="tempYear === null ? 'primary' : 'default'"
                  @click="tempYear = null"
                  class="filter-btn-mobile"
                  :class="{ 'is-selected': tempYear === null }"
                >
                  不限年份
                </el-button>
                <el-button
                  v-for="year in availableYears"
                  :key="year"
                  :type="tempYear === year ? 'primary' : 'default'"
                  @click="tempYear = year"
                  class="filter-btn-mobile"
                  :class="{ 'is-selected': tempYear === year }"
                >
                  {{ year }}
                </el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>

        <!-- 底部操作按钮 -->
        <div class="drawer-footer">
          <el-button @click="closeFilterDrawer">取消</el-button>
          <el-button type="primary" @click="applyFilters">确定</el-button>
        </div>
      </div>
    </el-drawer>

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
import { ref, computed, watch, onMounted, onUnmounted, nextTick, onActivated, onDeactivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import AppHeader from '@/components/AppHeader.vue'
import VehicleDetailDrawer from '@/components/VehicleDetailDrawer.vue'
import { ArrowLeft, Search, Phone, Van, Box, Bicycle, Star, Grid, ArrowDown, Close } from '@element-plus/icons-vue'
import { Calendar, Tickets, User as UserIcon, Cpu, Setting } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useSearchStore } from '@/stores/search'
import { vehicleAPI } from '@/utils/api'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()
const searchStore = useSearchStore()
// 滚动恢复状态标记，避免恢复期间被其它逻辑打断
const isRestoringScroll = ref(false)
// 抽屉尺寸逻辑已移至 VehicleDetailDrawer 组件

// 搜索关键词
const searchKeyword = ref(route.query.q || '')

// 移动端检测
const isMobile = ref(window.innerWidth <= 768)

// 移动端头部高度计算
const mobileSearchFilterContainer = ref(null)
const mobileHeaderHeight = ref(140) // 默认值，会被动态计算覆盖

// 分类数据
const categories = computed(() => [
  { label: t('home.category.private'), value: 'private', icon: Van },
  { label: t('home.category.van'), value: 'van', icon: Van },
  { label: t('home.category.truck'), value: 'truck', icon: Box },
  { label: t('home.category.motorcycle'), value: 'motorcycle', icon: Bicycle },
  { label: t('home.category.classic'), value: 'classic', icon: Star }
])

// 分类映射到API的vehicle_type
const categoryMapping = {
  'private': 1,      // 私家车
  'van': 2,          // 客货车  
  'truck': 3,        // 货车
  'motorcycle': 4,   // 电单车
  'classic': 5,      // 经典车
}

// 筛选状态
const selectedCategory = ref('all')
const selectedBrand = ref('')
const selectedPriceRange = ref('all')
const selectedYear = ref(null)

// 移动端筛选抽屉状态
const filterDrawerVisible = ref(false)
const activeTab = ref('category') // 默认打开分类选项卡
const tempCategory = ref('all') // 临时存储分类筛选值
const tempBrand = ref('') // 临时存储品牌筛选值
const tempPriceRange = ref('all') // 临时存储价格筛选值
const tempYear = ref(null) // 临时存储年份筛选值

// API相关状态
const vehicles = ref([])
const brands = ref([]) // 品牌列表
const loading = ref(false)
const loadingMore = ref(false) // 加载更多状态
const pagination = ref({
  current_page: 1,
  total_pages: 1,
  total_count: 0,
  limit: 20,
  has_next: false,
  has_prev: false
})

// 可用年份（1990-2024）
const availableYears = computed(() => {
  const years = []
  for (let i = 2024; i >= 1990; i--) {
    years.push(i)
  }
  return years
})



// 预定义价格范围
const priceRanges = computed(() => [
  { label: t('search.filters.priceRange.all'), value: 'all' },
  { label: t('search.filters.priceRange.under1'), value: 'under1' },
  { label: t('search.filters.priceRange.1to2'), value: '1to2' },
  { label: t('search.filters.priceRange.2to5'), value: '2to5' },
  { label: t('search.filters.priceRange.5to10'), value: '5to10' },
  { label: t('search.filters.priceRange.10to15'), value: '10to15' },
  { label: t('search.filters.priceRange.15to20'), value: '15to20' },
  { label: t('search.filters.priceRange.20to30'), value: '20to30' },
  { label: t('search.filters.priceRange.30to50'), value: '30to50' },
  { label: t('search.filters.priceRange.50to100'), value: '50to100' },
  { label: t('search.filters.priceRange.over100'), value: 'over100' }
])

// 处理API返回的车辆数据，适配现有的卡片结构
const processVehicleData = (vehicles) => {
  return vehicles.map(vehicle => ({
    id: vehicle.id,
    vehicle_id: vehicle.vehicle_id, // 使用API返回的vehicle_id字段
    name: `${vehicle.car_brand} ${vehicle.car_model}`,
    year: vehicle.year,
    fuelType: vehicle.fuel_type,
    seats: vehicle.seats,
    price: vehicle.price,
    currentPrice: vehicle.current_price,
    originalPrice: vehicle.original_price, // 添加原价字段
    // 选择第一张图片（避免随机选择导致的重复计算）
    image: vehicle.images && vehicle.images.length > 0 
      ? vehicle.images[0].image_url 
      : null, // 先设置为null，在模板中处理默认图片
    // 联系人信息
    contactName: vehicle.contact_name || '暂无联系人',
    phoneNumber: vehicle.phone_number || '暂无电话',
    category: vehicle.vehicle_type,
    badge: getVehicleStatusBadge(vehicle.vehicle_status),
    // 额外信息
    transmission: vehicle.transmission,
    engineVolume: vehicle.engine_volume,
    description: vehicle.description
  }))
}

// 获取车辆状态徽章
const getVehicleStatusBadge = (status) => {
  switch (status) {
    case 1: return null // 在售
    case 2: return '已售'
    case 3: return '预订'
    case 4: return '下架'
    default: return null
  }
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

// 获取格式化的价格信息（优化性能，避免重复调用）
const getFormattedPrice = (car) => {
  return formatPrice(car.currentPrice, car.originalPrice)
}

// 详情抽屉内价格展示专用（防止出现对象字符串化）
const formatCurrencyHKD = (value) => {
  if (!value || Number(value) === 0) return '价格面议'
  return `HKD$${Number(value).toLocaleString()}`
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

// 筛选后的车辆列表（暂时使用API数据，后续实现多条件筛选）
const filteredCars = computed(() => {
  return vehicles.value
})

// 检查是否有已选择的筛选条件
const hasSelectedFilters = computed(() => {
  return tempCategory.value !== 'all' || 
         tempBrand.value !== '' ||
         tempPriceRange.value !== 'all' || 
         tempYear.value !== null
})

// 详情抽屉相关状态
const detailDrawerVisible = ref(false)
const detailLoading = ref(false)
const detailError = ref(false)
const detailData = ref(null)
const detailImageIndex = ref(0)
const currentDetailId = ref(null)

// 处理车辆点击
function handleCarClick(car) {
  console.log('点击车辆:', car)
  // 进入详情前保存当前滚动位置
  saveScrollPosition()
  // 在抽屉中展示车辆详情
  openDetailDrawer(car.vehicle_id)
}

// 打开详情抽屉
const openDetailDrawer = async (vehicleId) => {
  console.log('🚗 开始加载车辆详情，ID:', vehicleId)
  detailDrawerVisible.value = true
  detailLoading.value = true
  detailError.value = false
  detailData.value = null
  detailImageIndex.value = 0
  currentDetailId.value = vehicleId
  try {
    console.log('📡 调用API获取车辆详情...')
    // 兼容不同返回结构
    const res = await vehicleAPI.getVehicleDetail(vehicleId)
    console.log('✅ API响应原始数据:', res)
    
    const rawData = res?.vehicle || res
    console.log('🔄 提取的原始数据:', rawData)
    
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
      console.log('🎯 转换后的数据:', transformedData)
      // 使用JSON深拷贝避免响应式问题
      detailData.value = JSON.parse(JSON.stringify(transformedData))
      // 确保清除错误状态
      detailError.value = false
      console.log('✨ 详情数据设置完成，抽屉应该显示数据:', detailData.value)
    } else {
      console.warn('⚠️ 没有获取到有效的车辆数据')
      detailError.value = '没有获取到车辆数据'
    }
  } catch (e) {
    console.error('❌ 加载车辆详情失败:', e)
    detailError.value = e?.message || '加载失败'
  } finally {
    detailLoading.value = false
    console.log('🏁 详情加载完成，loading状态:', detailLoading.value, '错误状态:', detailError.value)
  }
}

// 重新加载详情
const reloadDetail = () => {
  if (currentDetailId.value) openDetailDrawer(currentDetailId.value)
}

// 获取品牌列表
const fetchBrands = async () => {
  try {
    const response = await vehicleAPI.getBrands()
    brands.value = response.brands || []
    // console.log('品牌列表获取成功:', brands.value)
  } catch (error) {
    console.error('获取品牌列表失败:', error)
    ElMessage.error('获取品牌列表失败，请稍后重试')
  }
}

// 获取车辆数据（支持分页）
const fetchVehicles = async (isLoadMore = false) => {
  if (isLoadMore) {
    // 加载更多时，检查是否还有下一页
    if (!pagination.value.has_next) {
      return
    }
    loadingMore.value = true
  } else {
    // 首次加载时，先检查缓存
    const searchParams = {
      category: selectedCategory.value,
      brand: selectedBrand.value,
      priceRange: selectedPriceRange.value,
      year: selectedYear.value,
      keyword: searchKeyword.value
    }
    
    const cachedResult = searchStore.getCachedSearchResult(searchParams)
    if (cachedResult) {
      console.log('使用缓存数据:', searchStore.currentCacheKey)
      vehicles.value = cachedResult.vehicles
      pagination.value = cachedResult.pagination
      // currentCacheKey已经在getCachedSearchResult中设置了
      return
    }
    
    loading.value = true
    // 重置分页状态
    pagination.value.current_page = 1
  }
  
  try {
    const params = {
      page: isLoadMore ? pagination.value.current_page + 1 : 1,
      limit: 20
    }
    
    // 如果选择了分类，添加vehicle_type参数
    if (selectedCategory.value && selectedCategory.value !== 'all') {
      const typeId = categoryMapping[selectedCategory.value]
      if (typeId) {
        params.vehicle_type = typeId
      }
    }
    
    // 如果选择了品牌，添加car_brand参数
    if (selectedBrand.value && selectedBrand.value !== '') {
      params.car_brand = selectedBrand.value
    }
    
    // 如果选择了价格区间，添加价格范围参数
    const priceRangeParams = getPriceRangeParams(selectedPriceRange.value)
    if (Object.keys(priceRangeParams).length > 0) {
      params.min_price = priceRangeParams.min_price
      if (priceRangeParams.max_price !== undefined) {
        params.max_price = priceRangeParams.max_price
      }
    }

    // 如果选择了年份，添加year参数
    if (selectedYear.value) {
      params.year = selectedYear.value
    }
    
    const response = await vehicleAPI.getVehicles(params)
    console.log('API响应:', response)
    
    if (isLoadMore) {
      // 加载更多时，追加数据
      vehicles.value = [...vehicles.value, ...processVehicleData(response.vehicles)]
      console.log('加载更多完成，当前车辆数量:', vehicles.value.length)
    } else {
      // 首次加载或筛选时，替换数据
      vehicles.value = processVehicleData(response.vehicles)
      console.log('首次加载完成，车辆数量:', vehicles.value.length)
    }
    
    // 更新分页状态
    pagination.value = response.pagination
    // 保存到缓存（仅在首次加载时）
    if (!isLoadMore) {
      const searchParams = {
        category: selectedCategory.value,
        brand: selectedBrand.value,
        priceRange: selectedPriceRange.value,
        year: selectedYear.value,
        keyword: searchKeyword.value
      }
      
      searchStore.saveSearchCache(searchParams, {
        vehicles: vehicles.value,
        pagination: pagination.value
      })
    }
  } catch (error) {
    console.error('获取车辆失败:', error)
    ElMessage.error('获取车辆数据失败，请稍后重试')
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// 选择分类
const selectCategory = (category) => {
  // 如果点击的是当前已选中的分类，不做任何操作
  if (selectedCategory.value === category) {
    return
  }
  
  // 更新选中的分类
  selectedCategory.value = category
  
  // 重置分页状态
  pagination.value = {
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    limit: 20,
    has_next: false,
    has_prev: false
  }
  
  // 清空现有数据
  vehicles.value = []
  
  // 调用API获取数据
  fetchVehicles()
  
  // 更新路由
  updateRoute()
}

// 选择品牌
const selectBrand = (brand) => {
  // 更新选中的品牌
  selectedBrand.value = brand
  
  // 重置分页状态
  pagination.value = {
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    limit: 20,
    has_next: false,
    has_prev: false
  }
  
  // 清空现有数据
  vehicles.value = []
  
  // 调用API获取数据
  fetchVehicles()
  
  // 更新路由
  updateRoute()
}

// 选择价格区间
const selectPriceRange = (priceRange) => {
  
  // 更新选中的价格区间
  selectedPriceRange.value = priceRange
  
  // 重置分页状态
  pagination.value = {
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    limit: 20,
    has_next: false,
    has_prev: false
  }
  
  // 清空现有数据
  vehicles.value = []
  
  // 调用API获取数据
  fetchVehicles()
  
  // 更新路由
  updateRoute()
}

// 选择年份
const selectYear = (year) => {
  
  // 更新选中的年份
  selectedYear.value = year
  
  // 重置分页状态
  pagination.value = {
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    limit: 20,
    has_next: false,
    has_prev: false
  }
  
  // 清空现有数据
  vehicles.value = []
  
  // 调用API获取数据
  fetchVehicles()
  
  // 更新路由
  updateRoute()
}

// 获取价格范围对应的数字参数
const getPriceRangeParams = (priceRange) => {
  switch (priceRange) {
    case 'under1':
      return { max_price: 10000 }
    case '1to2':
      return { min_price: 10000, max_price: 20000 }
    case '2to5':
      return { min_price: 20000, max_price: 50000 }
    case '5to10':
      return { min_price: 50000, max_price: 100000 }
    case '10to15':
      return { min_price: 100000, max_price: 150000 }
    case '15to20':
      return { min_price: 150000, max_price: 200000 }
    case '20to30':
      return { min_price: 200000, max_price: 300000 }
    case '30to50':
      return { min_price: 300000, max_price: 500000 }
    case '50to100':
      return { min_price: 500000, max_price: 1000000 }
    case 'over100':
      return { min_price: 1000000 }
    default:
      return {}
  }
}

// 重置筛选
function resetFilters() {
  selectedCategory.value = 'all'
  selectedBrand.value = ''
  selectedPriceRange.value = 'all'
  selectedYear.value = null
  searchKeyword.value = ''
  
  // 重新获取所有车辆数据
  fetchVehicles()
  
  updateRoute()
}

// 执行搜索
const doSearch = () => {
  updateRoute()
}

// 更新路由
function updateRoute() {
  const query = {}
  if (searchKeyword.value) query.keyword = searchKeyword.value
  if (selectedCategory.value && selectedCategory.value !== 'all') query.category = selectedCategory.value
  if (selectedBrand.value && selectedBrand.value !== '') query.brand = selectedBrand.value
  if (selectedPriceRange.value && selectedPriceRange.value !== 'all') query.priceRange = selectedPriceRange.value
  if (selectedYear.value) query.year = selectedYear.value
  
  router.push({ query })
}

// 滚动监听器 - 实现无限滚动（带节流）
let scrollTimeout = null
// 滚动位置相关变量已移除

const handleScroll = (event) => {
  // 如果正在加载或没有数据，跳过处理
  if (loadingMore.value || vehicles.value.length === 0) {
    return
  }
  
  // 滚动位置保存逻辑已移除
  
  // 节流处理，避免频繁触发
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
  
  scrollTimeout = setTimeout(() => {
    // 再次检查状态，防止在节流期间状态发生变化
    if (loadingMore.value || vehicles.value.length === 0) {
      return
    }
    
    // 统一使用 window 滚动检测，避免移动端和桌面端的差异
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0
    const clientHeight = window.innerHeight || document.documentElement.clientHeight || 0
    
    // 当距离底部150px时触发加载更多（移动端增加触发距离）
    const triggerDistance = window.innerWidth <= 1200 ? 150 : 100
    if (scrollTop + clientHeight >= scrollHeight - triggerDistance) {
      loadMore()
    }
  }, 300) // 增加到300ms节流，进一步减少触发频率
}

// 加载更多数据
const loadMore = async () => {
  // 防止重复加载
  if (loadingMore.value || !pagination.value.has_next || vehicles.value.length === 0) {
    return
  }
  
  await fetchVehicles(true)
}

// 窗口大小变化处理函数
const handleResize = () => {
  // 更新移动端检测
  isMobile.value = window.innerWidth <= 768
  // 重新设置滚动监听器
  setupScrollListeners()
  // 重新计算移动端头部高度
  updateMobileHeaderHeight()
}

// 设置滚动监听器
const setupScrollListeners = () => {
  // 先清理现有的监听器
  cleanupScrollListeners()
  
  // 统一使用 window 滚动监听，避免移动端和桌面端的差异
  window.addEventListener('scroll', handleScroll, { passive: true })
  
  // 移动端额外监听 touchmove 事件，提高移动端滚动检测的准确性
  if (window.innerWidth <= 1200) {
    document.addEventListener('touchmove', handleScroll, { passive: true })
  }
  
  // 监听窗口大小变化，动态调整滚动监听器
  window.addEventListener('resize', handleResize)
}

// 清理滚动监听器
const cleanupScrollListeners = () => {
  const carsContainer = document.querySelector('.cars-container')
  if (carsContainer) {
    carsContainer.removeEventListener('scroll', handleScroll)
  }
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('touchmove', handleScroll)
  
  // 清理定时器
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
    scrollTimeout = null
  }
}

// 确保页面滚动到顶部
const scrollToTop = () => {
  window.scrollTo(0, 0)
  // 兼容移动端
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
  
  // 重置页面内所有可滚动元素的滚动位置
  const scrollableElements = document.querySelectorAll('.search-content, .filters, .cars-container')
  scrollableElements.forEach(element => {
    if (element.scrollTop !== undefined) {
      element.scrollTop = 0
    }
  })
}

// 滚动位置恢复函数已移除

// 滚动位置持久化与恢复
const SCROLL_POS_PREFIX = 'search_scroll_'

const getScrollKey = () => {
  // 使用完整路由（含查询）作为 key，确保不同筛选条件分别记录
  return `${SCROLL_POS_PREFIX}${router.currentRoute.value.fullPath}`
}

// 详情抽屉相关状态已移至 VehicleDetailDrawer 组件

const getActiveScrollTarget = () => {
  // 移动端统一使用 window 滚动
  if (window.innerWidth <= 768) return 'window'
  const carsContainerEl = document.querySelector('.cars-container')
  const searchContentEl = document.querySelector('.search-content')
  // 优先 cars-container，其次 search-content
  if (carsContainerEl && carsContainerEl.scrollHeight > carsContainerEl.clientHeight) return 'cars'
  if (searchContentEl && searchContentEl.scrollHeight > searchContentEl.clientHeight) return 'search'
  return 'window'
}

// 获取移动端固定头部（AppHeader + 移动筛选容器）的总高度
const getMobileFixedHeaderHeight = () => {
  if (window.innerWidth > 768) return 0
  // 与 calculateMobileHeaderHeight 逻辑保持一致：AppHeader 80 + 容器高度
  const appHeaderHeight = 80
  const container = document.querySelector('.mobile-search-filter-container')
  const containerHeight = container ? (container.offsetHeight || 0) : 0
  return appHeaderHeight + containerHeight
}

// 找到当前视口内第一个可视车卡片（用于移动端锚点恢复）
const getFirstVisibleCard = () => {
  const cards = Array.from(document.querySelectorAll('.car-card'))
  if (!cards.length) return null
  const headerOffset = getMobileFixedHeaderHeight()
  // 选择 top 超过头部区域的第一张卡片
  for (const el of cards) {
    const rect = el.getBoundingClientRect()
    if (rect.bottom > headerOffset + 1) {
      return el
    }
  }
  return cards[0]
}

const getCurrentScrollPositions = () => {
  const target = getActiveScrollTarget()
  const windowY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
  const searchContentEl = document.querySelector('.search-content')
  const carsContainerEl = document.querySelector('.cars-container')
  const searchContentY = searchContentEl ? searchContentEl.scrollTop : 0
  const carsContainerY = carsContainerEl ? carsContainerEl.scrollTop : 0
  let y = windowY
  if (target === 'cars') y = carsContainerY
  if (target === 'search') y = searchContentY
  // 移动端增加锚点信息（首个可视卡片及其相对偏移），更稳健
  let anchor = null
  if (target === 'window') {
    const firstCard = getFirstVisibleCard()
    if (firstCard) {
      const headerOffset = getMobileFixedHeaderHeight()
      const rect = firstCard.getBoundingClientRect()
      const id = firstCard.getAttribute('data-id')
      const offset = rect.top - headerOffset
      anchor = { id, offset }
    }
  }
  return { target, y, windowY, searchContentY, carsContainerY, anchor }
}

const saveScrollPosition = () => {
  try {
    const key = getScrollKey()
    const pos = getCurrentScrollPositions()
    sessionStorage.setItem(key, JSON.stringify(pos))
    // 记录最后一次位置，作为兜底
    sessionStorage.setItem(`${SCROLL_POS_PREFIX}last`, JSON.stringify({ key, ...pos }))
  } catch (e) {
    // 存储失败忽略
  }
}

const restoreScrollPosition = () => {
  try {
    isRestoringScroll.value = true
    const key = getScrollKey()
    let raw = sessionStorage.getItem(key)
    if (!raw) {
      raw = sessionStorage.getItem(`${SCROLL_POS_PREFIX}last`)
    }
    if (!raw) return
    const data = JSON.parse(raw)

    // 兼容旧格式
    const preferredTarget = data.target || getActiveScrollTarget()
    const targetYFromData = data.y !== undefined ? data.y : (preferredTarget === 'cars' ? data.carsContainerY : preferredTarget === 'search' ? data.searchContentY : data.windowY) || 0

    const carsContainerEl = document.querySelector('.cars-container')
    const searchContentEl = document.querySelector('.search-content')

    // 移动端优先按锚点恢复，规避图片加载与布局抖动
    const tryAnchorRestore = () => {
      if (window.innerWidth > 768) return false
      if (!data.anchor || !data.anchor.id) return false
      const el = document.querySelector(`.car-card[data-id="${data.anchor.id}"]`)
      if (!el) return false
      const headerOffset = getMobileFixedHeaderHeight()
      const rect = el.getBoundingClientRect()
      const currentViewportTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      const targetY = currentViewportTop + rect.top - headerOffset - (data.anchor.offset || 0)
      window.scrollTo(0, Math.max(0, targetY))
      return true
    }

    const setScrollY = (y) => {
      const activeTarget = getActiveScrollTarget()
      if (activeTarget === 'window') {
        const maxY = Math.max(0, (document.documentElement.scrollHeight || document.body.scrollHeight || 0) - (window.innerHeight || document.documentElement.clientHeight || 0))
        window.scrollTo(0, Math.min(y, maxY))
      } else if (activeTarget === 'cars' && carsContainerEl) {
        const maxY = Math.max(0, carsContainerEl.scrollHeight - carsContainerEl.clientHeight)
        carsContainerEl.scrollTop = Math.min(y, maxY)
      } else if (activeTarget === 'search' && searchContentEl) {
        const maxY = Math.max(0, searchContentEl.scrollHeight - searchContentEl.clientHeight)
        searchContentEl.scrollTop = Math.min(y, maxY)
      } else {
        window.scrollTo(0, y)
      }
    }

    // 使用 rAF 重试，直到接近目标位置或达到最大尝试次数
    let attempts = 0
    const maxAttempts = 20
    const tryApply = () => {
      // 移动端优先锚点恢复；若失败则回退到像素恢复
      const usedAnchor = tryAnchorRestore()
      if (!usedAnchor) setScrollY(targetYFromData)
      attempts += 1
      const current = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      const expected = usedAnchor ? current : targetYFromData
      const diff = Math.abs(current - expected)
      if (diff <= 2 || attempts >= maxAttempts) {
        isRestoringScroll.value = false
        return
      }
      requestAnimationFrame(tryApply)
    }
    requestAnimationFrame(tryApply)
  } catch (e) {
    // 恢复失败忽略
    isRestoringScroll.value = false
  }
}

// 打开移动端筛选抽屉
const openFilterDrawer = () => {
  filterDrawerVisible.value = true
  tempCategory.value = selectedCategory.value
  tempBrand.value = selectedBrand.value
  tempPriceRange.value = selectedPriceRange.value
  tempYear.value = selectedYear.value
  activeTab.value = 'category' // 打开时默认选中分类
}

// 关闭移动端筛选抽屉
const closeFilterDrawer = () => {
  filterDrawerVisible.value = false
  // 不应用临时筛选值，保持原有状态
}

// 应用移动端筛选条件
const applyFilters = () => {
  selectedCategory.value = tempCategory.value
  selectedBrand.value = tempBrand.value
  selectedPriceRange.value = tempPriceRange.value
  selectedYear.value = tempYear.value
  
  // 重置分页状态
  pagination.value = {
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    limit: 20,
    has_next: false,
    has_prev: false
  }
  
  // 清空现有数据
  vehicles.value = []
  
  // 重新获取数据
  fetchVehicles()
  
  // 更新路由
  updateRoute()
  
  // 关闭抽屉
  filterDrawerVisible.value = false
}

// 计算移动端头部高度
  const calculateMobileHeaderHeight = () => {
    if (!isMobile.value || !mobileSearchFilterContainer.value) {
      return 140 // 默认值
    }
    
    // AppHeader 高度（固定 80px）
    const appHeaderHeight = 80
    
    // 获取移动端搜索筛选容器的高度
    const containerHeight = mobileSearchFilterContainer.value.offsetHeight || 0
    
    // 总高度 = AppHeader + 容器高度
    const totalHeight = appHeaderHeight + containerHeight
    
    console.log('移动端头部高度计算:', {
      appHeaderHeight,
      containerHeight,
      totalHeight
    })
    
    return totalHeight
  }

// 更新移动端头部高度
const updateMobileHeaderHeight = () => {
  if (isMobile.value) {
    nextTick(() => {
      mobileHeaderHeight.value = calculateMobileHeaderHeight()
    })
  }
}

// 获取移动端筛选栏的显示值
const getCategoryDisplayName = (category = selectedCategory.value) => {
  if (category === 'all') {
    return '全部'
  }
  const categoryObj = categories.value.find(c => c.value === category)
  return categoryObj ? categoryObj.label : '全部'
}

const getPriceDisplayName = (priceRange = selectedPriceRange.value) => {
  const range = priceRanges.value.find(r => r.value === priceRange)
  return range ? range.label : '不限'
}

const getYearDisplayName = (year = selectedYear.value) => {
  return year ? year.toString() : '不限'
}

const getBrandDisplayName = (brand = selectedBrand.value) => {
  return brand && brand !== '' ? brand : '不限'
}

// 监听路由变化，只在组件初始化时设置一次
watch(() => route.query, (newQuery, oldQuery) => {
  // 只在组件初始化时设置一次，避免后续路由更新覆盖用户选择
  if (!oldQuery || Object.keys(oldQuery).length === 0) {
    if (newQuery.keyword !== undefined) searchKeyword.value = newQuery.keyword || ''
    if (newQuery.category !== undefined) selectedCategory.value = newQuery.category || 'all'
    if (newQuery.brand !== undefined) selectedBrand.value = newQuery.brand || ''
    if (newQuery.priceRange !== undefined) selectedPriceRange.value = newQuery.priceRange || 'all'
    if (newQuery.year !== undefined) selectedYear.value = parseInt(newQuery.year) || null
  }
}, { immediate: true })

// 添加一个专门监听分类变化的 watcher，用于调试
watch(selectedCategory, (newCategory, oldCategory) => {
  // 分类状态变化处理
})

// 组件挂载后初始化
onMounted(() => {
  // 从路由参数初始化筛选条件
  if (route.query.keyword) searchKeyword.value = route.query.keyword
  if (route.query.category) {
    selectedCategory.value = route.query.category
  }
  if (route.query.brand) {
    selectedBrand.value = route.query.brand
  }
  if (route.query.priceRange) selectedPriceRange.value = route.query.priceRange || 'all'
  if (route.query.year) selectedYear.value = parseInt(route.query.year) || null
  
  // 获取品牌列表
  fetchBrands()
  
  // 获取车辆数据
  fetchVehicles()
  
  // 添加滚动监听器到正确的滚动容器
  nextTick(() => {
    setupScrollListeners()
    // 计算移动端头部高度
    updateMobileHeaderHeight()
  })
})

// 组件激活时（从详情页返回）
onActivated(() => {
  // 构建当前搜索条件参数
  const searchParams = {
    category: selectedCategory.value,
    brand: selectedBrand.value,
    priceRange: selectedPriceRange.value,
    year: selectedYear.value,
    keyword: searchKeyword.value
  }
  
  // 检查是否有缓存数据
  const cachedResult = searchStore.getCachedSearchResult(searchParams)
  if (cachedResult) {
    vehicles.value = cachedResult.vehicles
    pagination.value = cachedResult.pagination
    // currentCacheKey已经在getCachedSearchResult中设置了
    
    // 重新设置滚动监听器
    nextTick(() => {
      setupScrollListeners()
      
      // 滚动位置恢复逻辑已移除
      // 返回时恢复滚动位置
      restoreScrollPosition()
    })
  } else {
    // 如果没有缓存，重新获取数据
    fetchVehicles()
    
    // 重新设置滚动监听器
    nextTick(() => {
      setupScrollListeners()
      // 返回时恢复滚动位置
      restoreScrollPosition()
    })
  }
})

// 组件卸载时清理滚动监听器
onUnmounted(() => {
  cleanupScrollListeners()
})

// 组件失活时清理滚动监听器（离开搜索页面时）
onDeactivated(() => {
  // 离开页面时保存滚动位置
  saveScrollPosition()
  cleanupScrollListeners()
})

// 监听路由变化
watch(
  () => route.path,
  (newPath, oldPath) => {
    // 如果是从详情页返回到搜索页，不执行滚动到顶部
    if (oldPath && oldPath.includes('/vehicle/') && newPath === '/search') {
      return
    }
    // 其他情况滚动到顶部
    if (oldPath && newPath === '/search') {
      scrollToTop()
    }
  }
)

// 监听路由查询参数变化，确保搜索条件改变时也滚动到顶部
watch(
  () => route.query,
  (newQuery, oldQuery) => {
    if (isRestoringScroll.value) return
    // 仅在查询内容确实变化时回到顶部
    const changed = JSON.stringify(newQuery || {}) !== JSON.stringify(oldQuery || {})
    if (changed) scrollToTop()
  },
  { deep: true }
)

// 监听移动端状态变化，重新计算头部高度
watch(isMobile, (newIsMobile, oldIsMobile) => {
  if (newIsMobile !== oldIsMobile) {
    nextTick(() => {
      updateMobileHeaderHeight()
    })
  }
})



// 获取结果标题
function getResultsTitle() {
  if (selectedCategory.value && selectedCategory.value !== 'all') {
    const category = categories.value.find(c => c.value === selectedCategory.value)
    return category ? category.label : t('search.filters.allVehicles')
  }
  return t('search.filters.allVehicles')
}
</script>

<style lang="scss" scoped>
.search-page {
  min-height: 100vh;
  background: #f7f8fa;
  overflow-x: hidden;
}

.search-content {
  max-width: 1200px;
  margin: 100px auto 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.04);
  padding: 0;
  display: flex;
  gap: 0;
  height: calc(100vh - 120px);
  overflow-y: auto; // 允许垂直滚动

  @media (max-width: 1200px) {
    margin: 100px 0 0 0;
    flex-direction: column;
    gap: 24px;
    padding: 0;
    height: auto;
    overflow: visible;
    min-height: calc(100vh - 140px);
  }

  @media (max-width: 768px) {
    margin: 0;
    padding: 0;
    height: auto;
    overflow: visible;
    min-height: calc(100vh - 160px);
  }
}

.filters {
  width: 280px;
  border-right: 1px solid #f0f0f0;
  padding: 32px 24px 32px 32px;
  flex-shrink: 0;
  background: #fff;
  height: 100%;
  overflow-y: auto;
  position: sticky;
  top: 0;

  @media (max-width: 768px) {
    display: none; // 移动端隐藏桌面端筛选器
  }

  .filter-title {
    margin: 0 0 24px 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .price-year-wrapper {
    @media (max-width: 768px) {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }
  }

  .filter-section {
    margin-bottom: 32px;

    &.price-year-section {
      @media (max-width: 768px) {
        margin-bottom: 16px;
        flex: 1;
      }
    }

    .filter-section-title {
      margin: 0 0 20px 0;
      font-size: 14px;
      font-weight: 500;
      color: #666;
    }

    h3 {
      @media (max-width: 768px) {
        font-size: 14px;
        margin: 0 0 12px 0;
      }
    }

    .filter-options {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-left: 0;
      margin-left: 0;

      @media (max-width: 768px) {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 8px;
      }

      .filter-btn {
        justify-content: flex-start;
        text-align: left;
        padding: 12px 16px;
        border-radius: 8px;
        transition: all 0.3s ease;
        width: 100%;
        min-width: 120px;
        display: flex;
        align-items: center;
        height: 44px;
        box-sizing: border-box;
        margin-left: 0;

        @media (max-width: 768px) {
          width: auto;
          min-width: auto;
          flex: 1;
          justify-content: center;
          padding: 10px 12px;
          height: 40px;
        }

        &.active {
          background: #409eff;
          color: white;
          border-color: #409eff;
        }

        // 自定义选中状态样式
        &.is-selected {
          background: #409eff !important;
          color: white !important;
          border-color: #409eff !important;
          box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
        }

        &:hover:not(.active):not(.is-selected) {
          background: #f5f7fa;
          border-color: #dcdfe6;
        }

        .el-icon {
          margin-right: 8px;
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }
      }
    }

    .price-display,
    .year-display {
      margin-top: 12px;
      text-align: center;
      font-size: 14px;
      color: #666;
      background: #f5f7fa;
      padding: 8px;
      border-radius: 6px;
    }

    .brand-select {
      width: 100%;
    }

    .price-range-select {
      width: 100%;
    }

    .year-select {
      width: 100%;
    }
  }

  .reset-filters-btn {
    width: 100%;
    margin-top: 16px;
    color: #909399;
  }
}

.results {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;

  // 移动端搜索和筛选容器
  .mobile-search-filter-container {
    display: none;
    
    @media (max-width: 768px) {
      display: block;
      position: fixed;
      top: 80px;
      left: 0;
      right: 0;
      z-index: 999;
      background: #fff;
      border-bottom: 1px solid #f0f0f0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }

  .search-section {
    padding: 32px 32px 24px 32px;
    border-bottom: 1px solid #f0f0f0;
    background: #fff;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    gap: 16px;
    align-items: center;

    // 桌面端搜索框样式
    &.desktop-search {
      @media (max-width: 768px) {
        display: none;
      }
    }

    // 移动端搜索框样式（在容器内）
    @media (max-width: 768px) {
      padding: 12px 16px;
      flex-direction: column;
      gap: 12px;
      position: static;
      border-bottom: none;
      background: transparent;
      z-index: auto;
    }

    .search-input {
      flex: 1;

      @media (max-width: 768px) {
        width: 100%;
        padding: 0 0;
      }
    }
  }

  // 移动端筛选栏
  .mobile-filter-bar {
    display: none !important; // 默认隐藏，移动端显示

    @media (max-width: 768px) {
      display: flex !important;
      align-items: center;
      gap: 3px;
      padding: 6px 16px;
      background: #fff;
      border-bottom: 1px solid #f0f0f0;
      overflow-x: hidden;
      width: 100%;
      box-sizing: border-box;
      flex-direction: row !important;
      position: static;
      z-index: auto;
    }

    .filter-item {
      display: flex !important;
      align-items: center;
      gap: 1px;
      padding: 3px 8px;
      margin: 0 4px;
      background: #f5f7fa;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      flex: 1;
      min-width: 0;
      max-width: none;
      box-sizing: border-box;
      flex-direction: row !important;

      &:hover {
        background: #ecf5ff;
        border-color: #409eff;
      }

      .filter-label {
        font-size: 11px;
        color: #909399;
        white-space: nowrap;
        flex-shrink: 0;
        display: inline-block !important;
      }

      .filter-value {
        font-size: 10px;
        color: #409eff; /* 主色调蓝色 */
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        min-width: 0;
        display: inline-block !important;
      }

      .el-icon {
        font-size: 9px;
        color: #909399;
        flex-shrink: 0;
        display: inline-block !important;
      }
    }


  }

  .results-header {
    padding: 24px 32px 16px 32px;
    border-bottom: 1px solid #f0f0f0;
    background: #fff;
    flex-shrink: 0;
    position: sticky;
    top: 80px;
    z-index: 9;

    @media (max-width: 768px) {
      padding: 20px 16px;
      position: static;
      /* margin-top 现在通过动态绑定设置 */
      top: auto;
      z-index: auto;
    }

    .results-title {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 600;
      color: #333;

      @media (max-width: 768px) {
        font-size: 20px;
      }
    }

    .results-count {
      font-size: 14px;
      color: #909399;
      
      .pagination-info {
        margin-left: 8px;
        color: #606266;
        font-weight: 500;
      }
    }
  }

  .cars-container {
    flex: 1;
    overflow-y: auto;
    padding: 32px;
    
    /* Firefox scrollbar */
    scrollbar-width: thin;
    scrollbar-color: #c1c1c1 #f1f1f1;
    
    @media (max-width: 768px) {
      padding: 20px 16px;
      overflow-y: visible;
    }
    
    /* Custom scrollbar styling */
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 4px;
      
      &:hover {
        background: #a8a8a8;
      }
    }
  }

  .cars-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  .no-results {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;
  }
  
  
}

.car-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;

  @media (max-width: 768px) {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

    @media (max-width: 768px) {
      transform: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }
  }

  .car-image {
    position: relative;
    height: 200px;
    overflow: hidden;

    @media (max-width: 768px) {
      height: 160px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 0.3s ease;
      background: #f5f5f5; // 添加背景色，避免空白
      
      &.image-error {
        opacity: 0.7;
        background: #f0f0f0;
      }
      
      // 添加加载状态
      &:not([src]), &[src=""] {
        opacity: 0;
      }
    }

    .car-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: #67c23a;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      
      // 不同状态的颜色
      &[data-status="已售"] {
        background: #f56c6c;
      }
      
      &[data-status="预订"] {
        background: #e6a23c;
      }
      
      &[data-status="下架"] {
        background: #909399;
      }
    }
  }

  .car-info {
    padding: 20px;

    @media (max-width: 768px) {
      padding: 16px;
    }

    .car-name {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
      line-height: 1.4;

      @media (max-width: 768px) {
        font-size: 15px;
        margin: 0 0 6px 0;
      }
    }

    .car-details {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: #666;
      line-height: 1.4;
    }

    .car-price {
      margin-bottom: 12px;

      @media (max-width: 768px) {
        margin-bottom: 8px;
      }

      .price {
        font-size: 18px;
        font-weight: 600;
        color: #409eff;
        word-break: break-word;
        line-height: 1.3;

        @media (max-width: 768px) {
          font-size: 16px;
        }
      }

      .price-container {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;

        @media (max-width: 768px) {
          gap: 6px;
        }
      }

      .current-price {
        font-size: 18px;
        font-weight: 600;
        color: #409eff;
        line-height: 1.3;

        @media (max-width: 768px) {
          font-size: 16px;
        }
      }

      .original-price {
        font-size: 14px;
        color: #909399;
        text-decoration: line-through;
        line-height: 1.3;

        @media (max-width: 768px) {
          font-size: 13px;
        }
      }

      .discount-badge {
        background: #f56c6c;
        color: white;
        padding: 2px 6px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
        line-height: 1.2;

        @media (max-width: 768px) {
          font-size: 10px;
          padding: 1px 5px;
        }
      }

      .price-unit {
        font-size: 14px;
        color: #909399;
        margin-left: 4px;
      }
    }

    .car-contact {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: #909399;

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

/* 手机端特定样式已整合到各个组件中 */

.loading-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
}

.loading-more {
  padding: 20px 0;
  text-align: center;
}

.no-more-data {
  padding: 20px 0;
  
  .no-more-text {
    color: #909399;
    font-size: 14px;
  }
}

/* 移动端筛选抽屉样式 */
.mobile-filter-drawer {
  .el-drawer__header {
    display: none; // 隐藏抽屉头部
  }

  .el-drawer__body {
    padding: 0; // 移除抽屉内容区域的默认padding
  }

  .filter-drawer-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px;
  }

  .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .el-button {
      padding: 0;
      color: #909399;
      font-size: 16px;
    }
  }

  .filter-tabs {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch; // 优化移动端滚动

    .el-tabs__content {
      padding: 0;
    }

    .el-tab-pane {
      padding: 0;
    }
  }

  .current-selection {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    margin-bottom: 16px;
    background: #f0f9ff;
    border: 1px solid #b3d8ff;
    border-radius: 8px;
    border-left: 4px solid #409eff;

    .selection-label {
      font-size: 14px;
      color: #606266;
      margin-right: 8px;
      font-weight: 500;
    }

    .selection-value {
      font-size: 14px;
      color: #409eff;
      font-weight: 600;
    }
  }

  .filter-options-mobile {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;

    .filter-btn-mobile {
      flex: 1;
      min-width: 120px;
      padding: 10px 12px;
      height: 40px;
      justify-content: flex-start;
      text-align: left;
      border-radius: 8px;
      transition: all 0.3s ease;
      box-sizing: border-box;
      margin-left: 0;

      &.is-selected {
        background: #409eff !important;
        color: white !important;
        border-color: #409eff !important;
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
      }

      &:hover:not(.is-selected) {
        background: #f5f7fa;
        border-color: #dcdfe6;
      }

      .el-icon {
        margin-right: 8px;
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }
    }
  }

  .selected-filters-summary {
    margin: 0; /* 不要外边距 */
    padding: 10px 16px; /* 轻量内边距 */
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;

    .summary-items {
      display: flex;
      gap: 8px;
      flex-wrap: wrap; /* 多个标签自动换行 */
      overflow: visible; /* 不滚动 */
    }

    .summary-item {
      padding: 6px 12px;
      background: #e3f2fd;
      border: 1px solid #bbdefb;
      border-radius: 16px;
      font-size: 12px;
      color: #1565c0;
      font-weight: 500;
      white-space: nowrap;
    }
  }

  .filter-tabs {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .el-tabs__header {
      margin: 0 20px;
      border-bottom: 1px solid #e4e7ed;
    }

    .el-tabs__content {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }

    .tab-content {
      height: 100%;
    }

    .filter-options-mobile {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 12px;
      padding: 0;
    }

    .filter-btn-mobile {
      height: 40px;
      border-radius: 8px;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.3s ease;

      &.is-selected {
        background: #409eff;
        border-color: #409eff;
        color: white;
      }

      .el-icon {
        font-size: 16px;
      }
    }
  }

  .drawer-footer {
    padding: 20px;
    border-top: 1px solid #e4e7ed;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    background: white;

    .el-button {
      min-width: 80px;
    }
  }
}

/* 详情抽屉样式已移至 VehicleDetailDrawer 组件 */
</style>
