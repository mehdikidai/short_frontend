<script setup>
import { onMounted } from 'vue';
import i18n from './lang';
import { useAxios } from '@/api';
import { useUserStore } from './stores/user';
import { useRouter } from 'vue-router';
import SplashScreen from '@/components/SplashScreen.vue';

const store = useUserStore();

const router = useRouter();

onMounted(async () => {
    i18n.global.locale = localStorage.getItem('lang') || 'en';

    try {
        const res = await useAxios.get('/api/user', { ...store.configApi });
        store.setUser(res.data);
        //console.log(res.data);
    } catch (err) {
        store.resetUser();
        router.push({ name: 'login' });
    }
});
</script>

<template>

    <SplashScreen />
    <RouterView :key="$route.params.id" />
    
</template>

<style scoped></style>
