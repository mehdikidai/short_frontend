import { createI18n } from "vue-i18n";
import en from "./en.json";
import fr from "./fr.json";
import de from "./de.json";

const i18n = createI18n({
    locale: "en",
    fallbackLocale: "en",
    messages: {
        en,
        fr,
        de
    },
});

export default i18n;
