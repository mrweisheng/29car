<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>明哥粤港车</h3>
          <div class="contact-phone">
            <el-icon><Phone /></el-icon>
            <span>98702065</span>
          </div>
          <div v-if="showSocialLinks" class="social-links">
            <el-button type="text" size="small">
              <el-icon><ChatDotRound /></el-icon>
            </el-button>
            <el-button type="text" size="small">
              <el-icon><Phone /></el-icon>
            </el-button>
            <el-button type="text" size="small">
              <el-icon><Message /></el-icon>
            </el-button>
          </div>
        </div>
        <div class="footer-section">
          <h4>{{ $t('footer.services') }}</h4>
          <ul>
            <li><a href="#">{{ $t('footer.carPurchase') }}</a></li>
            <li v-if="showExtendedServices"><a href="#">{{ $t('footer.carSale') }}</a></li>
            <li v-if="showExtendedServices"><a href="#">{{ $t('footer.carInspection') }}</a></li>
            <li v-if="!showExtendedServices"><a href="#">{{ $t('footer.maintenance') }}</a></li>
            <li><a href="#">{{ $t('footer.insurance') }}</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>{{ $t('footer.about') }}</h4>
          <div class="wechat-qr">
            <img src="/cqd.png" alt="微信二维码" class="qr-code" />
            <p class="qr-text">微信更多资讯</p>
          </div>
        </div>
        <div v-if="showSupportSection" class="footer-section">
          <h4>{{ $t('footer.support') }}</h4>
          <ul>
            <li><a href="#">{{ $t('footer.helpCenter') }}</a></li>
            <li><a href="#">{{ $t('footer.safetyGuide') }}</a></li>
            <li><a href="#">{{ $t('footer.terms') }}</a></li>
            <li><a href="#">{{ $t('footer.privacy') }}</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 明哥粤港车. {{ $t('footer.copyright') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ChatDotRound, Phone, Message } from '@element-plus/icons-vue'

// 定义props来控制显示内容
defineProps({
  showSocialLinks: {
    type: Boolean,
    default: true
  },
  showExtendedServices: {
    type: Boolean,
    default: true
  },
  showSupportSection: {
    type: Boolean,
    default: true
  }
})
</script>

<style lang="scss" scoped>
.footer {
  background: $text-primary;
  color: white;
  padding: $spacing-xxl 0 $spacing-lg;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding-left: $spacing-lg;
    padding-right: $spacing-lg;
    
    @include mobile {
      padding-left: $spacing-md;
      padding-right: $spacing-md;
    }
  }

  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: $spacing-xl;
    margin-bottom: $spacing-xl;
    
    @include mobile {
      grid-template-columns: repeat(2, 1fr);
      text-align: center;
      gap: $spacing-lg;
    }
  }

  .footer-section {
    h3, h4 {
      margin-bottom: $spacing-md;
      color: white;
    }

    p {
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: $spacing-md;
      line-height: 1.6;
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        margin-bottom: $spacing-sm;

        a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: color 0.3s ease;

          &:hover {
            color: white;
          }
        }
      }
    }

    .contact-phone {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: $spacing-md;
      
      @include mobile {
        justify-content: center;
      }
    }

    .social-links {
      display: flex;
      gap: $spacing-sm;
      
      @include mobile {
        justify-content: center;
      }
    }

    .wechat-qr {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: $spacing-sm;
      
      .qr-code {
        width: 100px;
        height: 100px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      .qr-text {
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
        margin: 0;
        text-align: left;
      }
      
      @include mobile {
        align-items: center;
        
        .qr-code {
          width: 80px;
          height: 80px;
        }
        
        .qr-text {
          font-size: 12px;
          text-align: center;
        }
      }
    }
  }

  .footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: $spacing-lg;
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
  }
}
</style>