<template>
  <div class="about">
    <AppHeader />

    <!-- 主要內容 -->
    <main class="main-content">
      <!-- 頁面標題 -->
      <section class="page-header">
        <div class="container">
          <h1 class="page-title">{{ $t('about.title') }}</h1>
          <!-- <p class="page-subtitle">{{ $t('about.subtitle') }}</p> -->
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

      <!-- 核心價值觀 -->
      <section class="values">
        <div class="container">
          <h2 class="section-title">{{ $t('about.values.title') }}</h2>
          <div class="values-grid">
            <div class="value-card" v-for="value in values" :key="value.id">
              <div class="value-icon">
                <el-icon><component :is="value.icon" /></el-icon>
              </div>
              <h3>{{ value.title }}</h3>
              <p>{{ value.description }}</p>
            </div>
          </div>
        </div>
      </section>



      <!-- 服务展示 -->
      <section class="service-showcase">
        <div class="container">
          <div class="showcase-content">
            <div class="showcase-image">
              <img src="/car2.jpg" alt="Service Showcase" class="showcase-img" />
            </div>
            <div class="showcase-text">
              <h2>{{ $t('about.service.title') }}</h2>
              <p>{{ $t('about.service.description') }}</p>
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

const { t } = useI18n()

// 核心價值觀數據
const values = computed(() => [
  {
    id: 1,
    icon: 'Star',
    title: t('about.values.professional.title'),
    description: t('about.values.professional.description')
  },
  {
    id: 2,
    icon: 'User',
    title: t('about.values.customerFirst.title'),
    description: t('about.values.customerFirst.description')
  },
  {
    id: 3,
    icon: 'Timer',
    title: t('about.values.efficient.title'),
    description: t('about.values.efficient.description')
  },
  {
    id: 4,
    icon: 'Lock',
    title: t('about.values.safe.title'),
    description: t('about.values.safe.description')
  },
  {
    id: 5,
    icon: 'TrendCharts',
    title: t('about.values.innovative.title'),
    description: t('about.values.innovative.description')
  },
  {
    id: 6,
    icon: 'Medal',
    title: t('about.values.integrity.title'),
    description: t('about.values.integrity.description')
  }
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
    }
    
    p {
      font-size: $font-size-medium;
      line-height: 1.8;
      color: $text-regular;
      margin-bottom: $spacing-md;
    }
  }
  
  .intro-image {
    .intro-img {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: $border-radius-large;
      box-shadow: $box-shadow-light;
    }
  }
}

// 核心价值观区域
.values {
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
  
  .values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: $spacing-xl;
    
    @include mobile {
      grid-template-columns: repeat(2, minmax(140px, 1fr));
      gap: $spacing-md;
    }
  }
  
  .value-card {
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
    
    .value-icon {
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

// 团队介绍区域
.team {
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
  
  .team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: $spacing-xl;
  }
  
  .team-member {
    background: $background-color-base;
    padding: $spacing-xl;
    border-radius: $border-radius-large;
    text-align: center;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
    }
    
    .member-avatar {
      margin-bottom: $spacing-lg;
    }
    
    h3 {
      font-size: $font-size-large;
      font-weight: bold;
      margin-bottom: $spacing-sm;
      color: $text-primary;
    }
    
    .member-position {
      color: $primary-color;
      font-weight: 500;
      margin-bottom: $spacing-md;
    }
    
    .member-description {
      color: $text-regular;
      line-height: 1.6;
    }
  }
}

// 服务展示区域
.service-showcase {
  padding: $spacing-xxl 0;
  background: $background-color-base;
  
  .showcase-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-xxl;
    align-items: center;
    
    @include mobile {
      grid-template-columns: 1fr;
      text-align: center;
    }
  }
  
  .showcase-image {
    .showcase-img {
      width: 100%;
      height: 350px;
      object-fit: cover;
      border-radius: $border-radius-large;
      box-shadow: $box-shadow-light;
    }
  }
  
  .showcase-text {
    h2 {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: $spacing-lg;
      color: $text-primary;
    }
    
    p {
      font-size: $font-size-medium;
      line-height: 1.8;
      color: $text-regular;
    }
  }
}

</style>