<script setup>
import { onMounted, watch } from 'vue';
import i18n from './lang';
import { API } from '@/api';
import { useUserStore } from './stores/user';
import { useRouter } from 'vue-router';
import SplashScreen from '@/components/SplashScreen.vue';
import { directionPage } from '@/helper';

const store = useUserStore();

const router = useRouter();

onMounted(async () => {
	i18n.global.locale = localStorage.getItem('lang') || 'en';

    directionPage(i18n.global.locale)

	if (!localStorage.getItem('token')) {
		router.push({ name: 'login' });
	}

	try {
		const res = await API.get('/api/user', { ...store.configApi });
		store.setUser(res.data);
		console.log(res.data);
	} catch (err) {
		console.clear();
		console.log(err.status);
		router.push({ name: 'login' });

		store.resetUser();
	}
});
</script>

<template>
	<SplashScreen />
	<RouterView :key="$route.params.id" />
</template>

<style scoped></style>
