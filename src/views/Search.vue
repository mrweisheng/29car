<template>
  <div class="search-page">
    <AppHeader />
    
    <!-- 全局加载指示器 -->
    <div v-if="loading && !loadingMore" class="global-loading-overlay">
      <div class="loading-spinner">
        <el-icon class="spinner-icon"><Loading /></el-icon>
        <p class="loading-text">正在加载车辆数据...</p>
      </div>
    </div>

    <!-- 搜索内容区域 -->
    <div class="search-content">
      <!-- 左侧筛选条件（桌面端） -->
      <div class="filters desktop-filters">
        <!-- 分类筛选（桌面端） -->
        <div class="filter-section">
          <h3>{{ $t('search.filters.category') }}</h3>
          <div class="filter-content">
            <div class="filter-options">
              <button
                :class="['filter-btn', { active: selectedCategory === 'all' }]"
                @click="selectCategory('all')"
              >
                <el-icon><Grid /></el-icon>
                {{ $t('search.filters.allVehicles') }}
              </button>
              <button
                v-for="category in categories"
                :key="category.value"
                :class="['filter-btn', { active: selectedCategory === category.value }]"
                @click="selectCategory(category.value)"
              >
                <el-icon><component :is="category.icon" /></el-icon>
                {{ category.label }}
              </button>
            </div>
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

        <!-- 座位数筛选（桌面端） -->
        <div class="filter-section">
          <h3>座位数</h3>
          <div class="filter-content">
            <el-select
              v-model="selectedSeats"
              :placeholder="$t('search.filters.selectSeats')"
              @change="selectSeats"
              class="seats-select"
              clearable
            >
              <el-option
                :label="$t('search.filters.seats.all')"
                value="all"
              />
                              <el-option
                  v-for="seat in seatOptions"
                  :key="seat.value"
                  :label="seat.label"
                  :value="seat.value"
                />
            </el-select>
          </div>
        </div>

        <!-- 重置按钮 -->
        <div class="filter-section">
          <el-button
            v-if="hasSelectedFilters"
            @click="resetFilters"
            type="danger"
            plain
            class="reset-btn"
          >
            {{ $t('search.filters.reset') }}
          </el-button>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="results">
        <!-- 移动端搜索和筛选容器 -->
        <div ref="mobileSearchFilterContainer" class="mobile-search-filter-container" :style="{ display: isMobile ? 'block' : 'none' }">
          <!-- 搜索框和按钮同一行 -->
          <div class="search-filter-row">
            <el-input
              v-model="searchKeyword"
              :placeholder="$t('search.placeholder')"
              class="search-input"
              clearable
              @keyup.enter="doSearch"
            />
            <el-button type="primary" @click="doSearch" class="search-btn">
              <el-icon><Search /></el-icon>
            </el-button>
            <el-button type="default" @click="openFilterDrawer" class="filter-btn">
              筛选
            </el-button>
          </div>

          <!-- 已选择的筛选条件显示 -->
          <div class="selected-filters" v-if="hasSelectedFilters">
            <div class="filter-tags">
              <span v-if="selectedCategory !== 'all'" class="filter-tag">
                {{ getCategoryDisplayName() }}
                <el-icon @click="clearCategory" class="clear-icon"><Close /></el-icon>
              </span>
              <span v-if="selectedBrand" class="filter-tag">
                {{ selectedBrand }}
                <el-icon @click="clearBrand" class="clear-icon"><Close /></el-icon>
              </span>
              <span v-if="selectedPriceRange !== 'all'" class="filter-tag">
                {{ getPriceDisplayName() }}
                <el-icon @click="clearPriceRange" class="clear-icon"><Close /></el-icon>
              </span>
              <span v-if="selectedYear" class="filter-tag">
                {{ selectedYear }}{{ $t('search.filters.year') }}
                <el-icon @click="clearYear" class="clear-icon"><Close /></el-icon>
              </span>
              <span v-if="selectedSeats !== 'all'" class="filter-tag">
                {{ getSeatsDisplayName() }}
                <el-icon @click="clearSeats" class="clear-icon"><Close /></el-icon>
              </span>
            </div>
            <el-button type="text" @click="resetFilters" class="reset-btn" style="color: red;">
              {{ $t('search.filters.reset') }}
            </el-button>
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
          <div class="header-content" :class="{ 'desktop-layout': !isMobile }">
            <h2>{{ getResultsTitle() }}</h2>
            <p class="results-count">
              {{ filteredCars.length }} {{ $t('search.resultsFound') }}
              <span v-if="pagination.total_count > 0" class="pagination-info">
                (第 {{ pagination.current_page }} 页，共 {{ pagination.total_pages }} 页)
              </span>
            </p>
          </div>
        </div>

        <!-- 车辆列表（可滚动） -->
        <div class="cars-container">
          <!-- 加载状态 -->
          <div v-if="loading" class="loading-container">
            <div class="loading-header">
              <el-skeleton-item variant="h3" style="width: 200px; height: 24px;" />
              <el-skeleton-item variant="text" style="width: 150px; height: 16px; margin-top: 8px;" />
            </div>
            <div class="loading-cards">
              <div v-for="i in 6" :key="i" class="loading-card">
                <el-skeleton-item variant="image" style="width: 100%; height: 200px; border-radius: 8px;" />
                <div class="loading-card-content">
                  <el-skeleton-item variant="h3" style="width: 80%; height: 20px; margin-top: 12px;" />
                  <el-skeleton-item variant="text" style="width: 60%; height: 14px; margin-top: 8px;" />
                  <el-skeleton-item variant="text" style="width: 40%; height: 16px; margin-top: 8px;" />
                  <el-skeleton-item variant="text" style="width: 70%; height: 14px; margin-top: 8px;" />
                </div>
              </div>
            </div>
          </div>
          
          <!-- 车辆列表 -->
          <div v-else-if="filteredCars.length > 0" class="cars-grid">
            <div 
              class="car-card" 
              v-for="car in filteredCars" 
              :key="car.id" 
              :data-id="car.vehicle_id"
              @click="handleCarClick(car)"
              :class="{ 'clicking': car.vehicle_id === currentDetailId }"
            >
              <div class="car-image">
                <img 
                  :src="car.image || '/default-car.jpg'" 
                  :alt="car.name" 
                  @error="handleImageError"
                  @load="handleImageLoad"
                  loading="lazy"
                />
                <div v-if="car.is_special_offer === 1" class="car-badge special-offer">
                  <el-icon><Star /></el-icon>
                </div>
                <div v-else-if="car.badge" class="car-badge" :data-status="car.badge">{{ car.badge }}</div>
              </div>
              <div class="car-info">
                <h3 class="car-name">{{ car.name }}</h3>
                <p class="car-details">{{ car.year }} | {{ car.fuelType }} | {{ formatSeats(car.seats) }}</p>
                <div class="car-price" :class="{ 'special-offer-price': car.is_special_offer === 1 }">
                  <template v-if="car.is_special_offer === 1">
                    <span class="current-price">HKD$98,000（包含車+兩地牌）</span>
                  </template>
                  <template v-else>
                                                        <template v-if="getFormattedPrice(car) === '價格面議'">
                    <span class="price">價格面議</span>
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
                  </template>
                </div>
                <div class="car-contact">
                  <el-icon><Phone /></el-icon>
                  <span v-if="car.is_special_offer === 1">明哥 98702065</span>
                  <span v-else-if="isMinggeUser">{{ car.contactName || '明哥' }} {{ car.phoneNumber || '98702065' }}</span>
                  <span v-else>明哥 98702065</span>
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
            <div class="loading-more-content">
              <el-icon class="loading-icon"><Loading /></el-icon>
              <span class="loading-text">正在加载更多车辆...</span>
            </div>
            <div class="loading-more-cards">
              <div v-for="i in 3" :key="i" class="loading-card">
                <el-skeleton-item variant="image" style="width: 100%; height: 200px; border-radius: 8px;" />
                <div class="loading-card-content">
                  <el-skeleton-item variant="h3" style="width: 80%; height: 20px; margin-top: 12px;" />
                  <el-skeleton-item variant="text" style="width: 60%; height: 14px; margin-top: 8px;" />
                  <el-skeleton-item variant="text" style="width: 40%; height: 16px; margin-top: 8px;" />
                </div>
              </div>
            </div>
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
        <div class="selected-filters-summary" v-if="selectedCategory !== 'all' || selectedBrand !== '' || selectedPriceRange !== 'all' || selectedYear !== null || selectedSeats !== 'all'">
          <div class="summary-items">
            <div class="summary-item" v-if="selectedCategory !== 'all'">
              {{ getCategoryDisplayName(selectedCategory) }}
            </div>
            <div class="summary-item" v-if="selectedBrand !== ''">
              {{ selectedBrand }}
            </div>
            <div class="summary-item" v-if="selectedPriceRange !== 'all'">
              {{ getPriceDisplayName(selectedPriceRange) }}
            </div>
            <div class="summary-item" v-if="selectedYear !== null">
              {{ getYearDisplayName(selectedYear) }}{{ $t('search.filters.year') }}
            </div>
            <div class="summary-item" v-if="selectedSeats !== 'all'">
              {{ getSeatsDisplayName(selectedSeats) }}
            </div>
          </div>
        </div>

        <!-- 选项卡 -->
        <el-tabs v-model="activeTab" class="filter-tabs">
          <!-- 分类选项卡 -->
          <el-tab-pane :label="$t('search.filters.category')" name="category">
            <div class="tab-content">
              <div class="filter-options-mobile">
                <el-button
                  :type="selectedCategory === 'all' ? 'primary' : 'default'"
                  @click="handleMobileCategoryChange('all')"
                  class="filter-btn-mobile"
                  :class="{ 'is-selected': selectedCategory === 'all' }"
                >
                  <el-icon><Grid /></el-icon>
                  {{ $t('search.filters.allVehicles') }}
                </el-button>
                <el-button
                  v-for="category in categories"
                  :key="category.value"
                  :type="selectedCategory === category.value ? 'primary' : 'default'"
                  @click="handleMobileCategoryChange(category.value)"
                  class="filter-btn-mobile"
                  :class="{ 'is-selected': selectedCategory === category.value }"
                >
                  <el-icon><component :is="category.icon" /></el-icon>
                  {{ category.label }}
                </el-button>
              </div>
            </div>
          </el-tab-pane>

          <!-- 品牌选项卡 -->
          <el-tab-pane :label="$t('search.filters.brand')" name="brand">
            <div class="tab-content">
              <div class="filter-options-mobile">
                <el-button
                  :type="selectedBrand === '' ? 'primary' : 'default'"
                  @click="handleMobileBrandChange('')"
                  class="filter-btn-mobile"
                  :class="{ 'is-selected': selectedBrand === '' }"
                >
                  {{ $t('search.filters.allVehicles') }}
                </el-button>
                <el-button
                  v-for="brand in brands"
                  :key="brand.brand"
                  :type="selectedBrand === brand.brand ? 'primary' : 'default'"
                  @click="handleMobileBrandChange(brand.brand)"
                  class="filter-btn-mobile"
                  :class="{ 'is-selected': selectedBrand === brand.brand }"
                >
                  {{ brand.brand }}
                </el-button>
              </div>
            </div>
          </el-tab-pane>

          <!-- 价格选项卡 -->
          <el-tab-pane :label="$t('search.filters.priceRangeTitle')" name="price">
            <div class="tab-content">
              <div class="filter-options-mobile">
                <el-button
                  v-for="range in priceRanges"
                  :key="range.value"
                  :type="selectedPriceRange === range.value ? 'primary' : 'default'"
                  @click="handleMobilePriceRangeChange(range.value)"
                  class="filter-btn-mobile"
                  :class="{ 'is-selected': selectedPriceRange === range.value }"
                >
                  {{ range.label }}
                </el-button>
              </div>
            </div>
          </el-tab-pane>

          <!-- 年份选项卡 -->
          <el-tab-pane :label="$t('search.filters.year')" name="year">
            <div class="tab-content">
              <div class="filter-options-mobile">
                <el-button
                  :type="selectedYear === null ? 'primary' : 'default'"
                  @click="handleMobileYearChange(null)"
                  class="filter-btn-mobile"
                  :class="{ 'is-selected': selectedYear === null }"
                >
                  {{ $t('search.filters.allVehicles') }}
                </el-button>
                <el-button
                  v-for="year in availableYears"
                  :key="year"
                  :type="selectedYear === year ? 'primary' : 'default'"
                  @click="handleMobileYearChange(year)"
                  class="filter-btn-mobile"
                  :class="{ 'is-selected': selectedYear === year }"
                >
                  {{ year }}
                </el-button>
              </div>
            </div>
          </el-tab-pane>

          <!-- 座位数选项卡 -->
          <el-tab-pane label="座位数" name="seats">
            <div class="tab-content">
              <div class="filter-options-mobile">
                <el-button
                  :type="selectedSeats === 'all' ? 'primary' : 'default'"
                  @click="handleMobileSeatsChange('all')"
                  class="filter-btn-mobile"
                  :class="{ 'is-selected': selectedSeats === 'all' }"
                >
                  <el-icon><UserIcon /></el-icon>
                  {{ $t('search.filters.seats.all') }}
                </el-button>
                <el-button
                  v-for="seat in seatOptions"
                  :key="seat.value"
                  :type="selectedSeats === seat.value ? 'primary' : 'default'"
                  @click="handleMobileSeatsChange(seat.value)"
                  class="filter-btn-mobile"
                  :class="{ 'is-selected': selectedSeats === seat.value }"
                >
                  <el-icon><UserIcon /></el-icon>
                  {{ seat.label }}
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
import { ArrowLeft, Search, Phone, Van, Box, Bicycle, Star, Grid, ArrowDown, Close, Loading } from '@element-plus/icons-vue'
import { Calendar, Tickets, User as UserIcon, Cpu, Setting } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

import { vehicleAPI } from '@/utils/api'
import { getImageUrl } from '@/config/api'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()


// 抽屉尺寸逻辑已移至 VehicleDetailDrawer 组件

// 搜索关键词
const searchKeyword = ref(route.query.car_model || '')

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
const selectedCategory = ref('private') // 默认显示私家车
const selectedBrand = ref('')
const selectedPriceRange = ref('all')
const selectedYear = ref(null)
const selectedSeats = ref('all')

// 筛选备份状态 - 用于取消时恢复
const backupCategory = ref('private') // 默认显示私家车
const backupBrand = ref('')
const backupPriceRange = ref('all')
const backupYear = ref(null)
const backupSeats = ref('all')

// 筛选抽屉状态
const filterDrawerVisible = ref(false)
const activeTab = ref('category') // 默认打开分类选项卡

// API相关状态
const vehicles = ref([])
const brands = ref([]) // 品牌列表
const loading = ref(false)
const loadingMore = ref(false) // 加载更多状态
const isFetching = ref(false) // 防重复请求标志
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

// 座位数选项
const seatOptions = computed(() => [
  { label: t('search.filters.seats.5'), value: '5' },
  { label: t('search.filters.seats.6'), value: '6' },
  { label: t('search.filters.seats.7'), value: '7' }
])



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
  if (!Array.isArray(vehicles)) {
    console.warn('processVehicleData: vehicles不是数组', vehicles)
    return []
  }
  
  return vehicles.map(vehicle => {
    // 验证必要字段
    if (!vehicle || typeof vehicle !== 'object') {
      console.warn('processVehicleData: 无效的车辆数据', vehicle)
      return null
    }
    
    return {
      id: vehicle.id || vehicle.vehicle_id || '',
      vehicle_id: vehicle.vehicle_id || vehicle.id || '',
      name: vehicle.car_brand && vehicle.car_model 
        ? `${vehicle.car_brand} ${vehicle.car_model}`
        : vehicle.name || '未知車型',
      year: vehicle.year || '',
      fuelType: vehicle.fuel_type || '',
      seats: vehicle.seats || '',
      price: vehicle.price || '',
      currentPrice: vehicle.current_price || vehicle.price || '',
      originalPrice: vehicle.original_price || '',
      // 选择第一张图片（避免随机选择导致的重复计算）
      image: vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 0 
        ? getImageUrl(vehicle.images[0].image_url || vehicle.images[0])
        : null,
      // 联系人信息
      contactName: vehicle.contact_name || '暫無聯繫人',
      phoneNumber: vehicle.phone_number || '暫無電話',
      category: vehicle.vehicle_type || '',
      badge: getVehicleStatusBadge(vehicle.vehicle_status),
      // 额外信息
      transmission: vehicle.transmission || '',
      engineVolume: vehicle.engine_volume || '',
      description: vehicle.description || ''
    }
  }).filter(Boolean) // 过滤掉无效数据
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
  if (!currentPrice || currentPrice === '0.00') return '價格面議'
  
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

// 价格格式化缓存
const priceCache = new Map()
const MAX_CACHE_SIZE = 200 // 增加缓存大小

// 获取格式化的价格信息（优化性能，避免重复调用）
const getFormattedPrice = (car) => {
  // 生成缓存键
  const cacheKey = `${car.currentPrice}_${car.originalPrice}`
  
  // 检查缓存
  if (priceCache.has(cacheKey)) {
    return priceCache.get(cacheKey)
  }
  
  // 计算价格
  const formattedPrice = formatPrice(car.currentPrice, car.originalPrice)
  
  // 缓存结果（限制缓存大小，避免内存泄漏）
  if (priceCache.size > MAX_CACHE_SIZE) {
    // 清除最早的缓存项
    const firstKey = priceCache.keys().next().value
    priceCache.delete(firstKey)
  }
  
  priceCache.set(cacheKey, formattedPrice)
  return formattedPrice
}

// 详情抽屉内价格展示专用（防止出现对象字符串化）
const formatCurrencyHKD = (value) => {
  if (!value || Number(value) === 0) return '價格面議'
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
  return selectedCategory.value !== 'all' || 
         selectedBrand.value !== '' ||
         selectedPriceRange.value !== 'all' || 
         selectedYear.value !== null ||
         selectedSeats.value !== 'all'
})

// 详情抽屉相关状态
const detailDrawerVisible = ref(false)
const detailLoading = ref(false)
const detailError = ref(false)
const detailData = ref(null)
const detailImageIndex = ref(0)
const currentDetailId = ref(null)

// 判断是否为指定用户（mingge）
const isMinggeUser = computed(() => {
  // 确保用户状态已完全初始化
  if (!userStore.isInitialized || userStore.isInitializing) {
    return false
  }
  return userStore.isLoggedIn && userStore.userInfo?.username === 'mingge'
})

// 处理车辆点击
function handleCarClick(car) {
  // 立即显示抽屉，提供即时反馈
  detailDrawerVisible.value = true
  detailLoading.value = true
  detailError.value = false
  detailData.value = null
  detailImageIndex.value = 0
  currentDetailId.value = car.vehicle_id
  
  // 预填充基本信息（从列表数据中获取）
  detailData.value = {
    id: car.id,
    vehicle_id: car.vehicle_id,
    brand: car.car_brand || '',
    model: car.car_model || '',
    vehicle_type: car.vehicle_type || '',
    fuel_type: car.fuelType || '',
    seats: car.seats || '',
    year: car.year || '',
    current_price: car.currentPrice,
    original_price: car.originalPrice,
    contact_name: car.contactName || '明哥',
    phone_number: car.phoneNumber || '98702065',
    images: car.image ? [car.image] : [],
    // 标记为预填充数据，需要后续更新
    _isPreloaded: true
  }
  
  // 异步加载完整数据
  loadFullDetailData(car.vehicle_id)
  
  // 清除点击状态（300ms后）
  setTimeout(() => {
    currentDetailId.value = null
  }, 300)
}

// 加载完整详情数据
async function loadFullDetailData(vehicleId, retryCount = 0) {
  try {
    // 兼容不同返回结构
    const res = await vehicleAPI.getVehicleDetail(vehicleId)
    
    const rawData = res?.vehicle || res
    
    // 数据格式转换，适配VehicleDetailDrawer组件
    if (rawData) {
      // 根据用户权限和车辆类型过滤价格信息
      const isSpecialOffer = rawData.is_special_offer === 1
      
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
        // 根据用户权限和特价标识过滤价格信息
        current_price: isMinggeUser.value ? rawData.current_price : (isSpecialOffer ? 98000 : rawData.current_price),
        original_price: isMinggeUser.value ? rawData.original_price : (isSpecialOffer ? null : rawData.original_price),
        // 根据用户权限过滤联系信息
        contact_name: isMinggeUser.value ? rawData.contact_name : '明哥',
        phone_number: isMinggeUser.value ? rawData.phone_number : '98702065',
        contact_phone: isMinggeUser.value ? (rawData.phone_number || rawData.contact_phone) : '98702065',
        images: rawData.images?.map(img => getImageUrl(typeof img === 'string' ? img : img.image_url)) || []
      }
      // 使用JSON深拷贝避免响应式问题
      detailData.value = JSON.parse(JSON.stringify(transformedData))
      // 确保清除错误状态
      detailError.value = false
    } else {
      detailError.value = '没有获取到车辆数据'
    }
  } catch (e) {
    // 重试机制：最多重试1次，间隔1秒
    if (retryCount < 1) {
      const timeoutId = setTimeout(() => {
        activeTimeouts.delete(timeoutId)
        loadFullDetailData(vehicleId, retryCount + 1)
      }, 1000)
      activeTimeouts.add(timeoutId)
      return
    }
    
    // 重试次数用完，显示错误信息
    detailError.value = e?.message || '加載失敗，請檢查網絡連接後重試'
  } finally {
    detailLoading.value = false
  }
}

// 打开详情抽屉（带重试机制）- 保留原有方法以兼容其他调用
async function openDetailDrawer(vehicleId, retryCount = 0) {
  detailDrawerVisible.value = true
  detailLoading.value = true
  detailError.value = false
  detailData.value = null
  detailImageIndex.value = 0
  currentDetailId.value = vehicleId
  try {
    // 兼容不同返回结构
    const res = await vehicleAPI.getVehicleDetail(vehicleId)
    
    const rawData = res?.vehicle || res
    
    // 数据格式转换，适配VehicleDetailDrawer组件
    if (rawData) {
      // 根据用户权限和车辆类型过滤价格信息
      const isSpecialOffer = rawData.is_special_offer === 1
      
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
        // 根据用户权限和特价标识过滤价格信息
        current_price: isMinggeUser.value ? rawData.current_price : (isSpecialOffer ? 98000 : rawData.current_price),
        original_price: isMinggeUser.value ? rawData.original_price : (isSpecialOffer ? null : rawData.original_price),
        // 根据用户权限过滤联系信息
        contact_name: isMinggeUser.value ? rawData.contact_name : '明哥',
        phone_number: isMinggeUser.value ? rawData.phone_number : '98702065',
        contact_phone: isMinggeUser.value ? (rawData.phone_number || rawData.contact_phone) : '98702065',
        images: rawData.images?.map(img => getImageUrl(typeof img === 'string' ? img : img.image_url)) || []
      }
      // 使用JSON深拷贝避免响应式问题
      detailData.value = JSON.parse(JSON.stringify(transformedData))
      // 确保清除错误状态
      detailError.value = false
    } else {
      detailError.value = '没有获取到车辆数据'
    }
  } catch (e) {
    // 重试机制：最多重试1次，间隔1秒
    if (retryCount < 1) {
      const timeoutId = setTimeout(() => {
        activeTimeouts.delete(timeoutId)
        openDetailDrawer(vehicleId, retryCount + 1)
      }, 1000)
      activeTimeouts.add(timeoutId)
      return
    }
    
    // 重试次数用完，显示错误信息
    detailError.value = e?.message || '加載失敗，請檢查網絡連接後重試'
  } finally {
    detailLoading.value = false
  }
}

// 重新加载详情
const reloadDetail = () => {
  if (currentDetailId.value) openDetailDrawer(currentDetailId.value)
}

// 获取品牌列表
const fetchBrands = async () => {
  try {
    // 直接使用写死的品牌列表，避免API调用失败
    brands.value = brandsList
  } catch (error) {
    console.error('获取品牌列表失败:', error)
    // 即使失败也使用默认品牌列表，确保功能正常
    brands.value = brandsList
  }
}

// 获取车辆数据（支持分页，带重试机制）
const fetchVehicles = async (isLoadMore = false, retryCount = 0) => {
  // 防重复请求
  if (isFetching.value && !isLoadMore) {
    return
  }
  
  if (isLoadMore) {
    // 加载更多时，检查是否还有下一页
    if (!pagination.value.has_next) {
      return
    }
    loadingMore.value = true
  } else {
    loading.value = true
    isFetching.value = true
    // 重置分页状态
    pagination.value.current_page = 1
    // 清空预加载数据
    preloadedData.value = null
  }
  
  try {
    const params = {
      page: isLoadMore ? pagination.value.current_page + 1 : 1,
      limit: 20,
      sort_by: 'year',
      sort_order: 'DESC',
      vehicle_type: 1 // 默认只显示私家车
    }
    
    // 如果选择了分类，覆盖默认的vehicle_type参数
    if (selectedCategory.value && selectedCategory.value !== 'all') {
      const typeId = categoryMapping[selectedCategory.value]
      if (typeId) {
        params.vehicle_type = typeId
      }
    } else if (selectedCategory.value === 'all') {
      // 用户选择了"全部车辆"，删除vehicle_type参数以显示所有类型
      delete params.vehicle_type
    }
    
    // 如果选择了品牌，添加car_brand参数
    if (selectedBrand.value && selectedBrand.value !== '') {
      // 使用完整品牌名作为API参数，确保搜索准确性
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
    
    // 如果选择了座位数，添加seats参数
    if (selectedSeats.value && selectedSeats.value !== 'all') {
      params.seats = selectedSeats.value
    }
    
    // 如果有搜索关键词，作为车型模糊搜索
    if (searchKeyword.value && searchKeyword.value.trim() !== '') {
      // 无论是否选择了品牌，都将搜索关键词作为车型参数传递
      params.car_model = searchKeyword.value.trim()
    }
    
    const response = await vehicleAPI.getVehicles(params)
    
    if (isLoadMore) {
      // 加载更多时，追加数据
      vehicles.value = [...vehicles.value, ...processVehicleData(response.vehicles)]
    } else {
      // 首次加载或筛选时，替换数据
      vehicles.value = processVehicleData(response.vehicles)
    }
    
    // 更新分页状态
    pagination.value = response.pagination
    // 保存到缓存（仅在首次加载时）
    if (!isLoadMore) {

    }
  } catch (error) {
    // 重试机制：最多重试2次，每次间隔1秒
    if (retryCount < 2) {
      const timeoutId = setTimeout(() => {
        activeTimeouts.delete(timeoutId)
        fetchVehicles(isLoadMore, retryCount + 1)
      }, 1000)
      activeTimeouts.add(timeoutId)
      return
    }
    
    // 重试次数用完，显示错误消息
    ElMessage.error('獲取車輛數據失敗，請檢查網絡連接後重試')
    
    // 如果是首次加载失败，显示空状态
    if (!isLoadMore && vehicles.value.length === 0) {
      vehicles.value = []
      pagination.value = {
        current_page: 1,
        total_pages: 1,
        total_count: 0,
        limit: 20,
        has_next: false,
        has_prev: false
      }
    }
  } finally {
    loading.value = false
    loadingMore.value = false
    isFetching.value = false
  }
}

// 通用的筛选处理函数
const handleFilterChange = (filterType, value) => {
  // 清空搜索框内容
  searchKeyword.value = ''
  
  // 更新对应的筛选条件
  switch (filterType) {
    case 'category':
      // 如果点击的是当前已选中的分类，不做任何操作
      if (selectedCategory.value === value) {
        return
      }
      selectedCategory.value = value
      break
    case 'brand':
      selectedBrand.value = value
      break
    case 'priceRange':
      selectedPriceRange.value = value
      break
    case 'year':
      selectedYear.value = value
      break
    case 'seats':
      selectedSeats.value = value
      break
  }
  
  // 清空预加载数据
  preloadedData.value = null
  
  // 重置分页和数据
  resetPaginationAndData()
  
  // 更新路由（路由监听器会自动调用fetchVehicles）
  updateRoute()
}

// 选择分类
const selectCategory = (category) => {
  handleFilterChange('category', category)
}

// 选择品牌
const selectBrand = (brand) => {
  handleFilterChange('brand', brand)
}

// 选择价格区间
const selectPriceRange = (priceRange) => {
  handleFilterChange('priceRange', priceRange)
}

// 选择年份
const selectYear = (year) => {
  handleFilterChange('year', year)
}

// 选择座位数
const selectSeats = (seats) => {
  handleFilterChange('seats', seats)
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
  // 强制关闭筛选抽屉（如果打开的话）
  filterDrawerVisible.value = false
  
  // 清空预加载数据
  preloadedData.value = null
  
  resetPaginationAndData()
  
  // 更新路由（重置为显示全部车辆），路由监听器会自动同步筛选条件并获取数据
  router.push({ query: { category: 'all' } })
}

// 通用的清除筛选条件函数
const handleClearFilter = (filterType) => {
  // 清空搜索框内容
  searchKeyword.value = ''
  
  // 重置对应的筛选条件
  switch (filterType) {
    case 'category':
      selectedCategory.value = 'all'
      break
    case 'brand':
      selectedBrand.value = ''
      break
    case 'priceRange':
      selectedPriceRange.value = 'all'
      break
    case 'year':
      selectedYear.value = null
      break
    case 'seats':
      selectedSeats.value = 'all'
      break
  }
  
  // 清空预加载数据
  preloadedData.value = null
  
  // 更新路由，路由监听器会自动获取数据
  updateRoute()
}

// 清除单个筛选条件
const clearCategory = () => {
  handleClearFilter('category')
}

const clearBrand = () => {
  handleClearFilter('brand')
}

const clearPriceRange = () => {
  handleClearFilter('priceRange')
}

const clearYear = () => {
  handleClearFilter('year')
}

const clearSeats = () => {
  handleClearFilter('seats')
}



// 通用的重置分页和数据函数
const resetPaginationAndData = () => {
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
}

// 执行搜索
const doSearch = () => {
  // 清空预加载数据
  preloadedData.value = null
  
  resetPaginationAndData()
  
  // 更新路由，路由监听器会自动获取数据
  updateRoute()
}

// 品牌映射表（完整品牌名 → URL英文标识）
// 导入统一的品牌配置
// 导入统一的品牌配置和工具函数
import { brandMapping, brandsListWithCount, getBrandFromUrl, getBrandParam } from '@/config/brands'

// 品牌列表数据（使用统一配置）
const brandsList = brandsListWithCount

// 更新路由
function updateRoute() {
  const query = {}
  if (searchKeyword.value) query.car_model = searchKeyword.value
  if (selectedCategory.value && selectedCategory.value !== 'all') query.category = selectedCategory.value
  if (selectedBrand.value && selectedBrand.value !== '') {
    // 使用英文标识作为URL参数，避免中文编码问题
    query.brand = getBrandParam(selectedBrand.value)
  }
  if (selectedPriceRange.value && selectedPriceRange.value !== 'all') query.priceRange = selectedPriceRange.value
  if (selectedYear.value) query.year = selectedYear.value
  if (selectedSeats.value && selectedSeats.value !== 'all') query.seats = selectedSeats.value
  
  router.push({ query })
}

// 滚动监听器 - 实现无限滚动（带节流和性能优化）
let scrollTimeout = null
let lastScrollTop = 0
let scrollDirection = 'down'

// 定时器管理
let activeTimeouts = new Set()

// 缓存DOM元素引用，避免重复查询
let cachedCarsContainer = null
let cachedSearchContent = null
let lastWindowWidth = window.innerWidth

// 获取缓存的DOM元素
const getCachedElements = () => {
  if (lastWindowWidth !== window.innerWidth) {
    // 窗口大小变化时，清除缓存
    cachedCarsContainer = null
    cachedSearchContent = null
    lastWindowWidth = window.innerWidth
  }
  
  if (!cachedCarsContainer) {
    cachedCarsContainer = document.querySelector('.cars-container')
  }
  if (!cachedSearchContent) {
    cachedSearchContent = document.querySelector('.search-content')
  }
  
  return { carsContainer: cachedCarsContainer, searchContent: cachedSearchContent }
}

// 获取滚动位置（优化版本）
const getScrollPosition = () => {
  if (window.innerWidth <= 768) {
    // 移动端：使用 window 滚动
    return {
      scrollTop: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
      scrollHeight: document.documentElement.scrollHeight || document.body.scrollHeight || 0,
      clientHeight: window.innerHeight || document.documentElement.clientHeight || 0
    }
  } else {
    // 桌面端：检查实际的滚动容器
    const { carsContainer, searchContent } = getCachedElements()
    
    if (carsContainer && carsContainer.scrollHeight > carsContainer.clientHeight) {
      return {
        scrollTop: carsContainer.scrollTop,
        scrollHeight: carsContainer.scrollHeight,
        clientHeight: carsContainer.clientHeight
      }
    } else if (searchContent && searchContent.scrollHeight > searchContent.clientHeight) {
      return {
        scrollTop: searchContent.scrollTop,
        scrollHeight: searchContent.scrollHeight,
        clientHeight: searchContent.clientHeight
      }
    } else {
      // 回退到 window 滚动
      return {
        scrollTop: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
        scrollHeight: document.documentElement.scrollHeight || document.body.scrollHeight || 0,
        clientHeight: window.innerHeight || document.documentElement.clientHeight || 0
      }
    }
  }
}

const handleScroll = (event) => {
  // 如果正在加载或没有数据，跳过处理
  if (loadingMore.value || vehicles.value.length === 0 || !pagination.value.has_next) {
    return
  }
  
  // 获取当前滚动位置
  const { scrollTop: currentScrollTop } = getScrollPosition()
  
  // 判断滚动方向，只在下滚时触发加载
  scrollDirection = currentScrollTop > lastScrollTop ? 'down' : 'up'
  lastScrollTop = currentScrollTop
  
  // 如果向上滚动，不触发加载
  if (scrollDirection === 'up') {
    return
  }
  
  // 节流处理，避免频繁触发（移动端使用更长的节流时间）
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
  
  const throttleTime = window.innerWidth <= 768 ? 200 : 150 // 移动端增加节流时间
  
  scrollTimeout = setTimeout(() => {
    // 再次检查状态，防止在节流期间状态发生变化
    if (loadingMore.value || vehicles.value.length === 0 || !pagination.value.has_next) {
      return
    }
    
    const { scrollTop, scrollHeight, clientHeight } = getScrollPosition()
    
    // 当距离底部一定距离时触发加载更多，PC端增加触发距离提前加载
    const triggerDistance = window.innerWidth <= 768 ? 200 : 400
    
    if (scrollTop + clientHeight >= scrollHeight - triggerDistance) {
      loadMore()
    }
  }, throttleTime)
}

// 预加载状态
const preloadingNextPage = ref(false)
const preloadedData = ref(null)

// 预加载下一页数据（带重试机制）
const preloadNextPage = async (retryCount = 0) => {
  // 如果已经在预加载或没有下一页，跳过
  if (preloadingNextPage.value || !pagination.value.has_next || vehicles.value.length === 0) {
    return
  }
  
  preloadingNextPage.value = true
  
  try {
    const params = {
      page: pagination.value.current_page + 1,
      limit: 20,
      sort_by: 'year',
      sort_order: 'DESC'
    }
    
    // 复制当前筛选条件
    if (selectedCategory.value && selectedCategory.value !== 'all') {
      const typeId = categoryMapping[selectedCategory.value]
      if (typeId) {
        params.vehicle_type = typeId
      }
    }
    
    if (selectedBrand.value && selectedBrand.value !== '') {
      params.car_brand = selectedBrand.value
    }
    
    const priceRangeParams = getPriceRangeParams(selectedPriceRange.value)
    if (Object.keys(priceRangeParams).length > 0) {
      params.min_price = priceRangeParams.min_price
      if (priceRangeParams.max_price !== undefined) {
        params.max_price = priceRangeParams.max_price
      }
    }

    if (selectedYear.value) {
      params.year = selectedYear.value
    }
    
    if (selectedSeats.value && selectedSeats.value !== 'all') {
      params.seats = selectedSeats.value
    }
    
    if (searchKeyword.value && searchKeyword.value.trim() !== '') {
      params.car_model = searchKeyword.value.trim()
    }
    
    const response = await vehicleAPI.getVehicles(params)
    preloadedData.value = {
      vehicles: processVehicleData(response.vehicles),
      pagination: response.pagination
    }
  } catch (error) {
    // 重试机制：最多重试1次，间隔1秒
    if (retryCount < 1) {
      const timeoutId = setTimeout(() => {
        activeTimeouts.delete(timeoutId)
        preloadNextPage(retryCount + 1)
      }, 1000)
      activeTimeouts.add(timeoutId)
      return
    }
    
    // 重试次数用完，预加载失败不影响正常功能
  } finally {
    preloadingNextPage.value = false
  }
}

// 加载更多数据
const loadMore = async () => {
  // 防止重复加载
  if (loadingMore.value || !pagination.value.has_next || vehicles.value.length === 0) {
    return
  }
  
  // 如果有预加载的数据，直接使用
  if (preloadedData.value) {
    vehicles.value = [...vehicles.value, ...preloadedData.value.vehicles]
    pagination.value = preloadedData.value.pagination
    preloadedData.value = null // 清空预加载数据
    
    // 继续预加载下一页
    const timeoutId1 = setTimeout(() => {
      activeTimeouts.delete(timeoutId1)
      preloadNextPage()
    }, 100)
    activeTimeouts.add(timeoutId1)
    return
  }
  
  // 没有预加载数据，正常加载
  await fetchVehicles(true)
  
  // 加载完成后开始预加载下一页
  const timeoutId2 = setTimeout(() => {
    activeTimeouts.delete(timeoutId2)
    preloadNextPage()
  }, 100)
  activeTimeouts.add(timeoutId2)
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
  
  if (window.innerWidth <= 768) {
    // 移动端：监听 window 滚动
    window.addEventListener('scroll', handleScroll, { passive: true })
    // 移动端额外监听 touchmove 事件，提高滚动检测的准确性
    document.addEventListener('touchmove', handleScroll, { passive: true })
  } else {
    // 桌面端：需要监听实际的滚动容器
    // 使用 nextTick 确保 DOM 已渲染
    nextTick(() => {
      const { carsContainer, searchContent } = getCachedElements()
      
      if (carsContainer) {
        carsContainer.addEventListener('scroll', handleScroll, { passive: true })
      }
      if (searchContent) {
        searchContent.addEventListener('scroll', handleScroll, { passive: true })
      }
      // 同时监听 window 滚动作为备用
      window.addEventListener('scroll', handleScroll, { passive: true })
    })
  }
  
  // 监听窗口大小变化，动态调整滚动监听器
  window.addEventListener('resize', handleResize)
}

// 清理滚动监听器
const cleanupScrollListeners = () => {
  // 清理所有可能的滚动监听器
  const { carsContainer, searchContent } = getCachedElements()
  
  if (carsContainer) {
    carsContainer.removeEventListener('scroll', handleScroll)
  }
  if (searchContent) {
    searchContent.removeEventListener('scroll', handleScroll)
  }
  
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('touchmove', handleScroll)
  
  // 清理滚动节流定时器
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
    scrollTimeout = null
  }
  
  // 清理所有活跃的定时器
  activeTimeouts.forEach(timeoutId => {
    clearTimeout(timeoutId)
  })
  activeTimeouts.clear()
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

// 打开移动端筛选抽屉
const openFilterDrawer = () => {
  // 备份当前筛选状态
  backupCategory.value = selectedCategory.value
  backupBrand.value = selectedBrand.value
  backupPriceRange.value = selectedPriceRange.value
  backupYear.value = selectedYear.value
  backupSeats.value = selectedSeats.value
  
  filterDrawerVisible.value = true
  activeTab.value = 'category' // 打开时默认选中分类
  
  // 移动端滚动优化：确保抽屉内容可以正常滚动
  nextTick(() => {
    const tabsContent = document.querySelector('.mobile-filter-drawer .el-tabs__content')
    if (tabsContent) {
      // 强制重新计算滚动区域
      tabsContent.style.overflowY = 'auto'
      tabsContent.style.webkitOverflowScrolling = 'touch'
    }
  })
}

// 关闭移动端筛选抽屉
const closeFilterDrawer = () => {
  // 恢复到备份的筛选状态
  selectedCategory.value = backupCategory.value
  selectedBrand.value = backupBrand.value
  selectedPriceRange.value = backupPriceRange.value
  selectedYear.value = backupYear.value
  selectedSeats.value = backupSeats.value
  
  filterDrawerVisible.value = false
}

// 移动端筛选函数（会清空搜索框）
const handleMobileFilterChange = (filterType, value) => {
  // 清空搜索框内容
  searchKeyword.value = ''
  
  // 清空预加载数据
  preloadedData.value = null
  
  // 更新对应的筛选条件
  switch (filterType) {
    case 'category':
      selectedCategory.value = value
      break
    case 'brand':
      selectedBrand.value = value
      break
    case 'priceRange':
      selectedPriceRange.value = value
      break
    case 'year':
      selectedYear.value = value
      break
    case 'seats':
      selectedSeats.value = value
      break
  }
}

const handleMobileCategoryChange = (category) => {
  handleMobileFilterChange('category', category)
}

const handleMobileBrandChange = (brand) => {
  handleMobileFilterChange('brand', brand)
}

const handleMobilePriceRangeChange = (priceRange) => {
  handleMobileFilterChange('priceRange', priceRange)
}

const handleMobileYearChange = (year) => {
  handleMobileFilterChange('year', year)
}

const handleMobileSeatsChange = (seats) => {
  handleMobileFilterChange('seats', seats)
}

// 应用移动端筛选条件
const applyFilters = () => {
  // 清空预加载数据
  preloadedData.value = null
  
  resetPaginationAndData()
  
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
  
  return totalHeight
}

// 更新移动端头部高度（带重试机制）
const updateMobileHeaderHeight = (retryCount = 0) => {
  if (!isMobile.value) {
    return
  }
  
  // 延迟执行，确保DOM完全渲染
  const timeoutId = setTimeout(() => {
    activeTimeouts.delete(timeoutId)
    const calculatedHeight = calculateMobileHeaderHeight()
    
    // 如果计算出的高度是默认值且还有重试次数，则重试
    if (calculatedHeight === 140 && retryCount < 3) {
      updateMobileHeaderHeight(retryCount + 1)
      return
    }
    
    mobileHeaderHeight.value = calculatedHeight
  }, 100) // 延迟100ms确保DOM渲染完成
  activeTimeouts.add(timeoutId)
}

// 获取移动端筛选栏的显示值
const getCategoryDisplayName = (category = selectedCategory.value) => {
  if (category === 'all') {
    return t('search.filters.allVehicles')
  }
  const categoryObj = categories.value.find(c => c.value === category)
  return categoryObj ? categoryObj.label : t('search.filters.allVehicles')
}

const getPriceDisplayName = (priceRange = selectedPriceRange.value) => {
  const range = priceRanges.value.find(r => r.value === priceRange)
  return range ? range.label : t('search.filters.allVehicles')
}

const getYearDisplayName = (year = selectedYear.value) => {
  return year ? year.toString() : t('search.filters.allVehicles')
}

const getSeatsDisplayName = (seats = selectedSeats.value) => {
  if (seats === 'all') {
    return t('search.filters.seats.all')
  }
  const seatObj = seatOptions.value.find(s => s.value === seats)
  return seatObj ? seatObj.label : t('search.filters.seats.all')
}

const getBrandDisplayName = (brand = selectedBrand.value) => {
  return brand && brand !== '' ? brand : t('search.filters.allVehicles')
}

// 监听路由变化，同步筛选条件
watch(() => route.query, (newQuery, oldQuery) => {
  // 同步路由查询参数到筛选条件
  searchKeyword.value = newQuery.car_model || ''
  selectedCategory.value = newQuery.category || 'private' // 默认显示私家车
  // 品牌参数需要特殊处理，使用反向映射
  if (newQuery.brand) {
    selectedBrand.value = getBrandFromUrl(newQuery.brand)
  } else {
    selectedBrand.value = ''
  }
  selectedPriceRange.value = newQuery.priceRange || 'all'
  selectedYear.value = newQuery.year ? parseInt(newQuery.year) : null
  selectedSeats.value = newQuery.seats || 'all'
  
  // 同步备份变量
  backupCategory.value = selectedCategory.value
  backupBrand.value = selectedBrand.value
  backupPriceRange.value = selectedPriceRange.value
  backupYear.value = selectedYear.value
  backupSeats.value = selectedSeats.value
  
  // 清空预加载数据
  preloadedData.value = null
  
  // 重新获取数据
  // 如果是首次加载（oldQuery为空），或者查询参数确实发生了变化
  if (!oldQuery || Object.keys(oldQuery).length === 0) {
    // 首次加载，直接获取数据
    fetchVehicles()
  } else {
    // 检查查询参数是否真的发生了变化
    const oldQueryStr = JSON.stringify(oldQuery)
    const newQueryStr = JSON.stringify(newQuery)
    if (oldQueryStr !== newQueryStr) {
      fetchVehicles()
    }
  }
}, { immediate: true })



// 组件挂载后初始化
onMounted(() => {
  // 获取品牌列表
  fetchBrands()
  
  // 添加滚动监听器到正确的滚动容器
  nextTick(() => {
    setupScrollListeners()
    // 计算移动端头部高度
    updateMobileHeaderHeight()
  })
})

// 组件激活时（从详情页返回）
onActivated(() => {
  // 重新设置滚动监听器
  nextTick(() => {
    setupScrollListeners()
  })
})

// 组件卸载时清理滚动监听器和预加载状态
onUnmounted(() => {
  cleanupScrollListeners()
  // 清理预加载状态
  preloadedData.value = null
  preloadingNextPage.value = false
  // 清理价格缓存
  priceCache.clear()
  // 清理滚动节流定时器
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
    scrollTimeout = null
  }
  // 清理所有定时器
  activeTimeouts.forEach(timeoutId => {
    clearTimeout(timeoutId)
  })
  activeTimeouts.clear()
})

// 组件失活时清理滚动监听器（离开搜索页面时）
onDeactivated(() => {
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

// 监听筛选抽屉状态，优化移动端滚动
watch(filterDrawerVisible, (isVisible) => {
  if (isVisible && isMobile.value) {
    // 抽屉打开时，确保滚动功能正常
    nextTick(() => {
      const tabsContent = document.querySelector('.mobile-filter-drawer .el-tabs__content')
      const tabContent = document.querySelector('.mobile-filter-drawer .tab-content')
      
      if (tabsContent) {
        tabsContent.style.overflowY = 'auto'
        tabsContent.style.webkitOverflowScrolling = 'touch'
        tabsContent.style.touchAction = 'pan-y'
      }
      
      if (tabContent) {
        tabContent.style.overflowY = 'auto'
        tabContent.style.webkitOverflowScrolling = 'touch'
        tabContent.style.touchAction = 'pan-y'
      }
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

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
      
      .filter-btn, .reset-btn {
        width: 100%;
      }
    }

    .filter-display {
      .current-selection {
        padding: 12px 16px;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        
        .selection-label {
          font-size: 12px;
          color: #666;
          margin-right: 8px;
        }
        
        .selection-value {
          font-size: 14px;
          color: #333;
          font-weight: 500;
        }
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

    .seats-select {
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
      padding: 12px 16px 8px 16px;
    }
  }

  // 搜索框和按钮同一行
  .search-filter-row {
    display: flex;
    gap: 6px;
    align-items: center;
    margin-bottom: 4px;

    .search-input {
      flex: 0.7; // 进一步减少搜索框的宽度比例
      
      :deep(.el-input__wrapper) {
        height: 36px;
      }
    }

    .search-btn {
      flex: 0.15; // 给搜索按钮分配固定比例
      padding: 0 12px;
      height: 36px;
      min-width: 48px;
      font-size: 14px;
    }

    .filter-btn {
      flex: 0.15; // 给筛选按钮分配固定比例
      padding: 0 12px;
      height: 36px;
      font-size: 14px;
      min-width: 52px;
      margin-left: 0 !important;
    }
  }

  // 已选择的筛选条件显示
  .selected-filters {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 4px;
    margin-top: 2px;

    .filter-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 3px;
      flex: 1;

      .filter-tag {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        padding: 1px 4px;
        background: #ecf5ff;
        border: 1px solid #b3d8ff;
        border-radius: 10px;
        font-size: 11px;
        color: #409eff;
        line-height: 1.1;
        height: 20px;

        .clear-icon {
          font-size: 9px;
          cursor: pointer;
          color: #909399;
          
          &:hover {
            color: #f56c6c;
          }
        }
      }
    }

    .reset-btn {
      flex-shrink: 0;
      padding: 0;
      height: 20px;
      font-size: 11px;
      color: #909399;
      
      &:hover {
        color: #409eff;
      }
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

    .search-input {
      flex: 1;
    }
  }

  .results-header {
    padding: 0 32px;
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

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      h2 {
        margin: 0;
      }
      
      .results-count {
        margin: 0;
        flex-shrink: 0;
      }
      
      @media (max-width: 768px) {
        .results-count {
          font-size: 12px;
          
          .pagination-info {
            margin-left: 4px;
            font-size: 11px;
          }
        }
      }
    }

    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #333;

      @media (max-width: 768px) {
        font-size: 18px;
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
  position: relative;

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

  &.clicking {
    transform: scale(0.98);
    box-shadow: 0 4px 16px rgba(64, 158, 255, 0.3);
    border: 2px solid #409eff;

    @media (max-width: 768px) {
      transform: scale(0.98);
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(64, 158, 255, 0.1);
      pointer-events: none;
      border-radius: inherit;
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
      
      // 特价车辆标识
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
      
      // 特价车辆价格样式
      &.special-offer-price {
        .price {
          color: #f56c6c !important;
        }

        .current-price {
          color: #f56c6c !important;
        }

        .original-price {
          color: #f56c6c !important;
          opacity: 0.7;
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
  // 确保抽屉在移动端有正确的滚动行为
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  .el-drawer__header {
    display: none; // 隐藏抽屉头部
  }

  .el-drawer__body {
    padding: 0; // 移除抽屉内容区域的默认padding
    overflow: hidden; // 防止抽屉本身滚动
    -webkit-overflow-scrolling: touch; // 优化移动端滚动体验
    touch-action: pan-y; // 允许垂直滚动
  }

  .filter-drawer-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden; // 防止整个容器滚动
    -webkit-overflow-scrolling: touch; // 优化移动端滚动体验
  }

  .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;
    flex-shrink: 0; // 防止头部被压缩

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
    margin: 0 0 20px 0; /* 添加底部间距 */
    padding: 10px 16px; /* 轻量内边距 */
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
    flex-shrink: 0; // 防止被压缩

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
    display: flex;
    flex-direction: column;
    min-height: 0; // 确保flex子元素可以收缩

    .el-tabs__header {
      margin: 0 20px;
      border-bottom: 1px solid #e4e7ed;
      flex-shrink: 0; // 防止头部被压缩
    }

    .el-tabs__content {
      flex: 1;
      overflow-y: auto !important; // 强制启用垂直滚动
      overflow-x: hidden;
      padding: 20px;
      -webkit-overflow-scrolling: touch; // 优化移动端滚动体验
      min-height: 0; // 确保滚动容器有足够的高度
      touch-action: pan-y; // 允许垂直滚动
    }

    .tab-content {
      height: 100%;
      overflow-y: auto !important; // 强制启用垂直滚动
      -webkit-overflow-scrolling: touch;
      min-height: 0; // 确保内容区域可以滚动
      touch-action: pan-y; // 允许垂直滚动
    }

    .filter-options-mobile {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 12px;
      padding: 0;
      min-height: 0; // 确保内容可以正常滚动
      overflow: visible;
      -webkit-overflow-scrolling: touch; // 优化移动端滚动体验
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
    flex-shrink: 0; // 防止底部被压缩

    .el-button {
      min-width: 80px;
    }
  }

  // 移动端特定优化
  @media (max-width: 768px) {
    .el-tabs__content {
      padding: 15px; // 减少移动端内边距
      touch-action: pan-y; // 允许垂直滚动
    }
    
    .tab-content {
      touch-action: pan-y; // 允许垂直滚动
    }
    
    .filter-options-mobile {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); // 调整移动端网格列宽
      gap: 8px; // 减少移动端间距
      touch-action: pan-y; // 允许垂直滚动
    }
    
    .filter-btn-mobile {
      height: 36px; // 调整移动端按钮高度
      font-size: 13px; // 调整移动端字体大小
      touch-action: manipulation; // 优化触摸响应
    }
  }
}

/* 详情抽屉样式已移至 VehicleDetailDrawer 组件 */

/* 加载状态样式 */
.loading-container {
  padding: 20px;
  
  .loading-header {
    margin-bottom: 20px;
  }
  
  .loading-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
  
  .loading-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    
    .loading-card-content {
      padding: 16px;
    }
  }
}

.loading-more {
  padding: 20px;
  
  .loading-more-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 20px;
    color: #909399;
    
    .loading-icon {
      animation: rotate 1s linear infinite;
      font-size: 18px;
    }
    
    .loading-text {
      font-size: 14px;
    }
  }
  
  .loading-more-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 16px;
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

.no-more-data {
  padding: 20px;
  text-align: center;
  
  .no-more-text {
    color: #909399;
    font-size: 14px;
  }
}

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
</style>
