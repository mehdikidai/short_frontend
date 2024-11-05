<template>
	<div class="page_not_found">
		<h1>404</h1>
		<h2>page not found</h2>
		<button @click="goToHome">go home</button>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const rotater = useRouter();

const goToHome = () => {
	rotater.push({ name: 'home' });
};
</script>

<style lang="scss" scoped>
.page_not_found {
	background: var(--white);
	width: 100%;
	height: 100dvh;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	gap: 20px;
	h1 {
		font-size: 4rem;
		color: var(--black);
	}
	h2 {
		font-size: 2rem;
		color: var(--black);
		opacity: 0.7;
		text-transform: uppercase;
	}
	button{
		cursor: pointer;
		background: transparent;
		border:1px solid var(--black);
		color: var(--black);
		padding: toRem(6) toRem(20);
		font-size: toRem(14);

	}
}
</style>
