import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '../../translations/en/translation.json';
import zhTranslation from '../../translations/zh-CN/translation.json';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',

  ns: ['translation'],
  defaultNS: 'translation',

  interpolation: {
    escapeValue: false,
  },

  resources: {
    en: { translation: enTranslation },
    'zh-CN': { translation: zhTranslation },
  },
});

export default i18n;
