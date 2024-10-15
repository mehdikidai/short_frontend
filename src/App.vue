<script setup>
import { onMounted } from "vue";
import i18n from "./lang";
import { useAxios } from "@/api";
import { useUserStore } from "./stores/user";
import { useRouter } from "vue-router";
import SplashScreen from "@/components/SplashScreen.vue";

const store = useUserStore();

const router = useRouter();


onMounted(async () => {


    const lang = localStorage.getItem("lang");

    if (lang) i18n.global.locale = lang;

    try {
        const res = await useAxios.get("/api/user", { ...store.configApi });
        store.setUser(res.data);
        console.log(res.data);
    } catch (err) {
        store.resetUser();
        router.push({ name: "login" });
    }
});
</script>

<template>

    <SplashScreen />

    <RouterView  :key="$route.params.id" />


</template>

<style scoped></style>
