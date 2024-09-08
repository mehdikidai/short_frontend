import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
            meta:{
              title:'home title'
            }
        },
        {
            path: "/about",
            name: "about",
            component: () => import("../views/AboutView.vue"),
            meta:{
              title:'about title'
            }
        },
        {
            path: "/login",
            name: "login",
            component: () => import("../views/AboutView.vue"),
            meta:{
              title:'login title'
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
                    meta:{
                      title:'links title'
                    }
                },
                {
                    path: "create",
                    name: "createLink",
                    component: () => import("../views/CreateUrlView.vue"), // Replaced AboutView with CreateUrlView
                    meta:{
                      title:'create title'
                    }
                },
            ],
        },
    ],
});

router.beforeEach((to, from) => {
    console.log("to", to.meta.title);
    //console.log('from',from)

    document.title = to.meta.title

    if (to.name === "login") {
        return { name: "home" };
    }
});

export default router;
