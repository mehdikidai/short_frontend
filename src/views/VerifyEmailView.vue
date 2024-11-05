<template>
	<div class="verification_code">
		<div class="box">
			<logo />
			<h1>enter verification code</h1>
			<p>Lorem ipsum dolor sit amet consectetur.</p>
			<form action="#" method="post" @submit.prevent="submit">
				<div class="box_form">
					<input
						type="text"
						v-model="code.iOne"
						maxlength="1"
						@input="validateInput($event)"
						data-n="1"
						@keydown="keydownInput($event)"
						:class="{ active: zn(code.iOne) }"
						v-focus-input
						placeholder="-"
					/>
					<input
						type="text"
						v-model="code.iTwo"
						maxlength="1"
						@input="validateInput($event)"
						data-n="2"
						@keydown="keydownInput($event)"
						:class="{ active: zn(code.iTwo) }"
						placeholder="-"
					/>
					<input
						type="text"
						v-model="code.iThree"
						maxlength="1"
						@input="validateInput($event)"
						data-n="3"
						@keydown="keydownInput($event)"
						:class="{ active: zn(code.iThree) }"
						placeholder="-"
					/>
					<input
						type="text"
						v-model="code.iFour"
						maxlength="1"
						@input="validateInput($event)"
						data-n="4"
						@keydown="keydownInput($event)"
						:class="{ active: zn(code.iFour) }"
						placeholder="-"
					/>
					<input
						type="text"
						v-model="code.iFive"
						maxlength="1"
						@input="validateInput($event)"
						data-n="5"
						@keydown="keydownInput($event)"
						:class="{ active: zn(code.iFive) }"
						placeholder="-"
					/>
					<input
						type="text"
						v-model="code.iSix"
						maxlength="1"
						@input="validateInput($event)"
						data-n="6"
						@keydown="keydownInput($event)"
						:class="{ active: zn(code.iSix) }"
						placeholder="-"
					/>
				</div>
				<button type="submit">verify your account</button>
			</form>
			<span>
				<strong>didn't receive a code ?</strong>
				<a href="">click her</a></span
			>
		</div>
	</div>
</template>

<script setup>

import { reactive } from 'vue';
import { useUserStore } from '@/stores/user';
import { z } from 'zod';
import { useAxios } from '@/api';
import { useRouter } from 'vue-router';
import { useDark, useToggle } from '@vueuse/core';

const isDark = useDark();

const toggleDark = useToggle(isDark);

const router = useRouter();

const userStore = useUserStore();
const { setEmailVerified } = userStore;
const zodNumber = z.string().regex(/^[0-9]$/);
const zodCodeVerification = z.string().regex(/^[0-9]{6}$/);

const code = reactive({
	iOne: '',
	iTwo: '',
	iThree: '',
	iFour: '',
	iFive: '',
	iSix: '',
});

const zn = (el) => {
	return zodNumber.safeParse(el).success;
};

const submit = async () => {
	const fullCode = `${code.iOne}${code.iTwo}${code.iThree}${code.iFour}${code.iFive}${code.iSix}`;

	const { success, data: verification_code } = zodCodeVerification.safeParse(fullCode);

	if (success) {
		try {
			const res = await useAxios.post('/api/email/verify', { verification_code }, { ...userStore.configApi });

			setEmailVerified(true);

			router.push({ name: 'home' });

			console.log(res);
		} catch (error) {
			console.log(error.message);
		}
	}
};

const validateInput = (event) => {
	const el = event.target;
	const result = zodNumber.safeParse(el.value);

	if (Number(el.nextElementSibling?.dataset?.n) <= 6 && result.success) {
		el.nextElementSibling.focus();
	}
};

const keydownInput = (event) => {
	const el = event.target;

	switch (event.key) {
		case 'Backspace':
			if (el.value === '' && Number(el.previousElementSibling?.dataset?.n) >= 1) {
				el.previousElementSibling.focus();
			}
			break;

		default:
			return;
	}
};

const vFocusInput = {
	mounted(el) {
		el.focus();
	},
};
</script>

<style lang="scss" scoped>
.verification_code {
	position: fixed;
	height: 100vh;
	width: 100%;
	background: var(--gray);
	inset: 0;
	z-index: 9999;
	img {
		position: absolute;
		left: 50%;
		top: -40px;
		transform: translate(-50%, -100%);
		height: 34px;
	}
	.box {
		position: absolute;
		inset: 50%;
		transform: translate(-50%, -50%);
		width: calc(100vw - 40px);
		max-width: 440px;
		height: auto;
		background: var(--white);
		padding: 40px;
		display: flex;
		flex-direction: column;
		height: 330px;
		gap: 5px;
		border-radius: 12px;
		h1 {
			font-size: toRem(22);
			color: var(--black);
			font-weight: 500;
			text-transform: capitalize;
		}
		p {
			font-size: toRem(14);
			color: var(--black);
			opacity: 0.5;
		}
		form {
			display: flex;
			//background: red;
			flex-direction: column;
			gap: 30px;
			margin-block: 20px;
		}
		&_form {
			display: grid;
			grid-template-columns: repeat(6, 40px);
			justify-content: space-between;
			input {
				aspect-ratio: 1;
				text-align: center;
				background: transparent;
				border: none;
				border: 1px solid rgba(136, 136, 136, 0.877);
				color: var(--black);
				font-size: 18px;
				border-radius: 4px;
				transition: all 0.2s ease;
				// &.active {
				// 	border: 1px solid rgba(136, 136, 136, 1);
				// }
			}
		}
		button {
			height: 38px;
			border: none;
			padding-inline: 20px;
			border-radius: 4px;
			cursor: pointer;
			//font-size: 14px;
			background: var(--main);
			color: var(--white-fix);
		}
	}
	span {
		color: var(--black);
		font-size: 14px;
		transition: all 0.3s ease-in-out;
		strong {
			opacity: 0.6;
			font-weight: 400;
		}
		a {
			color: var(--main);
			margin-left: 5px;
		}
		&:hover {
			opacity: 1;
		}
	}
}
</style>
