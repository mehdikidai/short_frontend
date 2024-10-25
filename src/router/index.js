import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { useTitle } from "@vueuse/core";

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
                verify: true,
            },
        },
        {
            path: "/users",
            name: "users",
            component: () => import("@/views/UsersView.vue"),
            meta: {
                title: "users title",
                requiresAuth: true,
                verify: true,
            },
        },
        {
            path: "/setting",
            name: "setting",
            component: () => import("@/views/SettingView.vue"),
            meta: {
                title: "setting title",
                requiresAuth: true,
                verify: true,
            },
        },
        {
            path: "/login",
            name: "login",
            component: () => import("@/views/LoginView.vue"),
            meta: {
                title: "login title",
                verify: false,
            },
        },
        {
            path: "/register",
            name: "register",
            component: () => import("@/views/RegisterView.vue"),
            meta: {
                title: "register title",
                verify: false,
            },
        },
        {
            path: "/links",
            name: "links",
            component: () => import("@/views/UrlsView.vue"),
            meta: {
                title: "links title",
                requiresAuth: true,
                verify: true,
            },
        },
        {
            path: "/trash",
            name: "Trash",
            component: () => import("@/views/Trash.vue"),
            meta: {
                title: "links title",
                requiresAuth: true,
                verify: true,
            },
        },
        {
            path: "/url/:id(\\d+)",
            name: "url",
            component: () => import("@/views/ShowUrlView.vue"),
            meta: {
                title: "show url",
                requiresAuth: true,
                verify: true,
            },
        },
        {
            path: "/map",
            name: "map",
            component: () => import("@/views/MapView.vue"),
            meta: {
                title: "links title",
                requiresAuth: true,
                verify: true,
            },
        },
        {
            path: "/links/create",
            name: "createLink",
            component: () => import("@/views/CreateUrlView.vue"), // Replaced AboutView with CreateUrlView
            meta: {
                title: "create title",
                requiresAuth: true,
                verify: true,
            },
        },
        {
            path: "/links/:id/edit",
            name: "editLink",
            component: () => import("@/views/editUrlView.vue"),
            meta: {
                title: "edit title",
                requiresAuth: true,
                verify: true,
            },
        },
        {
            path: "/email/verify",
            name: "verifyEmail",
            component: () => import("@/views/VerifyEmailView.vue"),
            meta: {
                title: "create title",
                requiresAuth: true,
            },
            beforeEnter: (to, from, next) => {
                const verified =
                    localStorage.getItem("email_verified") === "true"
                        ? true
                        : false;
                if (verified) {
                    return next({ name: "home" });
                }

                next();
            },
        },
        {
            path: "/profile",
            name: "profile",
            component: () => import("@/views/ProfileView.vue"),
            meta: {
                title: "profile",
                requiresAuth: true,
                verify: true,
            },
        },
    ],
});

router.beforeEach((to, from, next) => {

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const requiresVerify = to.matched.some((record) => record.meta.verify);

    const isAuthenticated = !!localStorage.getItem("token");

    const verified =
        localStorage.getItem("email_verified") === "true" ? true : false;

    if (requiresAuth && !isAuthenticated) {
        return next({ name: "login" });
    }

    if (!verified && requiresVerify) {
        return next({ name: "verifyEmail" });
    }

    useTitle(to.meta.title);

    next();
});

export default router;
