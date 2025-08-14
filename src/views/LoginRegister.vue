<template>
  <div class="login-register">
    <AppHeader />

    <!-- 主要内容 -->
    <main class="main-content">
      <!-- 登录注册表单区域 -->
      <section class="auth-section">
        <div class="container">
          <div class="auth-container">
            <div class="auth-form-wrapper">
              <!-- 切换标签 -->
              <div class="auth-tabs">
                <button 
                  class="auth-tab" 
                  :class="{ active: isLogin }"
                  @click="switchToLogin"
                >
                  {{ $t('auth.login.title') }}
                </button>
                <button 
                  class="auth-tab" 
                  :class="{ active: !isLogin }"
                  @click="switchToRegister"
                >
                  {{ $t('auth.register.title') }}
                </button>
              </div>

              <!-- 登录表单 -->
              <div v-if="isLogin" class="auth-form">
                <el-form 
                  ref="loginFormRef" 
                  :model="loginForm" 
                  :rules="loginRules"
                  label-width="0"
                  size="large"
                >
                  <el-form-item prop="email">
                    <el-input
                      v-model="loginForm.email"
                      :placeholder="$t('auth.form.email')"
                      prefix-icon="Message"
                      type="email"
                    />
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input
                      v-model="loginForm.password"
                      :placeholder="$t('auth.form.password')"
                      prefix-icon="Lock"
                      type="password"
                      show-password
                    />
                  </el-form-item>
                  <el-form-item>
                    <div class="form-options">
                      <el-checkbox v-model="loginForm.remember">
                        {{ $t('auth.form.remember') }}
                      </el-checkbox>
                      <el-link type="primary" @click="showForgotPassword">
                        {{ $t('auth.form.forgotPassword') }}
                      </el-link>
                    </div>
                  </el-form-item>
                  <el-form-item>
                    <el-button 
                      type="primary" 
                      class="auth-submit-btn"
                      :loading="loading"
                      @click="handleLogin"
                    >
                      {{ $t('auth.button.login') }}
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>

              <!-- 注册表单 -->
              <div v-else class="auth-form">
                <el-form 
                  ref="registerFormRef" 
                  :model="registerForm" 
                  :rules="registerRules"
                  label-width="0"
                  size="large"
                >
                  <el-form-item prop="username">
                    <el-input
                      v-model="registerForm.username"
                      :placeholder="$t('auth.form.username')"
                      prefix-icon="User"
                    />
                  </el-form-item>
                  <el-form-item prop="real_name">
                    <el-input
                      v-model="registerForm.real_name"
                      :placeholder="$t('auth.form.realName')"
                      prefix-icon="User"
                    />
                  </el-form-item>
                  <el-form-item prop="email">
                    <el-input
                      v-model="registerForm.email"
                      :placeholder="$t('auth.form.email')"
                      prefix-icon="Message"
                      type="email"
                    />
                  </el-form-item>
                  <el-form-item prop="gender">
                    <el-select
                      v-model="registerForm.gender"
                      :placeholder="$t('auth.form.gender')"
                      style="width: 100%"
                    >
                      <el-option :label="$t('auth.gender.male')" value="male" />
                      <el-option :label="$t('auth.gender.female')" value="female" />
                      <el-option :label="$t('auth.gender.other')" value="other" />
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="phone">
                    <el-input
                      v-model="registerForm.phone"
                      :placeholder="$t('auth.form.phone')"
                      prefix-icon="Phone"
                    />
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input
                      v-model="registerForm.password"
                      :placeholder="$t('auth.form.password')"
                      prefix-icon="Lock"
                      type="password"
                      show-password
                    />
                  </el-form-item>
                  <el-form-item prop="confirmPassword">
                    <el-input
                      v-model="registerForm.confirmPassword"
                      :placeholder="$t('auth.form.confirmPassword')"
                      prefix-icon="Lock"
                      type="password"
                      show-password
                    />
                  </el-form-item>
                  <el-form-item prop="captcha">
                    <div style="display: flex; gap: 10px; align-items: center;">
                      <el-input
                        v-model="registerForm.captcha"
                        :placeholder="$t('auth.form.captcha')"
                        prefix-icon="Key"
                        style="flex: 1;"
                      />
                      <div 
                        v-if="captchaData" 
                        v-html="captchaData.image" 
                        @click="loadCaptcha"
                        style="cursor: pointer; border: 1px solid #ddd; border-radius: 4px; padding: 5px; background: white;"
                        :title="$t('auth.button.refreshCaptcha')"
                      ></div>
                    </div>
                  </el-form-item>
                  <el-form-item prop="agreement">
                    <el-checkbox v-model="registerForm.agreement">
                      {{ $t('auth.form.agreement.prefix') }}
                      <el-link type="primary" @click="showTerms">
                        {{ $t('auth.form.agreement.terms') }}
                      </el-link>
                      {{ $t('auth.form.agreement.and') }}
                      <el-link type="primary" @click="showPrivacy">
                        {{ $t('auth.form.agreement.privacy') }}
                      </el-link>
                    </el-checkbox>
                  </el-form-item>
                  <el-form-item>
                    <el-button 
                      type="primary" 
                      class="auth-submit-btn"
                      :loading="loading"
                      @click="handleRegister"
                    >
                      {{ $t('auth.button.register') }}
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>


            </div>

          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <AppFooter 
      :show-social-links="false" 
      :show-extended-services="false" 
      :show-support-section="false" 
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onActivated } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { authAPI } from '@/utils/api.js'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

// 状态管理
const isLogin = ref(true)
const loading = ref(false)
const loginFormRef = ref()
const registerFormRef = ref()
const captchaData = ref(null)

// 登录表单
const loginForm = reactive({
  email: '',
  password: '',
  remember: false
})

// 注册表单
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  real_name: '',
  gender: 'male',
  phone: '',
  captcha: '',
  agreement: false
})

// 表单验证规则
const loginRules = {
  email: [
    { required: true, message: t('auth.validation.usernameRequired'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('auth.validation.passwordRequired'), trigger: 'blur' },
    { min: 6, message: t('auth.validation.passwordMinLength'), trigger: 'blur' }
  ]
}

const registerRules = {
  username: [
    { required: true, message: t('auth.validation.usernameRequired'), trigger: 'blur' },
    { min: 3, max: 50, message: t('auth.validation.usernameMinLength'), trigger: 'blur' }
  ],
  real_name: [
    { required: true, message: t('auth.validation.realNameRequired'), trigger: 'blur' },
    { min: 1, max: 50, message: t('auth.validation.realNameRequired'), trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: t('auth.validation.emailFormat'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('auth.validation.passwordRequired'), trigger: 'blur' },
    { min: 6, message: t('auth.validation.passwordMinLength'), trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: t('auth.validation.confirmPasswordRequired'), trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error(t('auth.validation.passwordMismatch')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  phone: [
    { required: true, message: t('auth.validation.phoneRequired'), trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: t('auth.validation.phoneFormat'), trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: t('auth.validation.captchaRequired'), trigger: 'blur' },
    { len: 4, message: t('auth.validation.captchaFormat'), trigger: 'blur' }
  ],
  agreement: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error(t('auth.validation.agreementRequired')))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

// 功能特性列表
const features = ['secure', 'fast', 'support', 'trusted']

// 获取验证码
const loadCaptcha = async () => {
  try {
    const data = await authAPI.getCaptcha()
    captchaData.value = data
  } catch (error) {
    console.error('获取验证码错误:', error)
    ElMessage.error('获取验证码失败')
  }
}

// 切换登录/注册
const switchToLogin = () => {
  isLogin.value = true
}

const switchToRegister = async () => {
  isLogin.value = false
  // 切换到注册时获取验证码
  await loadCaptcha()
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    const valid = await loginFormRef.value.validate()
    if (!valid) return
    
    loading.value = true
    
    const data = await authAPI.login({
      username: loginForm.email,
      password: loginForm.password
    })
    
    // 使用状态管理更新用户信息
    userStore.setToken(data.token)
    userStore.setUserInfo(data.user)
    
    ElMessage.success(t('auth.messages.loginSuccess'))
    router.push('/')
  } catch (error) {
    console.error('登录错误:', error)
    ElMessage.error('登录失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  try {
    const valid = await registerFormRef.value.validate()
    if (!valid) return
    
    loading.value = true
    
    const data = await authAPI.register({
      username: registerForm.username,
      password: registerForm.password,
      real_name: registerForm.real_name,
      email: registerForm.email || undefined,
      gender: registerForm.gender,
      phone: registerForm.phone,
      captcha: registerForm.captcha,
      captchaId: captchaData.value?.id
    })
    
    ElMessage.success(t('auth.messages.registerSuccess'))
    // 清空注册表单
    Object.keys(registerForm).forEach(key => {
      if (key === 'gender') {
        registerForm[key] = 'male'
      } else if (key === 'agreement') {
        registerForm[key] = false
      } else {
        registerForm[key] = ''
      }
    })
    // 切换到登录页面
    isLogin.value = true
    // 重新获取验证码
    await loadCaptcha()
  } catch (error) {
    console.error('注册错误:', error)
    ElMessage.error('注册失败，请检查网络连接')
    // 注册失败时重新获取验证码
    await loadCaptcha()
  } finally {
    loading.value = false
  }
}



// 忘记密码
const showForgotPassword = () => {
  ElMessage.info(t('auth.messages.forgotPasswordNotImplemented'))
}

// 显示条款
const showTerms = () => {
  ElMessage.info('服务条款功能开发中...')
}

// 显示隐私政策
const showPrivacy = () => {
  ElMessage.info('隐私政策功能开发中...')
}

// 确保页面滚动到顶部
const scrollToTop = () => {
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

onMounted(async () => {
  scrollToTop()
  // 页面加载时获取验证码（用于注册）
  await loadCaptcha()
})

onActivated(() => {
  scrollToTop()
})
</script>

<style lang="scss" scoped>
.login-register {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-md;
  
  @include mobile {
    padding: 0 $spacing-sm;
  }
}

// 主要内容区域
.main-content {
  flex: 1;
  margin-top: 70px;
}

// 页面标题区域
.page-header {
  background: linear-gradient(135deg, $primary-color 0%, #66b1ff 100%);
  color: white;
  padding: $spacing-xl 0;
  text-align: center;
  
  .page-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: $spacing-sm;
    
    @include mobile {
      font-size: 1.8rem;
    }
  }
  
  .page-subtitle {
    font-size: $font-size-large;
    opacity: 0.9;
    
    @include mobile {
      font-size: $font-size-base;
    }
  }
}

// 认证区域
.auth-section {
  padding: $spacing-xxl 0;
  background: $background-color-base;
  min-height: calc(100vh - 200px);
}

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px;
}

// 表单包装器
.auth-form-wrapper {
  position: relative;
  background: white;
  border-radius: $border-radius-large;
  box-shadow: $box-shadow-light;
  overflow: hidden;
  width: 100%;
  max-width: 500px;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 70%;
    background-image: url('/car.jpg');
    background-size: cover;
    background-position: center bottom;
    background-repeat: no-repeat;
    opacity: 0.1;
    z-index: 0;
    pointer-events: none;
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
}

// 切换标签
.auth-tabs {
  display: flex;
  background: $background-color-base;
  
  .auth-tab {
    flex: 1;
    padding: $spacing-lg;
    border: none;
    background: transparent;
    font-size: $font-size-medium;
    font-weight: 500;
    color: $text-regular;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &.active {
      background: white;
      color: $primary-color;
      font-weight: bold;
    }
    
    &:hover:not(.active) {
      background: rgba(255, 255, 255, 0.5);
    }
  }
}

// 表单样式
.auth-form {
  padding: $spacing-xxl;
  
  @include mobile {
    padding: $spacing-xl;
  }
  
  .el-form-item {
    margin-bottom: $spacing-lg;
  }
  
  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    
    @include mobile {
      flex-direction: column;
      align-items: flex-start;
      gap: $spacing-sm;
    }
  }
  
  .auth-submit-btn {
    width: 100%;
    height: 48px;
    font-size: $font-size-medium;
    font-weight: bold;
  }
}




</style>