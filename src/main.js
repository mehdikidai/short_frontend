import "./assets/main.scss";

//  font poppins
import "@fontsource/poppins";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/900.css";
//  font poppins

import { createApp } from "vue";
import { createPinia } from "pinia";
import i18n from "./lang";
import App from "./App.vue";
import router from "./router";
import { Icon, Logo } from "./components/Global";
import { getDomain, sliceUrl, momentFromNow, copyText } from "./helper";



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
