<template>
	<div class="step">
		<div class="progress"></div>
		<span class="s-1" :class="{ active: props.step >= 1 }">1</span>
		<span class="s-2" :class="{ active: props.step >= 2 }">2</span>
		<span class="s-3" :class="{ active: props.step >= 3 }">3</span>
	</div>
</template>

<script setup>
const props = defineProps({
	step: {
		type: Number,
		default: 1,
	},
	progress:{
		type:String,
		default:'0%'
	}
});
</script>

<style lang="scss" scoped>
.step {
	height: 2px;
	width: 80%;
	max-width: 360px;
	background: var(--gray-3);
	margin: 0 auto 20px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.progress {
		position: absolute;
		inset: 0;
		height: 100%;
		width: v-bind(progress);
		background: var(--main);
		transition: width 0.2s ease-in-out;
	}
	span {
		width: 24px;
		height: 24px;
		background: var(--gray-3);
		clip-path: circle();
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: toRem(12);
		line-height: toRem(12);
		color: var(--black);
		transition: background 0.2s ease-in-out 0.2s,color .2s ease-in-out .4s;
		transition-delay: 0.2s;
		&.active {
			background: var(--main);
			color: #fff;
		}
	}
}
</style>
