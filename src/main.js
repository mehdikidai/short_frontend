import "./assets/main.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import i18n from "./lang";
import App from "./App.vue";
import router from "./router";
import { Icon,Logo } from "./components/Global";

const app = createApp(App);

app.config.globalProperties.$myTest = function() {
    console.log("Hello from Global Function!")
}

app.component("Icon", Icon);
app.component("Logo", Logo);

app.use(i18n);
app.use(createPinia());
app.use(router);

app.mount("#app");
