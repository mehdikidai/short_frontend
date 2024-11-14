<template>
	<LayoutTwo>
		<StepProgress :step="step" :progress="progress" />

		<div class="login-container" v-if="step === 1">
			<h2>Find your email</h2>

			<form @submit.prevent="submitEmail">
				<div class="form-group">
					<label for="email">your email</label>
					<div class="box_input">
						<input type="text" placeholder="Your Email" v-model="email" autoComplete="off" spellcheck="false" />
					</div>
				</div>

				<button v-if="loadingStepOne" class="btn_login btn_login_loading" type="button">
					<LoaderIcon />
				</button>

				<button v-else class="btn_login" type="submit">
					{{ 'next' }}
				</button>

				<div class="line">
					<span class="or">or</span>
				</div>
				<span class="link_register">
					go back login
					<RouterLink :to="{ name: 'login' }">{{ $t('pages.register') }}</RouterLink>
				</span>
			</form>
		</div>

		<!-- //// -->

		<div class="login-container" v-if="step === 2">
			<h2>Enter the code</h2>

			<form @submit.prevent="submitCode">
				<div class="form-group">
					<label for="email">{{ 'code' }}</label>
					<div class="box_input">
						<input type="text" placeholder="code" v-model="code" autoComplete="off" spellcheck="false" />
					</div>
				</div>

				<div class="box_next_prev">
					<button type="button" class="btn_login btn_prev" @click="step = 1">
						{{ 'prev' }}
					</button>
					<button class="btn_login" type="submit">
						{{ 'next' }}
					</button>
				</div>

				<div class="line">
					<span class="or">or</span>
				</div>
				<span class="link_register">
					go back login
					<RouterLink :to="{ name: 'login' }">{{ $t('pages.register') }}</RouterLink>
				</span>
			</form>
		</div>

		<!-- //// -->

		<div class="login-container" v-if="step === 3">
			<h2>Enter New Password</h2>

			<form @submit.prevent="submitPassword">
				<div class="form-group">
					<label for="email">{{ 'password' }}</label>
					<div class="box_input">
						<input type="text" placeholder="password" v-model="password" autoComplete="off" spellcheck="false" />
					</div>
				</div>

				<div class="box_next_prev">
					<button type="button" class="btn_login btn_prev" @click="step = 2" :disabled="loadingStepThree">
						{{ 'prev' }}
					</button>
					<button v-if="loadingStepThree" class="btn_login btn_login_loading" type="button">
						<LoaderIcon />
					</button>

					<button v-else class="btn_login" type="submit">
						{{ 'next' }}
					</button>
				</div>

				<div class="line">
					<span class="or">or</span>
				</div>
				<span class="link_register">
					go back login
					<RouterLink :to="{ name: 'login' }">{{ $t('pages.register') }}</RouterLink>
				</span>
			</form>
		</div>
	</LayoutTwo>
</template>

<script setup>
import { API } from '@/api';
import LayoutTwo from '@/components/LayoutTwo.vue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import StepProgress from '@/components/StepProgress.vue';
import z, { zodEmail, zodPassword, zodCodeRestPass } from '@/types';
import wait from 'mk_wait';
import LoaderIcon from '@/components/LoaderIcon.vue';

const router = useRouter();

const step = ref(1);
const email = ref('');
const code = ref('');
const password = ref('');

const loadingStepOne = ref(false);

const loadingStepThree = ref(false);

const progress = computed(() => {
	return (100 / 2) * (step.value - 1) + '%';
});

const submitEmail = async () => {
	const { success } = zodEmail.safeParse(email.value);

	if (!success) return;

	loadingStepOne.value = true;

	await wait();

	try {
		const response = await API.post('api/password/send-reset-code', { email: email.value });
		console.log(response);
		code.value = '';
		step.value = 2;
	} catch (error) {
		console.log(error.status);
		toast.error('Failed to send reset code. Please check your email.');
	} finally {
		loadingStepOne.value = false;
	}
};

const submitCode = () => {
	console.log(code.value);

	const { success } = zodCodeRestPass.safeParse(code.value);

	if (!success) return;

	step.value = 3;
	password.value = '';
};

const submitPassword = async () => {
	const { data, success } = z
		.object({
			email: zodEmail,
			password: zodPassword,
			code: zodCodeRestPass,
		})
		.safeParse({
			email: email.value,
			code: code.value,
			password: password.value,
		});

	if (!success) return;

	loadingStepThree.value = true;

	await wait(5000);

	try {
		const response = await API.post('api/password/reset', data);

		if (response.status === 200) {
			toast.success('passwoard changed .', {
				onClose: () => {
					router.push({ name: 'login' });
				},
			});
		}
	} catch (error) {
		console.log(error.status);
		toast.error('Failed to reset password. Please try again.');
	} finally {
		loadingStepThree.value = false;
	}
};
</script>

<style lang="scss" scoped>
@forward './../assets/scss/login';

.btn_login_loading {
	display: flex !important;
	align-items: center;
	justify-content: center;
	pointer-events: none;
}

div.box_next_prev {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px;
	margin-top: 20px;
	button {
		margin-top: 0 !important;
		&.btn_prev {
			background: transparent;
			border: 1px solid var(--border-color);
			color: var(--black);
			&:disabled{
				opacity: 0.4;
			}
		}
	}
}

.login-container h2 {
	margin-bottom: 20px !important;
}
</style>
