import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ne from "./locales/ne.json";

const resources = {
  en: { translation: en },
  ne: { translation: ne },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    lng: localStorage.getItem("site-language") || undefined,
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "site-language",
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
    returnObjects: true,
  });

export default i18n;
