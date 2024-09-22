import "./assets/main.scss";
import { createApp } from "vue";
import { createPinia } from "pinia";
import i18n from "./lang";
import App from "./App.vue";
import router from "./router";
import { Icon, Logo } from "./components/Global";
import { getDomain, sliceUrl, momentFromNow, copyText } from "./helper";
import { debounce } from "lodash";

const app = createApp(App);

app.config.globalProperties.$sliceUrl = sliceUrl;
app.config.globalProperties.$getDomain = getDomain;
app.config.globalProperties.$momentFromNow = momentFromNow;
app.config.globalProperties.$copyText = copyText;

app.component("Icon", Icon);
app.component("Logo", Logo);

app.directive("kidai", {
    mounted: (el) => {
        el.classList.add("animate__show")
    },
});

app.use(i18n);
app.use(createPinia());
app.use(router);

app.mount("#app");
