export default {
  // 通用
  common: {
    login: '登录',
    logout: '退出登录',
    register: '注册',
    search: '搜索',
    submit: '提交',
    cancel: '取消',
    confirm: '确认',
    delete: '删除',
    edit: '编辑',
    save: '保存',
    loading: '加载中...',
    noData: '暂无数据',
    back: '返回',
    goBack: '返回',
    next: '下一步',
    previous: '上一步',
    close: '关闭',
    open: '打开',
    yes: '是',
    no: '否',
    all: '全部',
    none: '无',
    more: '更多',
    less: '收起',
    noImage: '暂无图片',
    locale: 'zh-CN'
  },

  // 导航
  nav: {
    home: '首页',
    about: '关于我们',
    services: '服务',
    publish: '发布车辆',
    profile: '个人中心',
    settings: '设置',
    vehicles: '车辆',
    search: '搜索车辆'
  },

  // 搜索页面
  search: {
    placeholder: '请输入车型搜索如730',
    filterTitle: '筛选条件',
    noResults: '暂无搜索结果',
    resultsFound: '辆车',
    searchSuccess: '搜索成功',
    searchResults: '搜索结果',
    filters: {
      category: '分类筛选',
      brand: '品牌',
      selectBrand: '选择品牌',
      priceRangeTitle: '价格范围',
      year: '年份',
      selectYear: '选择年份',
      seats: '座位数',
      selectSeats: '选择座位数',
      selectPriceRange: '选择价格范围',
      minPrice: '最低价格',
      maxPrice: '最高价格',
      priceRange: {
        all: '全部价格',
        under1: '1萬以下',
        '1to2': '1萬-2萬',
        '2to5': '2萬-5萬',
        '5to10': '5萬-10萬',
        '10to15': '10萬-15萬',
        '15to20': '15萬-20萬',
        '20to30': '20萬-30萬',
        '30to50': '30萬-50萬',
        '50to100': '50萬-100萬',
        over100: '100萬以上'
      },
      seats: {
        all: '不限座位',
        '5': '5座',
        '6': '6座',
        '7': '7座',
        unknown: '座位未知'
      },
      resetFilters: '重置筛选',
      reset: '重置筛选',
      allVehicles: '全部车辆'
    },
    fuelTypes: {
      gasoline: '汽油',
      diesel: '柴油',
      electric: '电动',
      hybrid: '混合动力'
    },
    badges: {
      new: '新上架',
      classic: '经典'
    },
    priceNegotiable: '价格面议',
    specialOfferPrice: 'HKD$98,000（包含车+两地牌）',
    unknownVehicle: '未知车型',
    noContact: '暂无联系人',
    noPhone: '暂无电话'
  },

  // 首页
  home: {
    header: {
      tagline: '明哥粤港车'
    },
    hero: {
              title: '明哥粤港车',
      subtitle: '为您提供全方位的粤港车及中港两地牌服务',
      getStarted: '立即开始',
      learnMore: '了解更多',
      sellCar: '寄售车辆',
      browseCars: '浏览车辆',
      stats: {
        years: '年经营历史',
        customers: '服务客户',
        transactions: '成功交易'
      }
    },
    features: {
      title: '我们的特色服务',
      carPurchase: {
        title: '汽车购买',
        description: '提供多种品牌和型号的汽车选择，满足不同需求'
      },
      maintenance: {
        title: '维修保养',
        description: '专业的维修团队，确保您的爱车始终保持最佳状态'
      },
      insurance: {
        title: '中港两地牌',
        description: '专业办理中港两地牌照，便利往返两地'
      },
      service24h: {
        title: '24小时服务',
        description: '全天候客户服务，随时为您解决各种问题'
      }
    },
    featured: {
      title: '精选车辆',
      viewAll: '查看全部'
    },
    specialOffer: {
      title: '特价车辆',
      viewAll: '查看全部'
    },
    latest: {
      title: '最新上架',
      viewAll: '查看全部'
    },
    car: {
      new: '新上架',
      priceUnit: '万'
    },
    services: {
      title: '我们的服务',
      safety: {
        title: '安全保障',
        description: '严格的车辆检测标准，确保每辆车都符合安全要求'
      },
      inspection: {
        title: '专业检测',
        description: '专业技师团队，提供全面的车辆检测服务'
      },
      support: {
        title: '客户支持',
        description: '7×24小时客户服务，随时为您解答问题'
      },
      payment: {
        title: '安全支付',
        description: '多种支付方式，交易安全有保障'
      }
    },
    moreVehicles: {
      title: '寻找更多心仪车辆？',
      subtitle: '浏览我们的完整车辆库存，找到最适合您的座驾',
      button: '查看更多车辆'
    },
    category: {
      title: '车辆分类',
      subtitle: '选择您感兴趣的车辆类型，快速找到心仪的车辆',
      private: '私家车',
      privateDesc: '适合家庭日常使用的轿车、SUV等车型',
      van: '客货车',
      vanDesc: '商用客货两用车辆，载人载货两不误',
      truck: '货车',
      truckDesc: '专业货运车辆，满足各种运输需求',
      motorcycle: '电单车',
      motorcycleDesc: '灵活便捷的两轮交通工具',
      classic: '经典车',
      classicDesc: '珍藏级经典老爷车，收藏投资首选',
      searchMore: '搜索更多',
      searchMoreDesc: '探索更多车辆选择，找到完美座驾'
    },
    // 移动端分类卡片
    mobileCategory: {
      searchCars: {
        title: '个人找车',
        description: '搜索心仪车辆，快速找到理想座驾'
      },
      crossBorder: {
        title: '中港两地牌',
        description: '专业办理中港两地牌照服务'
      },
      specialOffer: {
        title: '特价专区',
        description: '精选特价车辆，优惠不容错过'
      },
      vehicleRegistration: {
        title: '车辆登记',
        description: '专业车辆登记服务，手续便捷'
      }
    },
    stats: {
      satisfiedCustomers: '满意客户',
      serviceVehicles: '服务车辆',
      professionalTechnicians: '专业技师',
      serviceTime: '服务时间'
    }
  },

  // 关于我们
  about: {
    title: '关于我们',
    subtitle: '专注中港车辆服务，您的信誉之选',
    story: {
              title: '明哥粤港车 - 专注中港车辆服务',
              content1: '始于1982，我们更懂您的托付。自1982年创立，明哥粤港车已专注中港车辆服务多年。我们不是一家新兴的咨询公司，而是一家有深厚根基的香港实体车行。',
              content2: '我们深知，一张粤Z中港两地牌对您而言，是事业的助力，是时间的价值，更是身份的象征。多年来，我们只坚守一个信条："受人之托，忠人之事"。选择明哥粤港车，就是选择一份历经时间考验的安心。',
      officeEnvironment: '公司办公环境'
    },
    advantages: {
      title: '核心优势',
      experience: {
        title: '多年专业经验',
        description: '专注粤Z中港两地牌代办服务多年，信誉为本，专业可靠'
      },
      entity: {
        title: '香港实体车行',
        description: '上水马会道3号，随时欢迎实地考察，合作更放心'
      },
      service: {
        title: '一站式VIP服务',
        description: '从资质评估到成功上牌，全程专业代办，让您省心省力'
      }
    },
    commitments: {
      title: '服务承诺',
      guarantee: {
        title: '结果保障',
        description: '不成功，全额退款。您的托付，我们用最实际的行动来保障'
      },
      professional: {
        title: '专业服务',
        description: '1对1资质评估，全程材料代办，确保高通过率'
      }
    },
    services: {
      title: '服务内容',
        description: '您将获得由明哥粤港车资深团队提供的"一站式"专属服务',
      list: {
        assessment: '1对1资质评估与优化建议',
        materials: '全程材料代办服务',
        qualification: '企业资格配置',
        government: '全流程政府事务代办',
        accompany: '专人VIP陪同服务',
        lifetime: '终身顾问服务'
      }
    },
    contact: {
      title: '联系我们',
      address: {
        title: '公司地址',
        value: '上水马会道3号'
      },
      phone: {
        title: '联系电话',
        value: '98702065'
      },
      wechat: {
        title: '微信联系',
        value: '请添加微信咨询'
      }
    }
  },

  // 页脚
  footer: {
            platform: '明哥粤港车',
    services: '服务',
    about: '关于我们',
    carPurchase: '汽车购买',
    maintenance: '维修保养',
    insurance: '中港两地牌',
    companyIntro: '公司介绍',
    team: '团队',
    contact: '联系我们',
    copyright: '保留所有权利',
    carSale: '汽车销售',
    carInspection: '汽车检测',
    careers: '招聘信息',
    support: '客户支持',
    helpCenter: '帮助中心',
    safetyGuide: '安全指南',
    terms: '服务条款',
    privacy: '隐私政策'
  },

  // 消息
  messages: {
    loginFeature: '登录功能开发中...',
    getStartedFeature: '开始使用功能开发中...',
    learnMoreFeature: '了解更多功能开发中...',
    languageChanged: '语言切换成功',
    settingsSaved: '设置已保存',
    logoutSuccess: '已退出登录'
  },

  // 认证
  auth: {
    title: '登录注册',
            subtitle: '欢迎来到明哥粤港车，请登录或注册您的账户',
    login: {
      title: '登录'
    },
    register: {
      title: '注册'
    },
    form: {
      email: '邮箱/用户名',
      password: '密码',
      confirmPassword: '确认密码',
      username: '用户名',
      realName: '联络人姓名',
      gender: '性别',
      phone: '手机号码',
      captcha: '验证码',
      remember: '记住我',
      forgotPassword: '忘记密码？',
      agreement: '我已阅读并同意',
      terms: '服务条款',
      and: '和',
      privacy: '隐私政策'
    },
    button: {
      login: '登录',
      register: '注册',
      refreshCaptcha: '刷新验证码'
    },
    gender: {
      male: '男',
      female: '女',
      other: '其他'
    },
    validation: {
      usernameRequired: '请输入用户名',
      usernameMinLength: '用户名至少3个字符',
      passwordRequired: '请输入密码',
      passwordMinLength: '密码至少6个字符',
      confirmPasswordRequired: '请确认密码',
      passwordMismatch: '两次输入的密码不一致',
      realNameRequired: '请输入联络人姓名',
      genderRequired: '请选择性别',
      phoneRequired: '请输入手机号码',
      phoneFormat: '请输入正确的手机号码格式',
      emailRequired: '请输入电子邮箱',
      emailFormat: '请输入正确的邮箱格式',
      captchaRequired: '请输入验证码',
      captchaFormat: '验证码为4位数字',
      agreementRequired: '请同意服务条款和隐私政策'
    },
    messages: {
      loginSuccess: '登录成功',
      registerSuccess: '注册成功，请登录',
      socialLoginNotImplemented: '{provider} 登录功能暂未开放',
      forgotPasswordNotImplemented: '忘记密码功能开发中...'
    },
    tips: {
      usernameTip: '用户名用于登录，仅支持字母、数字、下划线和中文',
      realNameTip: '请输入您的真实姓名，用于联络'
    }
  },

  // 发布车辆
  publish: {
    title: '发布车辆',
    subtitle: '轻松发布您的车辆信息，快速找到买家',
    formTitle: '车辆信息',
    comingSoon: '发布功能正在开发中，敬请期待...'
  },

  // 车辆详情
  vehicleDetail: {
    title: '车辆详情',
    currentPrice: '现价',
    originalPrice: '原价',
    discount: '优惠 {amount}',
    vehicleType: '车辆类型',
    fuelType: '燃料类型',
    seats: '座位数',
    seatsUnit: '座',
    engineVolume: '发动机容积',
    transmission: '变速箱',
    mileage: '里程',
    mileageUnit: 'km',
    color: '颜色',
    contactInfo: '联系信息',
    contactSeller: '联系卖家',
    contactTip: '请通过电话联系卖家',
    description: '车辆描述',
    features: '特色配置',
    lastUpdate: '最后更新',
    negotiable: '面议',
    error: {
      title: '加载失败',
      invalidId: '无效的车辆ID',
      notFound: '车辆不存在',
      serverError: '服务器错误，请稍后重试'
    }
  },

  // 语言设置
  language: {
    zhCN: '简体中文',
    zhHK: '繁體中文',
    enUS: 'English'
  },
  searchPlaceholder: '请输入车型搜索如730',

  // 特价车辆专门页面
  specialOffer: {
    title: '特价车+牌组合',
    subtitle: '精选特价车辆，包含中港两地牌，优惠不容错过'
  }
}