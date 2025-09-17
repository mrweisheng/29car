<template>
  <div class="my-vehicles-page">
    <AppHeader />
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">我的车辆</h1>
        <p class="page-subtitle">管理您发布的车辆信息</p>
      </div>
      
      <div class="vehicles-content">
        <!-- 操作栏 -->
        <div class="toolbar">
          <div class="toolbar-left">
            <el-button type="primary" @click="goToPublish">
              <el-icon><Plus /></el-icon>
              发布新车辆
            </el-button>
          </div>
          <div class="toolbar-right">
            <el-select v-model="filterStatus" placeholder="筛选状态" clearable @change="loadVehicles">
              <el-option label="全部" value="" />
              <el-option label="已发布" :value="1" />
              <el-option label="草稿" :value="2" />
              <el-option label="已下架" :value="3" />
            </el-select>
            <el-select v-model="filterType" placeholder="筛选类型" clearable @change="loadVehicles">
              <el-option label="全部类型" value="" />
              <el-option label="私家车" :value="1" />
              <el-option label="客货车" :value="2" />
              <el-option label="货车" :value="3" />
              <el-option label="电单车" :value="4" />
              <el-option label="经典车" :value="5" />
            </el-select>
          </div>
        </div>

        <!-- 车辆列表 -->
        <div class="vehicles-list" v-loading="loading">
          <div v-if="vehicles.length === 0 && !loading" class="empty-state">
            <el-empty description="暂无车辆数据">
              <el-button type="primary" @click="goToPublish">发布第一辆车</el-button>
            </el-empty>
          </div>
          
          <div v-else class="vehicles-grid">
            <div 
              v-for="vehicle in vehicles" 
              :key="vehicle.id" 
              class="vehicle-card"
            >
              <div class="vehicle-image">
                <img 
                  :src="getVehicleImageUrl(vehicle)" 
                  :alt="`${vehicle.car_brand} ${vehicle.car_model}`"
                  @error="handleImageError"
                />
                <div class="status-badge" :class="getStatusClass(vehicle.publish_status)">
                  {{ getStatusText(vehicle.publish_status) }}
                </div>
              </div>
              
              <div class="vehicle-info">
                <h3 class="vehicle-name">{{ vehicle.car_brand }} {{ vehicle.car_model }}</h3>
                <p class="vehicle-details">{{ vehicle.year }} | {{ vehicle.fuel_type || '未知' }} | {{ formatSeats(vehicle.seats) }}</p>
                <div class="vehicle-price">
                  <span class="price">{{ formatPrice(vehicle.current_price) }}</span>
                </div>
                <div class="vehicle-contact">
                  <el-icon><Phone /></el-icon>
                  <span>{{ vehicle.contact_name || '未知' }} {{ vehicle.phone_number || '' }}</span>
                </div>
                <div class="vehicle-meta">
                  <span class="create-time">发布时间：{{ formatDate(vehicle.created_at) }}</span>
                </div>
              </div>
              
              <div class="vehicle-actions">
                <el-button 
                  size="small" 
                  :type="vehicle.publish_status === 1 ? 'warning' : 'success'"
                  @click="toggleStatus(vehicle)"
                >
                  <el-icon><Switch /></el-icon>
                  {{ vehicle.publish_status === 1 ? '下架' : '上架' }}
                </el-button>
                <el-button 
                  size="small" 
                  type="danger" 
                  @click="deleteVehicle(vehicle)"
                >
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载更多状态 -->
        <div v-if="loadingMore" class="loading-more">
          <div class="loading-more-content">
            <el-icon class="loading-icon"><Loading /></el-icon>
            <span class="loading-text">正在加载更多车辆...</span>
          </div>
        </div>

        <!-- 没有更多数据提示 -->
        <div v-if="!loading && !loadingMore && vehicles.length > 0 && !pagination.has_next" class="no-more-data">
          <div class="no-more-text">没有更多数据了</div>
        </div>

        <!-- 分页（桌面端） -->
        <div class="pagination-wrapper" v-if="pagination.total > 0 && !isMobile">
          <el-pagination
            v-model:current-page="pagination.current_page"
            v-model:page-size="pagination.per_page"
            :page-sizes="[10, 20, 50]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Switch, Phone, Loading } from '@element-plus/icons-vue'
import AppHeader from '@/components/AppHeader.vue'
import { vehicleAPI } from '@/utils/api'
import { getImageUrl } from '@/config/api'

const router = useRouter()

// 移动端检测
const isMobile = ref(window.innerWidth <= 768)

// 数据状态
const vehicles = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const filterStatus = ref('')
const filterType = ref('')

// 分页数据
const pagination = reactive({
  current_page: 1,
  per_page: 20,
  total: 0,
  total_pages: 0,
  has_next: false
})

// 加载车辆列表
const loadVehicles = async (isLoadMore = false) => {
  if (isLoadMore) {
    if (!pagination.has_next) return
    loadingMore.value = true
  } else {
    loading.value = true
    pagination.current_page = 1
  }
  
  try {
    const params = {
      page: isLoadMore ? pagination.current_page + 1 : pagination.current_page,
      limit: pagination.per_page,
      sort_by: 'created_at',
      sort_order: 'DESC'
    }
    
    if (filterStatus.value !== '') {
      params.publish_status = filterStatus.value
    }
    
    if (filterType.value !== '') {
      params.vehicle_type = filterType.value
    }
    
    const response = await vehicleAPI.getMyVehicles(params)
    
    if (isLoadMore) {
      // 加载更多时追加数据
      vehicles.value = [...vehicles.value, ...(response.vehicles || [])]
    } else {
      // 首次加载或筛选时替换数据
      vehicles.value = response.vehicles || []
    }
    
    // 更新分页信息
    if (response.pagination) {
      Object.assign(pagination, response.pagination)
    }
    
  } catch (error) {
    console.error('加载车辆列表失败:', error)
    ElMessage.error('加载车辆列表失败')
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// 格式化价格
const formatPrice = (price) => {
  if (!price || price === '0.00') return '价格面议'
  return `HKD$${parseFloat(price).toLocaleString()}`
}

// 格式化座位数
const formatSeats = (seats) => {
  if (!seats) return '座位未知'
  const seatNumber = seats.match(/\d+/)
  if (seatNumber) {
    return `${seatNumber[0]}座`
  }
  return seats
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 获取状态样式类
const getStatusClass = (status) => {
  switch (status) {
    case 1: return 'published'
    case 2: return 'draft'
    case 3: return 'offline'
    default: return 'unknown'
  }
}

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 1: return '已发布'
    case 2: return '草稿'
    case 3: return '已下架'
    default: return '未知'
  }
}

// 获取车辆图片URL
const getVehicleImageUrl = (vehicle) => {
  const imageUrl = vehicle.images && vehicle.images.length > 0
    ? vehicle.images[0].image_url
    : '/default-car.jpg'
  return getImageUrl(imageUrl)
}

// 图片加载失败处理
const handleImageError = (event) => {
  if (event.target.src.includes('default-car.jpg')) {
    return
  }
  event.target.src = '/default-car.jpg'
}

// 跳转到发布页面
const goToPublish = () => {
  router.push({ path: '/publish' })
}

// 切换车辆状态
const toggleStatus = async (vehicle) => {
  const newStatus = vehicle.publish_status === 1 ? 3 : 1
  const actionText = newStatus === 1 ? '上架' : '下架'
  
  try {
    await ElMessageBox.confirm(
      `确定要${actionText}这辆车吗？`,
      '确认操作',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await vehicleAPI.updateVehicle(vehicle.vehicle_id, {
      publish_status: newStatus
    })
    
    ElMessage.success(`${actionText}成功`)
    loadVehicles()
    
  } catch (error) {
    if (error !== 'cancel') {
      console.error(`${actionText}失败:`, error)
      ElMessage.error(`${actionText}失败`)
    }
  }
}

// 删除车辆
const deleteVehicle = async (vehicle) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除车辆"${vehicle.car_brand} ${vehicle.car_model}"吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error'
      }
    )
    
    await vehicleAPI.deleteVehicle(vehicle.vehicle_id)
    ElMessage.success('删除成功')
    loadVehicles()
    
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 分页处理
const handleSizeChange = (val) => {
  pagination.per_page = val
  pagination.current_page = 1
  loadVehicles()
}

const handleCurrentChange = (val) => {
  pagination.current_page = val
  loadVehicles()
}

// 滚动监听器
let scrollTimeout = null

const handleScroll = () => {
  if (!isMobile.value || loadingMore.value || !pagination.has_next) {
    return
  }
  
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
  
  scrollTimeout = setTimeout(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      loadMore()
    }
  }, 200)
}

const loadMore = () => {
  if (loadingMore.value || !pagination.has_next) return
  loadVehicles(true)
}

// 窗口大小变化处理
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

// 页面加载时获取数据
onMounted(() => {
  loadVehicles()
  
  // 添加滚动监听器
  if (isMobile.value) {
    window.addEventListener('scroll', handleScroll, { passive: true })
  }
  
  // 添加窗口大小变化监听器
  window.addEventListener('resize', handleResize)
})

// 清理监听器
onUnmounted(() => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.my-vehicles-page {
  min-height: 100vh;
  background: linear-gradient(135deg, $primary-color 0%, color-mix(in srgb, $primary-color 80%, white) 100%);
  padding-top: 80px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.vehicles-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 32px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.toolbar-right {
  display: flex;
  gap: 12px;
}

.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.vehicle-card {
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: white;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
}

.vehicle-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .status-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    color: white;
    
    &.published {
      background: #67c23a;
    }
    
    &.draft {
      background: #e6a23c;
    }
    
    &.offline {
      background: #f56c6c;
    }
    
    &.unknown {
      background: #909399;
    }
  }
}

.vehicle-info {
  padding: 16px;
  
  .vehicle-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 8px;
  }
  
  .vehicle-details {
    color: $text-secondary;
    font-size: 0.875rem;
    margin-bottom: 8px;
  }
  
  .vehicle-price {
    margin-bottom: 8px;
    
    .price {
      font-size: 1.125rem;
      font-weight: 600;
      color: $primary-color;
    }
  }
  
  .vehicle-contact {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.875rem;
    color: $text-secondary;
    margin-bottom: 8px;
    
    .el-icon {
      font-size: 16px;
    }
  }
  
  .vehicle-meta {
    .create-time {
      font-size: 0.75rem;
      color: $text-secondary;
    }
  }
}

.vehicle-actions {
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  align-items: center;
  
  // 重置所有按钮的默认样式
  :deep(.el-button) {
    flex: 1;
    margin: 0 !important; // 强制移除所有margin
    height: 32px;
    
    // 确保按钮内容居中对齐
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e4e7ed;
}

// 加载更多样式
.loading-more {
  padding: 20px;
  text-align: center;
  
  .loading-more-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #909399;
    
    .loading-icon {
      animation: rotate 1s linear infinite;
      font-size: 18px;
    }
    
    .loading-text {
      font-size: 14px;
    }
  }
}

.no-more-data {
  padding: 20px;
  text-align: center;
  
  .no-more-text {
    color: #909399;
    font-size: 14px;
    border-top: 1px solid #e4e7ed;
    padding-top: 20px;
    margin: 0 20px;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: -1px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 1px;
      background: #909399;
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

// 响应式设计
@media (max-width: 768px) {
  .container {
    padding: 20px 15px;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .vehicles-content {
    padding: 20px;
  }
  
  .toolbar {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .toolbar-right {
    justify-content: stretch;
    
    .el-select {
      flex: 1;
    }
  }
  
  .vehicles-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .vehicle-actions {
    flex-direction: column;
    gap: 8px;
    
    :deep(.el-button) {
      width: 100%;
      flex: none;
      margin: 0 !important; // 移动端也强制移除margin
      height: 40px; // 移动端按钮稍微高一些
    }
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.8rem;
  }
  
  .vehicles-content {
    padding: 16px;
  }
  
  .toolbar-right {
    flex-direction: column;
  }
}
</style>