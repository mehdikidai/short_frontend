<template>
	<button class="add_new_link" @click="goToCreateLink">
		<Icon :name="isCreatePage ? 'arrow_right_alt' : 'add'" />
	</button>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const route = useRoute();

const isCreatePage = computed(() => route.name === 'createLink');

const goToCreateLink = () => {
	const destination = { name: 'createLink' };

	if (route.name === 'createLink') {
		router.back()
	}

	router.push(destination);

	console.log(isCreatePage.value);
};
</script>

<style lang="scss" scoped>
.add_new_link {
	position: fixed;
	bottom: 40px;
	right: 20px;
	width: 33px;
	height: 33px;
	background: var(--main);
	border: none;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 4px;
	transform: scale(1);
	box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 6px;
	z-index: 10;
	opacity: 1;
	transition: transform 0.2s ease-in-out, background 0.3s ease,opacity 0.1s linear;
	&:active {
		transform: scale(1);
		opacity: .4;
	}
	i {
		font-size: 20px;
		pointer-events: none;
	}
}
</style>
