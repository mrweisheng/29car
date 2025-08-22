<template>
  <div class="about">
    <AppHeader />

    <!-- 主要內容 -->
    <main class="main-content">
      <!-- 頁面標題 -->
      <section class="page-header">
        <div class="container">
          <h1 class="page-title">{{ $t('about.title') }}</h1>
          <p class="page-subtitle">{{ $t('about.subtitle') }}</p>
        </div>
      </section>

      <!-- 公司介紹 -->
      <section class="company-intro">
        <div class="container">
          <div class="intro-content">
            <div class="intro-text">
              <h2>{{ $t('about.story.title') }}</h2>
              <p>{{ $t('about.story.content1') }}</p>
              <p>{{ $t('about.story.content2') }}</p>
            </div>
            <div class="intro-image">
              <img src="/car.jpg" alt="Company Environment" class="intro-img" />
            </div>
          </div>
        </div>
      </section>

      <!-- 核心優勢 -->
      <section class="advantages">
        <div class="container">
          <h2 class="section-title">{{ $t('about.advantages.title') }}</h2>
          <div class="advantages-grid">
            <div class="advantage-card" v-for="advantage in advantages" :key="advantage.id">
              <div class="advantage-icon">
                <el-icon><component :is="advantage.icon" /></el-icon>
              </div>
              <h3>{{ advantage.title }}</h3>
              <p>{{ advantage.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 服務承諾 -->
      <section class="commitments">
        <div class="container">
          <h2 class="section-title">{{ $t('about.commitments.title') }}</h2>
          <div class="commitments-grid">
            <div class="commitment-card" v-for="commitment in commitments" :key="commitment.id">
              <div class="commitment-icon">
                <el-icon><component :is="commitment.icon" /></el-icon>
              </div>
              <h3>{{ commitment.title }}</h3>
              <p>{{ commitment.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 服務內容 -->
      <section class="services-overview">
        <div class="container">
          <div class="services-content">
            <div class="services-text">
              <h2>{{ $t('about.services.title') }}</h2>
              <p>{{ $t('about.services.description') }}</p>
              <ul class="services-list">
                <li v-for="service in services" :key="service.id">
                  <el-icon><Check /></el-icon>
                  <span>{{ service.name }}</span>
                </li>
              </ul>
            </div>
            <div class="services-image">
              <img src="/car2.jpg" alt="Service Showcase" class="services-img" />
            </div>
          </div>
        </div>
      </section>

      <!-- 聯繫方式 -->
      <section class="contact-info">
        <div class="container">
          <h2 class="section-title">{{ $t('about.contact.title') }}</h2>
          <div class="contact-content">
            <div class="contact-item">
              <el-icon><Location /></el-icon>
              <div>
                <h3>{{ $t('about.contact.address.title') }}</h3>
                <p>{{ $t('about.contact.address.value') }}</p>
              </div>
            </div>
            <div class="contact-item">
              <el-icon><Phone /></el-icon>
              <div>
                <h3>{{ $t('about.contact.phone.title') }}</h3>
                <p>98702065</p>
              </div>
            </div>
            <div class="contact-item wechat-item">
              <el-icon><ChatDotRound /></el-icon>
              <div>
                <h3>{{ $t('about.contact.wechat.title') }}</h3>
                <p>{{ $t('about.contact.wechat.value') }}</p>
                <div class="qr-code">
                  <img src="/cqd.png" alt="WeChat QR Code" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 頁腳 -->
    <AppFooter 
      :show-social-links="false" 
      :show-extended-services="false" 
      :show-support-section="false" 
    />
  </div>
</template>

<script setup>
import { computed, onMounted, onActivated } from 'vue'
import { useI18n } from 'vue-i18n'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { Star, Lock, User, Check, Location, Phone, ChatDotRound } from '@element-plus/icons-vue'

const { t } = useI18n()

// 核心優勢數據
const advantages = computed(() => [
  {
    id: 1,
    icon: 'Star',
    title: t('about.advantages.experience.title'),
    description: t('about.advantages.experience.description')
  },
  {
    id: 2,
    icon: 'Lock',
    title: t('about.advantages.entity.title'),
    description: t('about.advantages.entity.description')
  },
  {
    id: 3,
    icon: 'User',
    title: t('about.advantages.service.title'),
    description: t('about.advantages.service.description')
  }
])

// 服務承諾數據
const commitments = computed(() => [
  {
    id: 1,
    icon: 'Lock',
    title: t('about.commitments.guarantee.title'),
    description: t('about.commitments.guarantee.description')
  },
  {
    id: 2,
    icon: 'User',
    title: t('about.commitments.professional.title'),
    description: t('about.commitments.professional.description')
  }
])

// 服務內容數據
const services = computed(() => [
  { id: 1, name: t('about.services.list.assessment') },
  { id: 2, name: t('about.services.list.materials') },
  { id: 3, name: t('about.services.list.qualification') },
  { id: 4, name: t('about.services.list.government') },
  { id: 5, name: t('about.services.list.accompany') },
  { id: 6, name: t('about.services.list.lifetime') }
])

// 确保页面滚动到顶部
const scrollToTop = () => {
  window.scrollTo(0, 0)
  // 兼容移动端
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

onMounted(() => {
  scrollToTop()
})

onActivated(() => {
  scrollToTop()
})

</script>

<style lang="scss" scoped>
.about {
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
  padding: $spacing-xxl 0;
  text-align: center;
  
  .page-title {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: $spacing-md;
    
    @include mobile {
      font-size: 2rem;
    }
  }
  
  .page-subtitle {
    font-size: $font-size-large;
    opacity: 0.9;
    
    @include mobile {
      font-size: $font-size-medium;
    }
  }
}

// 公司介绍区域
.company-intro {
  padding: $spacing-xxl 0;
  background: white;
  
  .intro-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-xxl;
    align-items: center;
    
    @include mobile {
      grid-template-columns: 1fr;
      text-align: center;
    }
  }
  
  .intro-text {
    h2 {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: $spacing-lg;
      color: $text-primary;
      
      @include mobile {
        font-size: 1.5rem;
      }
    }
    
    p {
      font-size: $font-size-medium;
      line-height: 1.8;
      color: $text-regular;
      margin-bottom: $spacing-md;
      
      @include mobile {
        font-size: $font-size-base;
        line-height: 1.6;
      }
    }
  }
  
  .intro-image {
    .intro-img {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: $border-radius-large;
      box-shadow: $box-shadow-light;
      
      @include mobile {
        height: 200px;
      }
    }
  }
}

// 核心优势区域
.advantages {
  padding: $spacing-xxl 0;
  background: $background-color-base;
  
  .section-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: $spacing-xxl;
    color: $text-primary;
    
    @include mobile {
      font-size: 2rem;
    }
  }
  
  .advantages-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: $spacing-xl;
    
    @include mobile {
      grid-template-columns: 1fr;
      gap: $spacing-lg;
    }
  }
  
  .advantage-card {
    background: white;
    padding: $spacing-xl;
    border-radius: $border-radius-large;
    text-align: center;
    box-shadow: $box-shadow-light;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
    }
    
    @include mobile {
      padding: $spacing-lg;
    }
    
    .advantage-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, $primary-color, #66b1ff);
      border-radius: $border-radius-circle;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto $spacing-lg;
      
      @include mobile {
        width: 60px;
        height: 60px;
        margin: 0 auto $spacing-md;
      }
      
      .el-icon {
        font-size: 36px;
        color: white;
        
        @include mobile {
          font-size: 28px;
        }
      }
    }
    
    h3 {
      font-size: $font-size-large;
      font-weight: bold;
      margin-bottom: $spacing-md;
      color: $text-primary;
      
      @include mobile {
        font-size: $font-size-base;
        margin-bottom: $spacing-sm;
      }
    }
    
    p {
      color: $text-regular;
      line-height: 1.6;
      
      @include mobile {
        font-size: $font-size-small;
        line-height: 1.4;
      }
    }
  }
}

// 服务承诺区域
.commitments {
  padding: $spacing-xxl 0;
  background: white;
  
  .section-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: $spacing-xxl;
    color: $text-primary;
    
    @include mobile {
      font-size: 2rem;
    }
  }
  
  .commitments-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: $spacing-xl;
    
    @include mobile {
      grid-template-columns: 1fr;
      gap: $spacing-lg;
    }
  }
  
  .commitment-card {
    background: $background-color-base;
    padding: $spacing-xl;
    border-radius: $border-radius-large;
    text-align: center;
    box-shadow: $box-shadow-light;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
    }
    
    @include mobile {
      padding: $spacing-lg;
    }
    
    .commitment-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, $success-color, #67c23a);
      border-radius: $border-radius-circle;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto $spacing-lg;
      
      @include mobile {
        width: 60px;
        height: 60px;
        margin: 0 auto $spacing-md;
      }
      
      .el-icon {
        font-size: 36px;
        color: white;
        
        @include mobile {
          font-size: 28px;
        }
      }
    }
    
    h3 {
      font-size: $font-size-large;
      font-weight: bold;
      margin-bottom: $spacing-md;
      color: $text-primary;
      
      @include mobile {
        font-size: $font-size-base;
        margin-bottom: $spacing-sm;
      }
    }
    
    p {
      color: $text-regular;
      line-height: 1.6;
      
      @include mobile {
        font-size: $font-size-small;
        line-height: 1.4;
      }
    }
  }
}

// 服务内容概览区域
.services-overview {
  padding: $spacing-xxl 0;
  background: $background-color-base;
  
  .services-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-xxl;
    align-items: center;
    
    @include mobile {
      grid-template-columns: 1fr;
      text-align: center;
    }
  }
  
  .services-text {
    h2 {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: $spacing-lg;
      color: $text-primary;
      
      @include mobile {
        font-size: 1.5rem;
      }
    }
    
    p {
      font-size: $font-size-medium;
      line-height: 1.8;
      color: $text-regular;
      margin-bottom: $spacing-lg;
      
      @include mobile {
        font-size: $font-size-base;
        line-height: 1.6;
      }
    }
    
    .services-list {
      list-style: none;
      padding: 0;
      
      li {
        display: flex;
        align-items: center;
        margin-bottom: $spacing-md;
        font-size: $font-size-medium;
        color: $text-regular;
        
        @include mobile {
          font-size: $font-size-base;
          margin-bottom: $spacing-sm;
        }
        
        .el-icon {
          color: $success-color;
          margin-right: $spacing-sm;
          font-size: 18px;
          
          @include mobile {
            font-size: 16px;
          }
        }
      }
    }
  }
  
  .services-image {
    .services-img {
      width: 100%;
      height: 350px;
      object-fit: cover;
      border-radius: $border-radius-large;
      box-shadow: $box-shadow-light;
      
      @include mobile {
        height: 200px;
      }
    }
  }
}

// 联系方式区域
.contact-info {
  padding: $spacing-xxl 0;
  background: white;
  
  .section-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: $spacing-xxl;
    color: $text-primary;
    
    @include mobile {
      font-size: 2rem;
    }
  }
  
  .contact-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: $spacing-xl;
    
    @include mobile {
      grid-template-columns: 1fr;
      gap: $spacing-lg;
    }
  }
  
  .contact-item {
    display: flex;
    align-items: flex-start;
    padding: $spacing-lg;
    background: $background-color-base;
    border-radius: $border-radius-large;
    box-shadow: $box-shadow-light;
    
    @include mobile {
      padding: $spacing-md;
    }
    
    .el-icon {
      font-size: 24px;
      color: $primary-color;
      margin-right: $spacing-md;
      margin-top: 4px;
      
      @include mobile {
        font-size: 20px;
        margin-right: $spacing-sm;
      }
    }
    
    div {
      flex: 1;
      
      h3 {
        font-size: $font-size-medium;
        font-weight: bold;
        margin-bottom: $spacing-xs;
        color: $text-primary;
        
        @include mobile {
          font-size: $font-size-base;
        }
      }
      
      p {
        color: $text-regular;
        line-height: 1.6;
        margin-bottom: $spacing-sm;
        
        @include mobile {
          font-size: $font-size-small;
        }
      }
      
      .qr-code {
        margin-top: $spacing-md;
        
        img {
          width: 120px;
          height: 120px;
          border-radius: $border-radius-base;
          box-shadow: $box-shadow-light;
          
          @include mobile {
            width: 100px;
            height: 100px;
          }
        }
      }
    }
    
    &.wechat-item {
      flex-direction: column;
      align-items: center;
      text-align: center;
      
      .el-icon {
        margin-right: 0;
        margin-bottom: $spacing-sm;
      }
      
      div {
        width: 100%;
        
        .qr-code {
          display: flex;
          justify-content: center;
          margin-top: $spacing-md;
        }
      }
    }
  }
}

</style>