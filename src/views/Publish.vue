<template>
  <div class="publish-page">
    <AppHeader />
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">发布车辆</h1>
        <p class="page-subtitle">轻松发布您的车辆信息，快速找到买家</p>
      </div>
      
      <div class="publish-content">
        <el-card class="publish-card">
          <el-form 
            ref="formRef" 
            :model="formData" 
            :rules="formRules" 
            label-width="120px"
            class="publish-form"
          >
            <!-- 基本信息 -->
            <div class="form-section">
              <h3 class="section-title">基本信息</h3>
              
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="车辆品牌" prop="car_brand">
                    <el-select 
                      v-model="formData.car_brand" 
                      placeholder="请选择车辆品牌"
                      clearable
                      filterable
                    >
                      <el-option 
                        v-for="brand in brandsList" 
                        :key="brand.value" 
                        :label="brand.label" 
                        :value="brand.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="车辆型号" prop="car_model">
                    <el-input 
                      v-model="formData.car_model" 
                      placeholder="请输入车辆型号，如：卡罗拉"
                      clearable
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="年份" prop="year">
                    <el-select 
                      v-model="formData.year" 
                      placeholder="请选择年份"
                      clearable
                      filterable
                    >
                      <el-option 
                        v-for="year in yearOptions" 
                        :key="year.value" 
                        :label="year.label" 
                        :value="year.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="价格" prop="price">
                    <el-input 
                      v-model="formData.price" 
                      placeholder="请输入价格，如：15万 或 150000"
                      clearable
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="车辆类型" prop="vehicle_type">
                    <el-select v-model="formData.vehicle_type" placeholder="请选择车辆类型" clearable>
                      <el-option label="私家车" :value="1" />
                      <el-option label="客货车" :value="2" />
                      <el-option label="货车" :value="3" />
                      <el-option label="电单车" :value="4" />
                      <el-option label="经典车" :value="5" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="燃料类型" prop="fuel_type">
                    <el-select v-model="formData.fuel_type" placeholder="请选择燃料类型" clearable>
                      <el-option label="汽油" value="汽油" />
                      <el-option label="柴油" value="柴油" />
                      <el-option label="电动" value="电动" />
                      <el-option label="混合动力" value="混合动力" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="座位数" prop="seats">
                    <el-select v-model="formData.seats" placeholder="请选择座位数" clearable>
                      <el-option label="2座" value="2" />
                      <el-option label="4座" value="4" />
                      <el-option label="5座" value="5" />
                      <el-option label="6座" value="6" />
                      <el-option label="7座" value="7" />
                      <el-option label="8座" value="8" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="发动机容积" prop="engine_volume">
                    <el-select 
                      v-model="formData.engine_volume" 
                      placeholder="请选择发动机容积"
                      clearable
                    >
                      <el-option label="660 以下" value="660 以下" />
                      <el-option label="661-1500" value="661-1500" />
                      <el-option label="1501-2000" value="1501-2000" />
                      <el-option label="2001-2500" value="2001-2500" />
                      <el-option label="2501-3500" value="2501-3500" />
                      <el-option label="3501-4500" value="3501-4500" />
                      <el-option label="4501 以上" value="4501 以上" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="传动方式" prop="transmission">
                <el-select v-model="formData.transmission" placeholder="请选择传动方式" clearable>
                  <el-option label="手动挡" value="手动挡" />
                  <el-option label="自动挡" value="自动挡" />
                  <el-option label="CVT" value="CVT" />
                  <el-option label="双离合" value="双离合" />
                </el-select>
              </el-form-item>
            </div>

            <!-- 车辆图片 -->
            <div class="form-section">
              <h3 class="section-title">车辆图片</h3>
              <el-form-item label="上传图片" prop="images">
                <div class="image-upload-container">
                  <el-upload
                    ref="uploadRef"
                    v-model:file-list="fileList"
                    :action="uploadAction"
                    :headers="uploadHeaders"
                    :before-upload="beforeUpload"
                    :on-success="handleUploadSuccess"
                    :on-error="handleUploadError"
                    :on-remove="handleRemove"
                    :on-preview="handlePreview"
                    list-type="picture-card"
                    :limit="10"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    :auto-upload="false"
                  >
                    <el-icon class="upload-icon"><Plus /></el-icon>
                    <div class="upload-text">上传图片</div>
                  </el-upload>
                  <div class="upload-tips">
                    <p>• 支持 JPEG、JPG、PNG、WEBP 格式</p>
                    <p>• 单张图片最大 5MB</p>
                    <p>• 最多上传 10 张图片</p>
                    <p>• 建议上传车辆外观、内饰等多角度照片</p>
                  </div>
                </div>
              </el-form-item>
            </div>

            <!-- 车辆描述 -->
            <div class="form-section">
              <h3 class="section-title">车辆描述</h3>
              <el-form-item label="车辆描述" prop="description">
                <el-input
                  v-model="formData.description"
                  type="textarea"
                  :rows="4"
                  placeholder="请详细描述车辆的特点、配置、车况等信息..."
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
            </div>

            <!-- 联系信息 -->
            <div class="form-section">
              <h3 class="section-title">联系信息</h3>
              
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="联系人姓名" prop="contact_name">
                    <el-input 
                      v-model="formData.contact_name" 
                      placeholder="请输入联系人姓名"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系电话" prop="phone_number">
                    <el-input 
                      v-model="formData.phone_number" 
                      placeholder="请输入联系电话"
                      clearable
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

  
            <!-- 操作按钮 -->
            <div class="form-actions">
              <el-button @click="goBack">
                <el-icon><ArrowLeft /></el-icon>
                返回
              </el-button>
              <el-button type="primary" @click="submitForm" :loading="submitting">
                <el-icon><Check /></el-icon>
                发布车辆
              </el-button>
            </div>
          </el-form>
        </el-card>
      </div>
    </div>

    <!-- 我的发布车辆 -->
    <div class="my-vehicles-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">我的发布车辆</h2>
          <p class="section-subtitle">管理您已发布的车辆信息</p>
        </div>

        <div class="vehicles-content" v-loading="loadingVehicles">
          <div v-if="myVehicles.length === 0 && !loadingVehicles" class="empty-state">
            <el-empty description="暂无发布的车辆">
              <el-button type="primary" @click="scrollToForm">
                <el-icon><Plus /></el-icon>
                发布第一辆车
              </el-button>
            </el-empty>
          </div>

          <div v-else class="cars-grid">
            <div v-if="myVehicles.length === 0" style="color: red; padding: 20px;">
                DEBUG: myVehicles is empty! Length: {{ myVehicles.length }}
            </div>
            <div
              v-for="car in myVehicles"
              :key="car.id"
              class="car-card"
              @click="handleCarClick(car)"
            >
              <div class="car-image">
                <img
                  :src="getCarImage(car)"
                  :alt="`${car.car_brand} ${car.car_model}`"
                  @error="handleImageError"
                  @load="handleImageLoad"
                  loading="lazy"
                />
                <div v-if="car.is_special_offer === 1" class="car-badge special-offer">
                  <el-icon><Star /></el-icon>
                </div>
                <div v-else class="car-badge new">新上架</div>
              </div>
              <div class="car-info">
                <h3 class="car-name">{{ car.car_brand }} {{ car.car_model }}</h3>
                <p class="car-details">{{ car.year }} | {{ car.fuel_type }} | {{ formatSeats(car.seats) }}</p>
                <div class="car-price" :class="{ 'special-offer-price': car.is_special_offer === 1 }">
                  <template v-if="car.is_special_offer === 1">
                    <span class="current-price">{{ getFormattedPrice(car).currentPrice }}</span>
                  </template>
                  <template v-else>
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
                  </template>
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
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览对话框 -->
    <el-dialog v-model="previewVisible" title="图片预览" width="50%" center>
      <img :src="previewImageUrl" alt="预览图片" style="width: 100%; height: auto;" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Plus, Check, Phone, Star } from '@element-plus/icons-vue'
import AppHeader from '@/components/AppHeader.vue'
import { useUserStore } from '@/stores/user'
import { vehicleAPI } from '@/utils/api'
import { getImageUrl } from '@/config/api'

const router = useRouter()
const userStore = useUserStore()

// 品牌列表（从搜索页面复制）
const brandsList = [
  { value: "豐田 TOYOTA", label: "豐田 TOYOTA" },
  { value: "平治 MERCEDES-BENZ", label: "平治 MERCEDES-BENZ" },
  { value: "本田 HONDA", label: "本田 HONDA" },
  { value: "寶馬 BMW", label: "寶馬 BMW" },
  { value: "保時捷 PORSCHE", label: "保時捷 PORSCHE" },
  { value: "奧迪 AUDI", label: "奧迪 AUDI" },
  { value: "日產 NISSAN", label: "日產 NISSAN" },
  { value: "特斯拉 TESLA", label: "特斯拉 TESLA" },
  { value: "凌志 LEXUS", label: "凌志 LEXUS" },
  { value: "五十鈴 ISUZU", label: "五十鈴 ISUZU" },
  { value: "福士 VOLKSWAGEN", label: "福士 VOLKSWAGEN" },
  { value: "越野路華 LAND ROVER", label: "越野路華 LAND ROVER" },
  { value: "鈴木 SUZUKI", label: "鈴木 SUZUKI" },
  { value: "富士 SUBARU", label: "富士 SUBARU" },
  { value: "萬事得 MAZDA", label: "萬事得 MAZDA" },
  { value: "三菱 MITSUBISHI", label: "三菱 MITSUBISHI" },
  { value: "起亞 KIA", label: "起亞 KIA" },
  { value: "法拉利 FERRARI", label: "法拉利 FERRARI" },
  { value: "迷你 MINI", label: "迷你 MINI" },
  { value: "現代 HYUNDAI", label: "現代 HYUNDAI" },
  { value: "福特 FORD", label: "福特 FORD" },
  { value: "賓利 BENTLEY", label: "賓利 BENTLEY" },
  { value: "富豪 VOLVO", label: "富豪 VOLVO" },
  { value: "日野 HINO", label: "日野 HINO" },
  { value: "林寶堅尼 LAMBORGHINI", label: "林寶堅尼 LAMBORGHINI" },
  { value: "瑪莎拉蒂 MASERATI", label: "瑪莎拉蒂 MASERATI" },
  { value: "勞斯萊斯 ROLLS ROYCE", label: "勞斯萊斯 ROLLS ROYCE" },
  { value: "麥拿倫 MCLAREN", label: "麥拿倫 MCLAREN" },
  { value: "積架 JAGUAR", label: "積架 JAGUAR" },
  { value: "標緻 PEUGEOT", label: "標緻 PEUGEOT" },
  { value: "比亞迪 BYD", label: "比亞迪 BYD" },
  { value: "阿士頓馬田 ASTON MARTIN", label: "阿士頓馬田 ASTON MARTIN" },
  { value: "MAXUS", label: "MAXUS" },
  { value: "蓮花 LOTUS", label: "蓮花 LOTUS" },
  { value: "SMART", label: "SMART" },
  { value: "大發 DAIHATSU", label: "大發 DAIHATSU" },
  { value: "愛快 ALFAROMEO", label: "愛快 ALFAROMEO" },
  { value: "雷諾 RENAULT", label: "雷諾 RENAULT" },
  { value: "INFINITI", label: "INFINITI" },
  { value: "JEEP", label: "JEEP" },
  { value: "東風 DONGFENG", label: "東風 DONGFENG" },
  { value: "路華 ROVER", label: "路華 ROVER" },
  { value: "先進 CITROEN", label: "先進 CITROEN" },
  { value: "雙龍 SSANGYONG", label: "雙龍 SSANGYONG" },
  { value: "MG", label: "MG" },
  { value: "快意 FIAT", label: "快意 FIAT" },
  { value: "SCANIA", label: "SCANIA" },
  { value: "福田 FOTON", label: "福田 FOTON" },
  { value: "江淮 JAC", label: "江淮 JAC" },
  { value: "大實力 UD", label: "大實力 UD" },
  { value: "猛獅 MAN", label: "猛獅 MAN" },
  { value: "中國重汽 SINOTRUK", label: "中國重汽 SINOTRUK" },
  { value: "歐寶 OPEL", label: "歐寶 OPEL" },
  { value: "紳寶 SAAB", label: "紳寶 SAAB" }
]

// 年份选项（1990-2025）
const yearOptions = []
for (let year = 2025; year >= 1990; year--) {
  yearOptions.push({ value: year.toString(), label: year.toString() })
}

// 表单引用
const formRef = ref()
const uploadRef = ref()

// 表单数据
const formData = reactive({
  car_brand: '',
  car_model: '',
  year: '',
  price: '',
  vehicle_type: 1,
  fuel_type: '',
  seats: '',
  engine_volume: '',
  transmission: '',
  description: '',
  contact_name: '',
  phone_number: ''
})

// 文件列表
const fileList = ref([])

// 加载状态
const submitting = ref(false)

// 我的车辆数据
const myVehicles = ref([])
const loadingVehicles = ref(false)

// 图片预览
const previewVisible = ref(false)
const previewImageUrl = ref('')

// 上传配置
const uploadAction = computed(() => {
  return import.meta.env.VITE_API_BASE_URL + '/vehicles/publish'
})

const uploadHeaders = computed(() => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
})

// 表单验证规则
const formRules = {
  car_brand: [
    { required: true, message: '请输入车辆品牌', trigger: 'blur' }
  ],
  car_model: [
    { required: true, message: '请输入车辆型号', trigger: 'blur' }
  ],
  year: [
    { required: true, message: '请输入年份', trigger: 'blur' },
    { pattern: /^\d{4}$/, message: '年份格式不正确，请输入4位数字', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' }
  ],
  contact_name: [
    { required: true, message: '请输入联系人姓名', trigger: 'blur' }
  ],
  phone_number: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^(\d{11}|\d{8})$/, message: '请输入正确的电话号码格式（大陆11位或香港8位）', trigger: 'blur' }
  ]
}

// 上传前检查
const beforeUpload = (file) => {
  const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isValidType) {
    ElMessage.error('只能上传 JPEG、JPG、PNG、WEBP 格式的图片!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

// 上传成功处理
const handleUploadSuccess = (response, file) => {
  ElMessage.success('图片上传成功')
}

// 上传失败处理
const handleUploadError = (error, file) => {
  ElMessage.error('图片上传失败: ' + error.message)
}

// 移除图片
const handleRemove = (file) => {
  // 处理图片移除逻辑
}

// 预览图片
const handlePreview = (file) => {
  previewImageUrl.value = file.url || file.response?.url
  previewVisible.value = true
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    
    submitting.value = true
    
    // 创建 FormData
    const formDataToSubmit = new FormData()
    
    // 添加表单字段
    Object.keys(formData).forEach(key => {
      if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
        formDataToSubmit.append(key, formData[key])
      }
    })
    
    // 添加图片文件
    fileList.value.forEach((file, index) => {
      if (file.raw) {
        formDataToSubmit.append('images', file.raw)
      }
    })
    
    // 调用API
    const response = await vehicleAPI.publishVehicle(formDataToSubmit)
    
    ElMessage.success('车辆发布成功！')

    // 刷新我的车辆列表
    await loadMyVehicles()

    // 滚动到我的车辆区域
    setTimeout(() => {
      document.querySelector('.my-vehicles-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 500)
    
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败: ' + (error.message || '未知错误'))
  } finally {
    submitting.value = false
  }
}


// 返回
const goBack = () => {
  router.go(-1)
}

// 加载我的车辆列表
const loadMyVehicles = async () => {
  loadingVehicles.value = true
  try {
    console.log('loadMyVehicles called')
    const response = await vehicleAPI.getMyVehicles({
      page: 1,
      limit: 10,
      sort_by: 'created_at',
      sort_order: 'DESC'
    })
    console.log('loadMyVehicles response:', response)
    myVehicles.value = response.vehicles || []
    console.log('myVehicles set to:', myVehicles.value)
  } catch (error) {
    console.error('加载我的车辆失败:', error)
    // 不显示错误，避免影响发布体验
  } finally {
    loadingVehicles.value = false
  }
}

// 计算属性
const isMinggeUser = computed(() => {
  return userStore.isLoggedIn && userStore.username === 'mingge'
})

// 获取车辆图片
const getCarImage = (car) => {
  const imageUrl = car.images && car.images.length > 0
    ? car.images[0].image_url
    : '/default-car.jpg'
  const result = getImageUrl(imageUrl)
  console.log('getCarImage debug:', { imageUrl, result, env: import.meta.env.VITE_IMAGE_BASE_URL })
  return result
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

// 获取格式化价格
const getFormattedPrice = (car) => {
  const currentPrice = car.current_price
  const originalPrice = car.original_price

  if (!currentPrice || currentPrice === '0.00' || currentPrice === 0) {
    return '价格面议'
  }

  const formattedCurrent = `HKD$${parseFloat(currentPrice).toLocaleString()}`

  if (!originalPrice || originalPrice === '0.00' || originalPrice === 0) {
    return {
      currentPrice: formattedCurrent,
      hasDiscount: false
    }
  }

  const current = parseFloat(currentPrice)
  const original = parseFloat(originalPrice)

  if (current >= original) {
    return {
      currentPrice: formattedCurrent,
      hasDiscount: false
    }
  }

  const discountPercent = Math.round(((original - current) / original) * 100)

  return {
    currentPrice: formattedCurrent,
    originalPrice: `HKD$${original.toLocaleString()}`,
    hasDiscount: true,
    discountPercent
  }
}

// 图片加载失败处理
const handleImageError = (event) => {
  if (event.target.src.includes('default-car.jpg')) {
    return
  }
  event.target.src = '/default-car.jpg'
}

// 图片加载成功处理
const handleImageLoad = (event) => {
  // 图片加载成功后的处理
}

// 滚动到表单
const scrollToForm = () => {
  document.querySelector('.publish-card')?.scrollIntoView({ behavior: 'smooth' })
}

// 车辆点击处理
const handleCarClick = (car) => {
  router.push({ path: `/vehicle/${car.vehicle_id}` })
}

// 检查登录状态
onMounted(() => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录后再发布车辆')
    router.push({ path: '/auth' })
    return
  }

  // 联系人信息不预填充，用户需要手动输入

  // 加载用户已发布的车辆
  loadMyVehicles()
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.publish-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.publish-content {
  display: flex;
  justify-content: center;
}

.publish-card {
  width: 100%;
  max-width: 900px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.publish-form {
  padding: 40px;
}

.form-section {
  margin-bottom: 32px;
  
  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 20px;
    padding-bottom: 8px;
    border-bottom: 2px solid $primary-color;
    display: inline-block;
  }
}

.image-upload-container {
  .upload-tips {
    margin-top: 16px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid $primary-color;
    
    p {
      margin: 4px 0;
      font-size: 0.875rem;
      color: $text-secondary;
      
      &:first-child {
        margin-top: 0;
      }
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.upload-icon {
  font-size: 28px;
  color: #8c939d;
  margin-bottom: 8px;
}

.upload-text {
  color: #8c939d;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid #e4e7ed;
}

// 我的发布车辆区域
.my-vehicles-section {
  background: #f8f9fa;
  padding: 60px 0;
  margin-top: 40px;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .section-header {
    text-align: center;
    margin-bottom: 40px;

    .section-title {
      font-size: 2rem;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: 12px;
    }

    .section-subtitle {
      font-size: 1.1rem;
      color: $text-secondary;
    }
  }

  .vehicles-content {
    background: white;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  .cars-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
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
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 4px;

        &.special-offer {
          background: linear-gradient(135deg, #ff6b6b, #ff8e53);
        }

        &.new {
          background: linear-gradient(135deg, #4ecdc4, #44a08d);
        }
      }
    }

    .car-info {
      padding: 16px;

      .car-name {
        font-size: 1.125rem;
        font-weight: 600;
        color: $text-primary;
        margin-bottom: 8px;
        line-height: 1.3;
      }

      .car-details {
        color: $text-secondary;
        font-size: 0.875rem;
        margin-bottom: 12px;
      }

      .car-price {
        margin-bottom: 12px;

        &.special-offer-price {
          .current-price {
            color: #ff6b6b;
            font-weight: 700;
          }
        }

        .price-container {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .current-price {
          font-size: 1.125rem;
          font-weight: 600;
          color: $primary-color;
        }

        .original-price {
          font-size: 0.875rem;
          color: $text-secondary;
          text-decoration: line-through;
        }

        .discount-badge {
          background: #ff6b6b;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .price {
          font-size: 1.125rem;
          font-weight: 600;
          color: $primary-color;
        }
      }

      .car-contact {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.875rem;
        color: $text-secondary;
        margin-bottom: 8px;

        .el-icon {
          font-size: 16px;
          color: $primary-color;
        }
      }

      .car-extra {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;

        .extra-item {
          background: #f8f9fa;
          color: $text-secondary;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          border: 1px solid #e9ecef;
        }
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
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
  
  .publish-form {
    padding: 30px 20px;
  }
  
  .publish-card {
    max-width: 100%;
  }
  
  .form-actions {
    flex-direction: column;
    
    .el-button {
      width: 100%;
    }
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.8rem;
  }
  
  .publish-form {
    padding: 20px 15px;
  }
  
  .form-section {
    margin-bottom: 24px;
    
    .section-title {
      font-size: 1.125rem;
    }
  }
}

// Element Plus 样式覆盖
:deep(.el-form-item__label) {
  font-weight: 500;
  color: $text-primary;
}

:deep(.el-upload--picture-card) {
  width: 104px;
  height: 104px;
  border-radius: 8px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 104px;
  height: 104px;
  border-radius: 8px;
}

:deep(.el-radio-group) {
  .el-radio {
    margin-right: 24px;
  }
}
</style>
