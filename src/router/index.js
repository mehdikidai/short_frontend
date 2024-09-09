import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useTitle } from '@vueuse/core'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
            meta: {
                title: "home title",
                requiresAuth: true,
            },
        },
        {
            path: "/about",
            name: "about",
            component: () => import("../views/AboutView.vue"),
            meta: {
                title: "about title",
                requiresAuth: true,
            },
        },
        {
            path: "/login",
            name: "login",
            component: () => import("../views/LoginView.vue"),
            meta: {
                title: "login title",
            }
        },
        {
            path: "/links",
            name: "linksIndex",
            children: [
                {
                    path: "",
                    name: "links",
                    component: () => import("../views/UrlsView.vue"),
                    meta: {
                        title: "links title",
                        requiresAuth: true,
                    },
                },
                {
                    path: "create",
                    name: "createLink",
                    component: () => import("../views/CreateUrlView.vue"), // Replaced AboutView with CreateUrlView
                    meta: {
                        title: "create title",
                        requiresAuth: true,
                    },
                },
            ],
        },
    ],
});

router.beforeEach((to, from, next) => {

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const isAuthenticated = !!localStorage.getItem("token");

    if (requiresAuth && !isAuthenticated) {
        return next("/login");
    }

    useTitle(to.meta.title)

    next();
});



export default router;
