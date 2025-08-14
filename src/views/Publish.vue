<template>
  <div class="publish-page">
    <AppHeader />
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">{{ $t('publish.title') }}</h1>
        <p class="page-subtitle">{{ $t('publish.subtitle') }}</p>
      </div>
      
      <div class="publish-content">
        <el-card class="publish-card">
          <div class="publish-form">
            <h3>{{ $t('publish.formTitle') }}</h3>
            <p>{{ $t('publish.comingSoon') }}</p>
            
            <div class="form-actions">
              <el-button type="primary" @click="goBack">
                <el-icon><ArrowLeft /></el-icon>
                {{ $t('common.back') }}
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.publish-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-top: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 20px 40px;
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
  max-width: 600px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.publish-form {
  padding: 40px;
  text-align: center;
}

.publish-form h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 16px;
}

.publish-form p {
  color: #666;
  margin-bottom: 32px;
  font-size: 1.1rem;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

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
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.8rem;
  }
  
  .publish-form {
    padding: 20px 15px;
  }
}
</style>
