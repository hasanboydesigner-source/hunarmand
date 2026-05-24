import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import uzTranslation from './locales/uz/translation.json';
import ruTranslation from './locales/ru/translation.json';
import enTranslation from './locales/en/translation.json';

const resources = {
  uz: { translation: uzTranslation },
  ru: { translation: ruTranslation },
  en: { translation: enTranslation }
};

// Agar foydalanuvchi avval til tanlagan bo'lsa — o'sha saqlangan til,
// aks holda doimo O'zbek tili bilan boshlash
const savedLang = localStorage.getItem('i18nextLng');
const defaultLang = (savedLang && ['uz', 'ru', 'en'].includes(savedLang)) ? savedLang : 'uz';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLang,        // aniq til — browser detect o'tmaydi
    fallbackLng: 'uz',
    detection: {
      order: ['localStorage', 'cookie'], // htmlTag va navigator o'chirildi
      caches: ['localStorage', 'cookie']
    },
    debug: false,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
