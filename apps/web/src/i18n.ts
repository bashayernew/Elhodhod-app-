'use client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
	en: {
		translation: {}
	}
};

if (!i18n.isInitialized) {
	i18n
		.use(initReactI18next)
		.init({
			resources,
			lng: 'en',
			fallbackLng: 'en',
			interpolation: { escapeValue: false }
		})
		.catch(() => {});
}

export default i18n;

