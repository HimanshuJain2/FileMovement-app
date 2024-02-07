import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
// import LanguageDetector from 'i18next-browser-languagedetector'
import { transaltionEn, transaltionKa } from './assets/locale'
i18n.use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        fallbackLng: 'en',
        resources: {
            en: {
                translation: transaltionEn,
            },
            ka: {
                translation: transaltionKa,
            },
        },
    })

export default i18n
