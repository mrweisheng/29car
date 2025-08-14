export interface I18nKeys {
  home: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    category: {
      private: string;
      van: string;
      truck: string;
      motorcycle: string;
      classic: string;
    };
    car: {
      priceUnit: string;
    };
  };
  search: {
    title: string;
    placeholder: string;
    resultsFound: string;
    noResults: string;
    fuelTypes: {
      gasoline: string;
      diesel: string;
      electric: string;
      hybrid: string;
    };
    badges: {
      new: string;
      hot: string;
      discount: string;
    };
    filters: {
      category: string;
      priceRangeTitle: string;
      priceRange: {
        all: string;
        under50k: string;
        '50k-100k': string;
        '100k-200k': string;
        '200k-500k': string;
        over500k: string;
      };
      year: string;
      selectYear: string;
      minPrice: string;
      maxPrice: string;
      allVehicles: string;
    };
  };
  about: {
    title: string;
    content: string;
  };
  login: {
    title: string;
    username: string;
    password: string;
    login: string;
    register: string;
    forgotPassword: string;
  };
  common: {
    language: string;
    logout: string;
    profile: string;
    settings: string;
  };
}

// 确保所有翻译键都符合这个类型
export type I18nKey = keyof I18nKeys;
