import { createI18n } from 'vue-i18n';
import en from './en.json';
import fr from './fr.json';
import de from './de.json';
import ar from './ar.json';
import es from './es.json';

const i18n = createI18n({
	//legacy: false,
	locale: 'en',
	fallbackLocale: 'en',
	messages: {
		en,
		fr,
		de,
		ar,
		es
	},
});

export default i18n;
