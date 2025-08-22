import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './styles/global.scss'
import { useUserStore } from './stores/user'
const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(ElementPlus)

// 初始化用户状态并挂载应用
const userStore = useUserStore()

// 防止重复初始化
let isAppMounted = false

const mountApp = () => {
  if (!isAppMounted) {
    app.mount('#app')
    isAppMounted = true
  }
}

userStore.initUserState().then(() => {
  mountApp()
}).catch(() => {
  // 即使初始化失败也挂载应用
  mountApp()
}) 