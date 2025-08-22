# 29Car - 明哥粤港车

## 项目简介

29Car 是一个基于 Vue3 + Pinia + Element UI 的明哥粤港车前端项目。项目采用响应式设计，适配多设备，提供美观现代的用户界面。

## 技术栈

- **前端框架**: Vue 3.3.4
- **状态管理**: Pinia 2.1.6
- **UI 组件库**: Element Plus 2.3.8
- **路由管理**: Vue Router 4.2.4
- **构建工具**: Vite 4.4.5
- **样式预处理器**: SCSS
- **HTTP 客户端**: Axios 1.4.0

## 项目结构

```
29car/
├── public/                 # 静态资源
├── src/
│   ├── components/         # 公共组件
│   │   ├── AppHeader.vue  # 导航组件
│   │   └── LanguageSwitcher.vue # 语言切换器
│   ├── views/             # 页面组件
│   │   ├── Home.vue       # 首页
│   │   ├── About.vue      # 关于我们
│   │   ├── Search.vue     # 搜索页面
│   │   └── LoginRegister.vue # 登录注册页面
│   ├── router/            # 路由配置
│   │   └── index.js
│   ├── stores/            # Pinia 状态管理
│   │   ├── index.js
│   │   └── user.js
│   ├── i18n/              # 国际化配置
│   │   ├── index.js       # 主配置文件
│   │   ├── types.ts       # TypeScript 类型定义
│   │   └── locales/       # 语言文件
│   │       ├── zh-CN.js   # 简体中文
│   │       ├── en-US.js   # 英文
│   │       └── zh-HK.js   # 繁体中文
│   ├── styles/            # 样式文件
│   │   ├── variables.scss # 全局变量
│   │   └── global.scss    # 全局样式
│   ├── utils/             # 工具函数
│   │   └── api.js         # API 接口
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── scripts/               # 脚本文件
│   └── validate-i18n.js  # 国际化验证脚本
├── docs/                  # 文档
│   └── i18n-development-guide.md # 国际化开发指南
├── .cursorrules           # Cursor 开发规则
├── index.html             # HTML 模板
├── package.json           # 项目配置
├── vite.config.js         # Vite 配置
└── README.md              # 项目说明
```

## 功能特性

### 🎨 现代化设计
- 全屏响应式布局，适配桌面、平板和手机设备
- 现代化 UI 设计，参考苹果官网美学
- 丰富的配色运用，保持整体一致性
- 流畅的动画效果，提升用户体验

### 📱 响应式设计
- 移动端优先的设计理念
- 自适应网格布局
- 触摸友好的交互设计
- 优化的移动端性能

### 🚀 技术特性
- Vue 3 Composition API
- Pinia 状态管理
- Element Plus 组件库
- SCSS 样式预处理
- Vite 快速构建
- Vue I18n 国际化支持
- 响应式设计
- 热重载开发体验

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

项目将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 开发规范

### 代码风格
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 Vue 3 官方风格指南

### 组件开发
- 使用 Composition API
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case

### 样式规范
- 使用 SCSS 预处理器
- 全局变量统一管理
- 响应式设计使用 mixin

### 国际化规范
- 使用 Vue I18n 进行多语言支持
- 遵循分层键名结构设计
- 运行 `npm run validate-i18n` 验证国际化完整性
- 参考 `docs/i18n-development-guide.md` 开发指南

## 页面说明

### 首页 (Home.vue)
- 英雄区域展示平台特色
- 特色服务介绍
- 统计数据展示
- 现代化导航栏

### 关于我们 (About.vue)
- 公司介绍
- 核心价值观
- 团队成员展示

### 搜索页面 (Search.vue)
- 车辆搜索功能
- 分类筛选
- 价格范围筛选
- 搜索结果展示

### 登录注册 (LoginRegister.vue)
- 用户登录
- 用户注册
- 表单验证

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目维护者: 29Car Team
- 邮箱: contact@29car.com
- 官网: https://29car.com

---

© 2024 29Car. 保留所有权利。