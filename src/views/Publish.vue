<template>
  <div class="publish-page">
    <AppHeader />
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">发布车辆</h1>
        <p class="page-subtitle">轻松发布您的车辆信息，快速找到买家</p>
      </div>
      
      <div class="vehicles-content">
        <el-card class="publish-card">
          <el-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            :label-width="isMobile ? 'auto' : '120px'"
            :label-position="isMobile ? 'top' : 'right'"
            class="publish-form"
          >
            <!-- 基本信息 -->
            <div class="form-section">
              <h3 class="section-title">基本信息</h3>

              <!-- 第一行：PC端(车辆品牌+车辆型号+年份) 移动端(车辆品牌单独一行) -->
              <el-row :gutter="isMobile ? 0 : 20">
                <el-col :span="isMobile ? 24 : 8">
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
                <el-col :span="isMobile ? 0 : 8" v-if="!isMobile">
                  <el-form-item label="车辆型号" prop="car_model">
                    <el-input
                      v-model="formData.car_model"
                      placeholder="如 E300"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="isMobile ? 0 : 8" v-if="!isMobile">
                  <el-form-item label="年份" prop="year">
                    <el-select
                      v-model="formData.year"
                      placeholder="请选择年份"
                      clearable
                    >
                      <el-option
                        v-for="year in yearsList"
                        :key="year"
                        :label="year"
                        :value="year"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 移动端：车辆型号和传动方式同一行 -->
              <el-row :gutter="16" v-if="isMobile">
                <el-col :span="12">
                  <el-form-item label="车辆型号" prop="car_model">
                    <el-input
                      v-model="formData.car_model"
                      placeholder="请输入车辆型号"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="传动方式" prop="transmission">
                    <el-select
                      v-model="formData.transmission"
                      placeholder="请选择传动方式"
                      clearable
                    >
                      <el-option label="自动波 AT" value="自动波 AT" />
                      <el-option label="棍波 MT" value="棍波 MT" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 移动端：年份和车辆类型同一行 -->
              <el-row :gutter="16" v-if="isMobile">
                <el-col :span="12">
                  <el-form-item label="年份" prop="year">
                    <el-select
                      v-model="formData.year"
                      placeholder="请选择年份"
                      clearable
                    >
                      <el-option
                        v-for="year in yearsList"
                        :key="year"
                        :label="year"
                        :value="year"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="车辆类型" prop="car_type">
                    <el-select
                      v-model="formData.car_type"
                      placeholder="私家车"
                      clearable
                    >
                      <el-option label="私家车" value="私家车" />
                      <el-option label="商务车" value="商务车" />
                      <el-option label="货车" value="货车" />
                      <el-option label="客车" value="客车" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 第二行：PC端(价格+车辆类型+燃料类型) 移动端(价格+座位数) -->
              <el-row :gutter="isMobile ? 0 : 20">
                <el-col :span="isMobile ? 12 : 8">
                  <el-form-item label="价格" prop="price">
                    <el-input
                      v-model="formData.price"
                      placeholder="如 150000"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="isMobile ? 12 : 8">
                  <el-form-item :label="isMobile ? '座位数' : '车辆类型'" :prop="isMobile ? 'seats' : 'car_type'">
                    <el-select
                      v-if="isMobile"
                      v-model="formData.seats"
                      placeholder="请选择座位数"
                      clearable
                    >
                      <el-option label="2座" value="2" />
                      <el-option label="4座" value="4" />
                      <el-option label="5座" value="5" />
                      <el-option label="7座" value="7" />
                      <el-option label="8座及以上" value="8+" />
                    </el-select>
                    <el-select
                      v-else
                      v-model="formData.car_type"
                      placeholder="私家车"
                      clearable
                    >
                      <el-option label="私家车" value="私家车" />
                      <el-option label="商务车" value="商务车" />
                      <el-option label="货车" value="货车" />
                      <el-option label="客车" value="客车" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="isMobile ? 0 : 8" v-if="!isMobile">
                  <el-form-item label="燃料类型" prop="fuel_type">
                    <el-select
                      v-model="formData.fuel_type"
                      placeholder="请选择燃料类型"
                      clearable
                    >
                      <el-option label="汽油" value="汽油" />
                      <el-option label="柴油" value="柴油" />
                      <el-option label="电动" value="电动" />
                      <el-option label="混合动力" value="混合动力" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 第三行：PC端(座位数+发动机容积+传动方式) 移动端(燃料类型+发动机容积) -->
              <el-row :gutter="isMobile ? 0 : 20">
                <el-col :span="isMobile ? 12 : 8">
                  <el-form-item :label="isMobile ? '燃料类型' : '座位数'" :prop="isMobile ? 'fuel_type' : 'seats'">
                    <el-select
                      v-if="isMobile"
                      v-model="formData.fuel_type"
                      placeholder="请选择燃料类型"
                      clearable
                    >
                      <el-option label="汽油" value="汽油" />
                      <el-option label="柴油" value="柴油" />
                      <el-option label="电动" value="电动" />
                      <el-option label="混合动力" value="混合动力" />
                    </el-select>
                    <el-select
                      v-else
                      v-model="formData.seats"
                      placeholder="请选择座位数"
                      clearable
                    >
                      <el-option label="2座" value="2" />
                      <el-option label="4座" value="4" />
                      <el-option label="5座" value="5" />
                      <el-option label="7座" value="7" />
                      <el-option label="8座及以上" value="8+" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="isMobile ? 12 : 8">
                  <el-form-item label="发动机容积" prop="engine_capacity">
                    <div class="engine-capacity-select">
                      <el-select
                        v-model="formData.engine_capacity"
                        placeholder="请选择发动机容积"
                        clearable
                      >
                        <el-option
                          v-for="capacity in engineCapacityList"
                          :key="capacity.value"
                          :label="capacity.label"
                          :value="capacity.value"
                        />
                      </el-select>
                      <span class="engine-unit">cc</span>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="isMobile ? 0 : 8" v-if="!isMobile">
                  <el-form-item label="传动方式" prop="transmission">
                    <el-select
                      v-model="formData.transmission"
                      placeholder="请选择传动方式"
                      clearable
                    >
                      <el-option label="自动波 AT" value="自动波 AT" />
                      <el-option label="棍波 MT" value="棍波 MT" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

            </div>

            <!-- 联系信息 -->
            <div class="form-section">
              <h3 class="section-title">联系信息</h3>
              
              <el-row :gutter="isMobile ? 16 : 20">
                <el-col :span="isMobile ? 12 : 12">
                  <el-form-item label="联系人姓名" prop="contact_name">
                    <el-input
                      v-model="formData.contact_name"
                      placeholder="请输入联系人姓名"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="isMobile ? 12 : 12">
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

            <!-- 车辆描述 -->
            <div class="form-section">
              <h3 class="section-title">车辆描述</h3>
              
              <el-row>
                <el-col :span="24">
                  <el-form-item label="车辆描述" prop="description">
                    <el-input
                      v-model="formData.description"
                      type="textarea"
                      :rows="4"
                      placeholder="请简要描述车辆的特点、配置、车况等信息（可选）"
                      clearable
                      maxlength="500"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <!-- 车辆图片 -->
            <div class="form-section">
              <h3 class="section-title">车辆图片</h3>
              <div class="image-upload-container">
                <el-upload
                  v-model:file-list="fileList"
                  action="#"
                  list-type="picture-card"
                  :auto-upload="false"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :before-upload="beforeUpload"
                  multiple
                  :limit="10"
                >
                  <el-icon><Plus /></el-icon>
                  <template #tip>
                    <div class="upload-tips">
                      • 支持 JPEG、JPG、PNG、WEBP 格式 • 单张图片最大 5MB •
                      最多上传 10 张图片 • 建议上传车辆外观、内饰等多角度照片
                    </div>
                  </template>
                </el-upload>
              </div>
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
    <div class="my-vehicles-section" v-if="isMinggeUser">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">我的发布车辆</h2>
          <p class="section-subtitle">管理您已发布的车辆信息</p>
        </div>
        <div class="vehicles-content">
          <div class="cars-grid" v-if="publishedCars.length > 0">
            <div
              v-for="car in publishedCars"
              :key="car.id"
              class="car-card"
              @click="viewCarDetail(car)"
            >
              <div class="car-image">
                <img :src="car.image" :alt="car.title" />
              </div>
              <div class="car-info">
                <h3 class="car-title">{{ car.title }}</h3>
                <p class="car-price">¥{{ car.price.toLocaleString() }}</p>
                <div class="car-details">
                  <span>{{ car.year }}年</span>
                  <span>{{ car.mileage }}万公里</span>
                  <span>{{ car.location }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-cars">
            <p>您还没有发布任何车辆</p>
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, ArrowLeft, Check } from '@element-plus/icons-vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { vehicleAPI } from '@/utils/api'

const router = useRouter()

// 响应式检测
const isMobile = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth <= 768
  }
  return false
})

// 表单引用
const formRef = ref()

// 提交状态
const submitting = ref(false)

// 文件列表
const fileList = ref([])

// 表单数据
const formData = reactive({
  car_brand: '',
  car_model: '',
  year: '',
  price: '',
  car_type: '',
  fuel_type: '',
  seats: '',
  engine_capacity: '',
  transmission: '',
  contact_name: '',
  phone_number: '',
  description: '' // 发布状态固定为1（已发布），不需要用户选择
})

// 表单验证规则
const formRules = {
  car_brand: [
    { required: true, message: '请选择车辆品牌', trigger: 'change' }
  ],
  car_model: [
    { required: true, message: '请输入车辆型号', trigger: 'blur' }
  ],
  year: [
    { required: true, message: '请选择年份', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' }
  ],
  contact_name: [
    { required: true, message: '请输入联系人姓名', trigger: 'blur' }
  ],
  phone_number: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^(\d{11}|\d{8})$/, message: '请输入有效的联系电话（大陆11位或香港8位）', trigger: 'blur' }
  ]
}

// 品牌列表（与搜索页面保持一致）
const brandsList = [
  { label: "豐田 TOYOTA", value: "豐田 TOYOTA" },
  { label: "平治 MERCEDES-BENZ", value: "平治 MERCEDES-BENZ" },
  { label: "本田 HONDA", value: "本田 HONDA" },
  { label: "寶馬 BMW", value: "寶馬 BMW" },
  { label: "保時捷 PORSCHE", value: "保時捷 PORSCHE" },
  { label: "奧迪 AUDI", value: "奧迪 AUDI" },
  { label: "日產 NISSAN", value: "日產 NISSAN" },
  { label: "特斯拉 TESLA", value: "特斯拉 TESLA" },
  { label: "凌志 LEXUS", value: "凌志 LEXUS" },
  { label: "五十鈴 ISUZU", value: "五十鈴 ISUZU" },
  { label: "福士 VOLKSWAGEN", value: "福士 VOLKSWAGEN" },
  { label: "越野路華 LAND ROVER", value: "越野路華 LAND ROVER" },
  { label: "鈴木 SUZUKI", value: "鈴木 SUZUKI" },
  { label: "富士 SUBARU", value: "富士 SUBARU" },
  { label: "萬事得 MAZDA", value: "萬事得 MAZDA" },
  { label: "三菱 MITSUBISHI", value: "三菱 MITSUBISHI" },
  { label: "起亞 KIA", value: "起亞 KIA" },
  { label: "法拉利 FERRARI", value: "法拉利 FERRARI" },
  { label: "迷你 MINI", value: "迷你 MINI" },
  { label: "現代 HYUNDAI", value: "現代 HYUNDAI" },
  { label: "福特 FORD", value: "福特 FORD" },
  { label: "賓利 BENTLEY", value: "賓利 BENTLEY" },
  { label: "富豪 VOLVO", value: "富豪 VOLVO" },
  { label: "日野 HINO", value: "日野 HINO" },
  { label: "林寶堅尼 LAMBORGHINI", value: "林寶堅尼 LAMBORGHINI" },
  { label: "瑪莎拉蒂 MASERATI", value: "瑪莎拉蒂 MASERATI" },
  { label: "勞斯萊斯 ROLLS ROYCE", value: "勞斯萊斯 ROLLS ROYCE" },
  { label: "麥拿倫 MCLAREN", value: "麥拿倫 MCLAREN" },
  { label: "積架 JAGUAR", value: "積架 JAGUAR" },
  { label: "標緻 PEUGEOT", value: "標緻 PEUGEOT" },
  { label: "比亞迪 BYD", value: "比亞迪 BYD" },
  { label: "阿士頓馬田 ASTON MARTIN", value: "阿士頓馬田 ASTON MARTIN" },
  { label: "MAXUS", value: "MAXUS" },
  { label: "蓮花 LOTUS", value: "蓮花 LOTUS" },
  { label: "SMART", value: "SMART" },
  { label: "大發 DAIHATSU", value: "大發 DAIHATSU" },
  { label: "愛快 ALFAROMEO", value: "愛快 ALFAROMEO" },
  { label: "雷諾 RENAULT", value: "雷諾 RENAULT" },
  { label: "INFINITI", value: "INFINITI" },
  { label: "JEEP", value: "JEEP" },
  { label: "東風 DONGFENG", value: "東風 DONGFENG" },
  { label: "路華 ROVER", value: "路華 ROVER" },
  { label: "先進 CITROEN", value: "先進 CITROEN" },
  { label: "雙龍 SSANGYONG", value: "雙龍 SSANGYONG" },
  { label: "MG", value: "MG" },
  { label: "快意 FIAT", value: "快意 FIAT" },
  { label: "SCANIA", value: "SCANIA" },
  { label: "福田 FOTON", value: "福田 FOTON" },
  { label: "江淮 JAC", value: "江淮 JAC" },
  { label: "大實力 UD", value: "大實力 UD" },
  { label: "猛獅 MAN", value: "猛獅 MAN" },
  { label: "中國重汽 SINOTRUK", value: "中國重汽 SINOTRUK" },
  { label: "歐寶 OPEL", value: "歐寶 OPEL" },
  { label: "紳寶 SAAB", value: "紳寶 SAAB" }
]

// 年份列表
const yearsList = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear; i >= 1990; i--) {
    years.push(i.toString())
  }
  return years
})

// 发动机容积列表（1000-6000cc，每100递增）
const engineCapacityList = computed(() => {
  const capacities = []
  for (let i = 1000; i <= 6000; i += 100) {
    capacities.push({ label: i.toString(), value: i.toString() })
  }
  return capacities
})

// 计算属性
const isMinggeUser = computed(() => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  return userInfo.username === 'mingge'
})

// 模拟已发布车辆数据
const publishedCars = ref([
  {
    id: 1,
    title: '奔驰 E300 2020款',
    price: 350000,
    year: 2020,
    mileage: 3.2,
    location: '北京',
    image: '/api/placeholder/300/200'
  },
  {
    id: 2,
    title: '宝马 X5 2019款',
    price: 450000,
    year: 2019,
    mileage: 4.5,
    location: '上海',
    image: '/api/placeholder/300/200'
  }
])

// 方法
const goBack = () => {
  router.go(-1)
}

const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    // 创建FormData对象用于文件上传
    const submitData = new FormData()
    
    // 添加表单字段，需要映射字段名以匹配API要求
    submitData.append('car_brand', formData.car_brand)
    submitData.append('car_model', formData.car_model)
    submitData.append('year', formData.year)
    submitData.append('price', formData.price)
    submitData.append('contact_name', formData.contact_name)
    submitData.append('phone_number', formData.phone_number)
    
    // 可选字段
    if (formData.car_type) {
      // 将车辆类型映射为vehicle_type数字
      const typeMapping = {
        '私家车': 1,
        '商务车': 2, 
        '货车': 3,
        '客车': 4
      }
      submitData.append('vehicle_type', typeMapping[formData.car_type] || 1)
    }
    
    if (formData.fuel_type) submitData.append('fuel_type', formData.fuel_type)
    if (formData.seats) submitData.append('seats', formData.seats)
    if (formData.engine_capacity) submitData.append('engine_volume', formData.engine_capacity)
    if (formData.transmission) submitData.append('transmission', formData.transmission)
    if (formData.description) submitData.append('description', formData.description)
    submitData.append('publish_status', 1) // 固定为已发布状态
    
    // 添加图片文件
    fileList.value.forEach((file, index) => {
      if (file.raw) {
        submitData.append('images', file.raw)
      }
    })
    
    // 调用发布API
    const result = await vehicleAPI.publishVehicle(submitData)
    
    ElMessage.success('车辆发布成功！')
    
    // 跳转到我的车辆页面或首页
    router.push('/my-vehicles')
    
  } catch (error) {
    console.error('发布车辆失败:', error)
    if (error.message) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('发布失败，请检查网络连接后重试')
    }
  } finally {
    submitting.value = false
  }
}

const handlePictureCardPreview = (file) => {
  console.log('预览图片:', file)
}

const handleRemove = (file, fileList) => {
  console.log('移除图片:', file, fileList)
}

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

const viewCarDetail = (car) => {
  console.log('查看车辆详情:', car)
}

// 页面初始化
onMounted(() => {
  // 页面加载完成
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.publish-page {
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

  .page-title {
    font-size: 2.5rem;
    margin-bottom: 12px;
    font-weight: 600;
  }

  .page-subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
    line-height: 1.5;
  }
}

.vehicles-content {
  background: white;
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.publish-card {
  border: none;
  box-shadow: none;
  border-radius: 16px;

  :deep(.el-card__body) {
    padding: 0;
  }
}

.publish-form {
  padding: 32px;
  
  :deep(.el-form-item) {
    margin-bottom: 24px;
  }
  
  :deep(.el-form-item__label) {
    font-size: 1rem !important;
    font-weight: 500;
    color: $text-primary;
    margin-bottom: 8px;
    line-height: 1.4;
  }
}

.form-section {
  margin-bottom: 40px;

  .section-title {
    font-size: 1.3rem;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 2px solid $primary-color;
    color: $text-primary;
    font-weight: 600;
  }
}

.image-upload-container {
  display: flex;
  flex-direction: column;
  gap: 20px;

  :deep(.el-upload--picture-card) {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    border: 2px dashed #d9d9d9;
    transition: all 0.3s;

    &:hover {
      border-color: $primary-color;
    }
  }

  :deep(.el-upload-list--picture-card .el-upload-list__item) {
    width: 120px;
    height: 120px;
    border-radius: 8px;
  }

  .upload-tips {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 16px;
    color: #6c757d;
    font-size: 0.9rem;
    line-height: 1.6;
    max-width: 500px;
  }
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
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
  }

  .car-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .car-image {
      width: 100%;
      height: 200px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
    }

    &:hover .car-image img {
      transform: scale(1.05);
    }

    .car-info {
      padding: 20px;

      .car-title {
        font-size: 1.2rem;
        font-weight: 600;
        color: $text-primary;
        margin-bottom: 8px;
      }

      .car-price {
        font-size: 1.4rem;
        font-weight: 700;
        color: $primary-color;
        margin-bottom: 12px;
      }

      .car-details {
        display: flex;
        gap: 12px;
        font-size: 0.9rem;
        color: $text-secondary;

        span {
          padding: 4px 8px;
          background: #f8f9fa;
          border-radius: 4px;
        }
      }
    }
  }

  .no-cars {
    text-align: center;
    padding: 60px 20px;
    color: $text-secondary;
    font-size: 1.1rem;
  }
}

// 统一表单控件高度 - 强制所有控件使用相同高度
:deep(.el-input),
:deep(.el-select),
:deep(.el-input__wrapper),
:deep(.el-select .el-input__wrapper),
:deep(.el-select__wrapper) {
  min-height: 40px !important;
  height: 40px !important;
}

:deep(.el-input__wrapper),
:deep(.el-select .el-input__wrapper) {
  border-radius: 6px;
  display: flex !important;
  align-items: center !important;
  box-sizing: border-box !important;
}

:deep(.el-input__wrapper) {
  padding: 0 12px !important;
}

:deep(.el-select .el-input__wrapper) {
  padding: 0 30px 0 12px !important;
}

:deep(.el-input__inner),
:deep(.el-select .el-input__inner) {
  height: 100% !important;
  line-height: 1.5 !important;
  border: none !important;
  background: transparent !important;
}

:deep(.el-textarea__inner) {
  padding: 8px 12px;
  min-height: 80px;
  border-radius: 6px;
}

// 确保选择器的下拉箭头垂直居中
:deep(.el-select .el-input__suffix),
:deep(.el-select .el-input__suffix-inner) {
  display: flex !important;
  align-items: center !important;
  height: 100% !important;
}

// 强制覆盖Element Plus的默认样式
:deep(.el-select) {
  width: 100% !important;
  
  .el-input {
    height: 40px !important;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .container {
    padding: 20px 16px;
  }
  
  // 移动端行间距调整
  .el-row {
    margin-left: -8px !important;
    margin-right: -8px !important;
    
    .el-col {
      padding-left: 8px !important;
      padding-right: 8px !important;
    }
  }

  .page-header {
    margin-bottom: 24px;

    .page-title {
      font-size: 1.8rem;
      margin-bottom: 12px;
    }

    .page-subtitle {
      font-size: 1rem;
      line-height: 1.5;
    }
  }

  .publish-card {
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }

  .publish-form {
    padding: 24px 20px;
    
    :deep(.el-form-item) {
      margin-bottom: 24px;
    }
    
    :deep(.el-form-item__label) {
      font-size: 1rem !important;
      font-weight: 500;
      color: $text-primary;
      margin-bottom: 8px;
      line-height: 1.4;
    }
  }

  .form-section {
    margin-bottom: 32px;

    .section-title {
      font-size: 1.2rem;
      margin-bottom: 20px;
      padding-bottom: 8px;
      font-weight: 600;
    }
  }

  .form-actions {
    flex-direction: column;
    margin-top: 32px;
    padding-top: 24px;
    gap: 16px;
    align-items: stretch;
    padding-left: 0;
    padding-right: 0;

    .el-button {
      width: 100%;
      height: 48px;
      font-size: 1rem;
      font-weight: 500;
      border-radius: 8px;
      margin: 0;
    }
  }

  .image-upload-container {
    flex-direction: column;
    gap: 16px;

    .upload-tips {
      min-width: auto;
      padding: 12px 16px;
      font-size: 0.9rem;
      line-height: 1.5;
      border-radius: 8px;
    }
  }

  // 我的发布车辆区域移动端优化
  .my-vehicles-section {
    padding: 40px 0;
    margin-top: 32px;

    .section-header {
      margin-bottom: 30px;

      .section-title {
        font-size: 1.6rem;
        margin-bottom: 8px;
      }

      .section-subtitle {
        font-size: 1rem;
      }
    }

    .vehicles-content {
      padding: 20px 16px;
      border-radius: 12px;
    }

    .cars-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .car-card {
      .car-image {
        height: 180px;
      }

      .car-info {
        padding: 16px;

        .car-title {
          font-size: 1.1rem;
        }

        .car-price {
          font-size: 1.2rem;
        }

        .car-details {
          flex-wrap: wrap;
          gap: 8px;

          span {
            font-size: 0.85rem;
            padding: 3px 6px;
          }
        }
      }
    }
  }

  // 移动端表单控件优化 - 统一高度
  :deep(.el-input),
  :deep(.el-select),
  :deep(.el-input__wrapper),
  :deep(.el-select .el-input__wrapper),
  :deep(.el-select__wrapper) {
    min-height: 48px !important;
    height: 48px !important;
    box-sizing: border-box !important;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select .el-input__wrapper) {
    border-radius: 8px;
    display: flex !important;
    align-items: center !important;
    padding: 0 16px !important;
    box-sizing: border-box !important;
  }

  :deep(.el-select .el-input__wrapper) {
    padding: 0 40px 0 16px !important;
  }

  :deep(.el-input__inner),
  :deep(.el-select .el-input__inner) {
    font-size: 1rem !important;
    line-height: 1.5 !important;
    height: 100% !important;
    border: none !important;
    background: transparent !important;
    padding: 0 !important;
    box-sizing: border-box !important;
  }

  :deep(.el-textarea__inner) {
    padding: 12px 16px;
    font-size: 1rem;
    line-height: 1.5;
    min-height: 100px;
    border-radius: 8px;
  }

  :deep(.el-select .el-input__suffix),
  :deep(.el-select .el-input__suffix-inner) {
    right: 12px;
    display: flex !important;
    align-items: center !important;
    height: 100% !important;
  }

  :deep(.el-select) {
    width: 100% !important;
    
    .el-input {
      height: 48px !important;
    }
    
    .el-select__wrapper {
      height: 48px !important;
    }
  }

  :deep(.el-input__inner::placeholder),
  :deep(.el-textarea__inner::placeholder) {
    color: $text-placeholder;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .form-actions {
    margin-top: 28px;
    padding-top: 20px;
    gap: 12px;

    .el-button {
      height: 44px;
      font-size: 0.95rem;
    }
  }

  :deep(.el-input),
  :deep(.el-select),
  :deep(.el-input__wrapper),
  :deep(.el-select .el-input__wrapper),
  :deep(.el-select__wrapper) {
    min-height: 44px !important;
    height: 44px !important;
    box-sizing: border-box !important;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select .el-input__wrapper) {
    display: flex !important;
    align-items: center !important;
    padding: 0 14px !important;
    border-radius: 8px;
    box-sizing: border-box !important;
  }

  :deep(.el-select .el-input__wrapper) {
    padding: 0 36px 0 14px !important;
  }

  :deep(.el-input__inner),
  :deep(.el-select .el-input__inner) {
    font-size: 0.95rem !important;
    height: 100% !important;
    border: none !important;
    background: transparent !important;
    padding: 0 !important;
    line-height: 1.5 !important;
    box-sizing: border-box !important;
  }

  :deep(.el-textarea__inner) {
    padding: 10px 14px;
    font-size: 0.95rem;
    min-height: 90px;
    border-radius: 8px;
  }

  :deep(.el-select .el-input__suffix),
  :deep(.el-select .el-input__suffix-inner) {
    right: 10px;
    display: flex !important;
    align-items: center !important;
    height: 100% !important;
  }

  :deep(.el-select) {
    width: 100% !important;
    
    .el-input {
      height: 44px !important;
    }
    
    .el-select__wrapper {
      height: 44px !important;
    }
  }

  :deep(.el-input__inner::placeholder),
  :deep(.el-textarea__inner::placeholder) {
    font-size: 0.9rem;
  }
  
  // 480px以下发动机容积选择器样式
  .engine-capacity-select {
    :deep(.el-select),
    :deep(.el-select .el-input__wrapper),
    :deep(.el-select__wrapper) {
      min-height: 44px !important;
      height: 44px !important;
    }
    
    :deep(.el-select .el-input__wrapper) {
      border-radius: 8px;
      padding: 0 50px 0 14px !important; // 小屏幕左侧14px，右侧50px
    }
    
    .engine-unit {
      right: 30px; // 小屏幕调整位置
      font-size: 12px;
    }
  }
}

// 发动机容积选择器样式
.engine-capacity-select {
  position: relative;
  width: 100%; // 确保容器占满宽度
  
  .el-select {
    width: 100%;
  }
  
  // 继承统一的表单控件样式，但调整右侧padding为cc单位预留空间
  :deep(.el-select),
  :deep(.el-select .el-input__wrapper),
  :deep(.el-select__wrapper) {
    min-height: 40px !important;
    height: 40px !important;
    width: 100% !important;
  }
  
  :deep(.el-select .el-input__wrapper) {
    border-radius: 6px;
    display: flex !important;
    align-items: center !important;
    box-sizing: border-box !important;
    padding: 0 50px 0 12px !important; // 左侧12px，右侧50px为cc单位预留空间
  }
  
  .engine-unit {
    position: absolute;
    right: 30px; // 避免与下拉箭头重叠
    top: 50%;
    transform: translateY(-50%);
    color: #909399;
    font-size: 14px;
    pointer-events: none;
    z-index: 2;
  }
}

// 移动端发动机容积选择器优化
@media (max-width: 768px) {
  .engine-capacity-select {
    // 继承移动端统一表单控件样式
    :deep(.el-select),
    :deep(.el-select .el-input__wrapper),
    :deep(.el-select__wrapper) {
      min-height: 48px !important;
      height: 48px !important;
    }
    
    :deep(.el-select .el-input__wrapper) {
      border-radius: 8px;
      padding: 0 55px 0 16px !important; // 移动端左侧16px，右侧55px
    }
    
    .engine-unit {
      right: 35px; // 移动端调整位置
      font-size: 13px;
    }
  }
}

// 移动端图片上传优化
@media (max-width: 768px) {
  .image-upload-container {
    :deep(.el-upload--picture-card) {
      width: 90px;
      height: 90px;
    }

    :deep(.el-upload-list--picture-card .el-upload-list__item) {
      width: 90px;
      height: 90px;
    }
  }
}
</style>