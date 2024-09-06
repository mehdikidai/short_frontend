import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        {
            path: "/about",
            name: "about",
            component: () => import("../views/AboutView.vue"),
        },
        {
            path: "/login",
            name: "login",
            component: () => import("../views/AboutView.vue"),
        },
    ],
});

router.beforeEach((to, from) => {
    console.log("to", to);
    //console.log('from',from)
    if (to.name === "login") {
        return { name: "home" };
    }
});

export default router;
