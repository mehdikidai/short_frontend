<script setup>
import LayoutTwo from '@/components/LayoutTwo.vue';
import { ref, reactive } from 'vue';
import z, { zodEmail, zodPassword } from '@/types';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { API } from '@/api';
import { toast } from 'vue3-toastify';

const store = useUserStore();
const { setToken, setUser } = store;
const router = useRouter();
const showPassword = ref(false);
const data = reactive({
	email: store.email,
	password: '',
});

const dataSchema = z.object({
	email: zodEmail,
	password: zodPassword,
});

const handelShowPassword = () => {
	showPassword.value = !showPassword.value;
};

const submit = async () => {
	const result = dataSchema.safeParse(data);

	if (!result.success) {
		return;
	}

	try {
		const res = await API.post('/api/login', {
			email: data.email,
			password: data.password,
		});

		setToken(res.data.token);
		setUser({ ...res.data.user });

		console.log(res.data.user);

		router.push({ name: 'home' });


	} catch (error) {
        
		console.log(error);

		if (error.response && error.response.status === 401) {
			toast.error('Password not correct');
		} else {
			toast.error('Try again.');
		}
	}
};
</script>

<template>
	<LayoutTwo>
		<div class="login-container">
			<button class="logo_img">
				<Logo />
			</button>
			<h2>{{ $t('pages.welcome_back') }}</h2>

			<form action="/login" method="POST" @submit.prevent="submit">
				<div class="form-group">
					<label for="email">{{ $t('pages.email') }}</label>
					<div class="box_input">
						<input
							type="text"
							id="email"
							name="email"
							:placeholder="$t('pages.email')"
							v-model="data.email"
							autoComplete="off"
							spellcheck="false"
						/>
					</div>
				</div>
				<div class="form-group">
					<label for="password">{{ $t('pages.password') }}</label>
					<div class="box_input">
						<input
							:type="showPassword ? 'text' : 'password'"
							id="password"
							name="password"
							:placeholder="$t('pages.password')"
							v-model="data.password"
						/>
						<button type="button" class="show_pass" @click="handelShowPassword">
							<i class="material-symbols-rounded">
								{{ showPassword ? 'visibility_off' : 'visibility' }}
							</i>
						</button>
					</div>
				</div>
				<RouterLink :to="{name:'resetPassword'}">{{ $t('pages.reset_password') }} ?</RouterLink>
				<button class="btn_login" type="submit">
					{{ $t('pages.login') }}
				</button>
				<div class="line">
					<span class="or">{{ $t('pages.or') }}</span>
				</div>
				<span class="link_register">
					{{ $t("pages.don_t_have_an_account") }}
					<RouterLink :to="{ name: 'register' }">{{ $t('pages.register') }}</RouterLink>
				</span>
			</form>
		</div>
	</LayoutTwo>
</template>

<style lang="scss" scoped>
@forward './../assets/scss/login';
</style>
