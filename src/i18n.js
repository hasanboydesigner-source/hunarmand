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

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'uz',
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag'],
      caches: ['localStorage', 'cookie']
    },
    debug: false,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  });

export default i18n;
