export default {
  // 通用
  common: {
    login: '登錄',
    logout: '退出登錄',
    register: '註冊',
    search: '搜索',
    submit: '提交',
    cancel: '取消',
    confirm: '確認',
    delete: '刪除',
    edit: '編輯',
    save: '保存',
    loading: '加載中...',
    noData: '暫無數據',
    back: '返回',
    goBack: '返回',
    next: '下一步',
    previous: '上一步',
    close: '關閉',
    open: '打開',
    yes: '是',
    no: '否',
    all: '全部',
    none: '無',
    more: '更多',
    less: '收起',
    noImage: '暫無圖片',
    locale: 'zh-HK'
  },

  // 导航
  nav: {
    home: '首頁',
    about: '關於我們',
    services: '服務',
    publish: '發布車輛',
    profile: '個人中心',
    settings: '設置',
    vehicles: '車輛',
    search: '搜索車輛'
  },

  // 搜索页面
  search: {
    placeholder: '請輸入車型搜索如730',
    filterTitle: '篩選條件',
    noResults: '暫無搜索結果',
    resultsFound: '輛車',
    searchSuccess: '搜索成功',
    searchResults: '搜索結果',
    filters: {
      category: '分類篩選',
      brand: '品牌',
      selectBrand: '選擇品牌',
      priceRangeTitle: '價格範圍',
      year: '年份',
      selectYear: '選擇年份',
      seats: '座位數',
      selectSeats: '選擇座位數',
      selectPriceRange: '選擇價格範圍',
      minPrice: '最低價格',
      maxPrice: '最高價格',
      priceRange: {
        all: '全部價格',
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
      resetFilters: '重置篩選',
      reset: '重置篩選',
      allVehicles: '全部車輛'
    },
    fuelTypes: {
      gasoline: '汽油',
      diesel: '柴油',
      electric: '電動',
      hybrid: '混合動力'
    },
    badges: {
      new: '新上架',
      classic: '經典'
    },
    priceNegotiable: '價格面議',
    specialOfferPrice: 'HKD$98,000（包含車+兩地牌）',
    unknownVehicle: '未知車型',
    noContact: '暫無聯繫人',
    noPhone: '暫無電話'
  },

  // 首页
  home: {
    header: {
      tagline: '明哥粵港車'
    },
    hero: {
      title: '明哥粵港車',
      subtitle: '為您提供全方位的粵港車及中港兩地牌服務',
      getStarted: '立即開始',
      learnMore: '了解更多',
      sellCar: '寄售車輛',
      browseCars: '瀏覽車輛',
      stats: {
        years: '年經營歷史',
        customers: '服務客戶',
        transactions: '成功交易'
      }
    },
    features: {
      title: '我們的特色服務',
      carPurchase: {
        title: '汽車購買',
        description: '提供多種品牌和型號的汽車選擇，滿足不同需求'
      },
      maintenance: {
        title: '維修保養',
        description: '專業的維修團隊，確保您的愛車始終保持最佳狀態'
      },
      insurance: {
        title: '中港兩地牌',
        description: '專業的中港兩地牌服務，為您的跨境出行提供便利'
      },
      service24h: {
        title: '24小時服務',
        description: '全天候客戶服務，隨時為您解決各種問題'
      }
    },
    featured: {
      title: '精選車輛',
      viewAll: '查看全部'
    },
    specialOffer: {
      title: '特價車輛',
      viewAll: '查看全部'
    },
    latest: {
      title: '最新上架',
      viewAll: '查看全部'
    },
    car: {
      new: '新上架',
      priceUnit: '萬'
    },
    services: {
      title: '我們的服務',
      safety: {
        title: '安全保障',
        description: '嚴格的車輛檢測標準，確保每輛車都符合安全要求'
      },
      inspection: {
        title: '專業檢測',
        description: '專業技師團隊，提供全面的車輛檢測服務'
      },
      support: {
        title: '客戶支持',
        description: '7×24小時客戶服務，隨時為您解答問題'
      },
      payment: {
        title: '安全支付',
        description: '多種支付方式，交易安全有保障'
      }
    },
    moreVehicles: {
      title: '尋找更多心儀車輛？',
      subtitle: '瀏覽我們的完整車輛庫存，找到最適合您的座駕',
      button: '查看更多車輛'
    },
    category: {
      title: '車輛分類',
      subtitle: '選擇您感興趣的車輛類型，快速找到心儀的車輛',
      private: '私家車',
      privateDesc: '適合家庭日常使用的轎車、SUV等車型',
      van: '客貨車',
      vanDesc: '商用客貨兩用車輛，載人載貨兩不誤',
      truck: '貨車',
      truckDesc: '專業貨運車輛，滿足各種運輸需求',
      motorcycle: '電單車',
      motorcycleDesc: '靈活便捷的兩輪交通工具',
      classic: '經典車',
      classicDesc: '珍藏級經典老爺車，收藏投資首選',
      searchMore: '搜索更多',
      searchMoreDesc: '探索更多車輛選擇，找到完美座駕'
    },
    // 手機版分類卡片
    mobileCategory: {
      searchCars: {
        title: '个人搵車',
        description: '搵心水車輛，幫您快手搵到啱心水嘅座駕'
      },
      crossBorder: {
        title: '中港两地牌',
        description: '專業辦理中港兩地牌照，方便您往返兩地'
      },
      specialOffer: {
        title: '特價車+牌組合',
        description: '精選特價車連牌組合，優惠唔好錯過'
      },
      vehicleRegistration: {
        title: '登記車',
        description: '專業車輛登記，手續簡單快捷'
      }
    },
    stats: {
      satisfiedCustomers: '滿意客戶',
      serviceVehicles: '服務車輛',
      professionalTechnicians: '專業技師',
      serviceTime: '服務時間'
    }
  },

  // 关于我们
  about: {
    title: '關於我們',
    subtitle: '專注中港車輛服務，您的信譽之選',
    story: {
              title: '明哥粵港車 - 專注中港車輛服務',
              content1: '始於1982，我們更懂您的託付。自1982年創立，明哥粵港車已專注中港車輛服務多年。我們不是一家新興的諮詢公司，而是一家有深厚根基的香港實體車行。',
              content2: '我們深知，一張粵Z中港兩地牌對您而言，是事業的助力，是時間的價值，更是身份的象徵。多年來，我們只堅守一個信條：「受人之託，忠人之事」。選擇明哥粵港車，就是選擇一份歷經時間考驗的安心。',
      officeEnvironment: '公司辦公環境'
    },
    advantages: {
      title: '核心優勢',
      experience: {
        title: '多年專業經驗',
        description: '專注中港車輛服務多年，信譽為本，專業可靠'
      },
      entity: {
        title: '香港實體車行',
        description: '上水馬會道3號，隨時歡迎實地考察，合作更放心'
      },
      service: {
        title: '一站式VIP服務',
        description: '從資質評估到成功上牌，全程專業代辦，讓您省心省力'
      }
    },
    commitments: {
      title: '服務承諾',
      guarantee: {
        title: '結果保障',
        description: '不成功，全額退款。您的託付，我們用最實際的行動來保障'
      },
      professional: {
        title: '專業服務',
        description: '1對1資質評估，全程材料代辦，確保高通過率'
      }
    },
    services: {
      title: '服務內容',
        description: '您將獲得由明哥粵港車資深團隊提供的「一站式」專屬服務',
      list: {
        assessment: '1對1資質評估與優化建議',
        materials: '全程材料代辦服務',
        qualification: '企業資格配置',
        government: '全流程政府事務代辦',
        accompany: '專人VIP陪同服務',
        lifetime: '終身顧問服務'
      }
    },
    contact: {
      title: '聯繫我們',
      address: {
        title: '公司地址',
        value: '上水馬會道3號'
      },
      phone: {
        title: '聯繫電話',
        value: '98702065'
      },
      wechat: {
        title: '微信聯繫',
        value: '請添加微信諮詢'
      }
    }
  },

  // 页脚
  footer: {
            platform: '明哥粵港車',
    services: '服務',
    about: '關於我們',
    carPurchase: '汽車購買',
    maintenance: '維修保養',
    insurance: '中港兩地牌',
    companyIntro: '公司介紹',
    team: '團隊',
    contact: '聯繫我們',
    copyright: '保留所有權利',
    carSale: '汽車銷售',
    carInspection: '汽車檢測',
    careers: '招聘信息',
    support: '客戶支持',
    helpCenter: '幫助中心',
    safetyGuide: '安全指南',
    terms: '服務條款',
    privacy: '隱私政策'
  },

  // 消息
  messages: {
    loginFeature: '登錄功能開發中...',
    getStartedFeature: '開始使用功能開發中...',
    learnMoreFeature: '了解更多功能開發中...',
    languageChanged: '語言切換成功',
    settingsSaved: '設置已保存',
    logoutSuccess: '已退出登錄'
  },

  // 认证
  auth: {
    title: '登錄註冊',
            subtitle: '歡迎來到明哥粵港車，請登錄或註冊您的賬戶',
    login: {
      title: '登錄'
    },
    register: {
      title: '註冊'
    },
    form: {
      email: '電子郵箱/用戶名',
      password: '密碼',
      confirmPassword: '確認密碼',
      username: '用戶名',
      realName: '聯絡人姓名',
      gender: '性別',
      phone: '手機號碼',
      captcha: '驗證碼',
      remember: '記住我',
      forgotPassword: '忘記密碼？',
      agreement: {
        prefix: '我已閱讀並同意',
        terms: '服務條款',
        and: '和',
        privacy: '隱私政策'
      }
    },
    button: {
      login: '登錄',
      register: '註冊',
      refreshCaptcha: '刷新驗證碼'
    },
    gender: {
      male: '男',
      female: '女',
      other: '其他'
    },
    validation: {
      usernameRequired: '請輸入用戶名',
      usernameMinLength: '用戶名至少3個字符',
      passwordRequired: '請輸入密碼',
      passwordMinLength: '密碼至少6個字符',
      confirmPasswordRequired: '請確認密碼',
      passwordMismatch: '兩次輸入的密碼不一致',
      realNameRequired: '請輸入聯絡人姓名',
      genderRequired: '請選擇性別',
      phoneRequired: '請輸入手機號碼',
      phoneFormat: '請輸入正確的手機號碼格式',
      emailRequired: '請輸入電子郵箱',
      emailFormat: '請輸入正確的郵箱格式',
      captchaRequired: '請輸入驗證碼',
      captchaFormat: '驗證碼為4位數字',
      agreementRequired: '請同意服務條款和隱私政策'
    },
    messages: {
      loginSuccess: '登錄成功',
      registerSuccess: '註冊成功，請登錄',
      socialLoginNotImplemented: '{provider} 登錄功能暫未開放',
      forgotPasswordNotImplemented: '忘記密碼功能開發中...'
    },
    tips: {
      usernameTip: '用戶名用於登錄，僅支持字母、數字、下劃線和中文',
      realNameTip: '請輸入您的真實姓名，用於聯絡'
    }
  },

  // 發布車輛
  publish: {
    title: '發布車輛',
    subtitle: '輕鬆發布您的車輛信息，快速找到買家',
    formTitle: '車輛信息',
    comingSoon: '發布功能正在開發中，敬請期待...'
  },

  // 車輛詳情
  vehicleDetail: {
    title: '車輛詳情',
    currentPrice: '現價',
    originalPrice: '原價',
    discount: '優惠 {amount}',
    vehicleType: '車輛類型',
    fuelType: '燃料類型',
    seats: '座位數',
    seatsUnit: '座',
    engineVolume: '發動機容積',
    transmission: '變速箱',
    mileage: '里程',
    mileageUnit: 'km',
    color: '顏色',
    contactInfo: '聯絡資訊',
    contactSeller: '聯絡賣家',
    contactTip: '請通過電話聯絡賣家',
    description: '車輛描述',
    features: '特色配置',
    lastUpdate: '最後更新',
    negotiable: '面議',
    error: {
      title: '加載失敗',
      invalidId: '無效的車輛ID',
      notFound: '車輛不存在',
      serverError: '服務器錯誤，請稍後重試'
    }
  },

  // 语言设置
  language: {
    zhCN: '簡體中文',
    zhHK: '繁體中文',
    enUS: 'English'
  },
  searchPlaceholder: '請輸入車型搜索如730',

  // 特价车辆专门页面
  specialOffer: {
    title: '特價車+牌組合',
    subtitle: '精選特價車輛，包含中港兩地牌，優惠唔好錯過'
  }
}