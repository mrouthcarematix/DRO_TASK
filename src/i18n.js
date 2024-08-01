import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en.json';
import translationES from './locales/es.json';
import translationHN from './locales/hn.json';
import translationRU from './locales/ru.json'; 
const resources = {
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
  hn: {  
    translation: translationHN,
  },
  ru: {  
    translation: translationRU,
  },
};


i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', 
    interpolation: {
      escapeValue: false, 
    },
  });


export default i18n;
