<template>
	<div class="box_1" ref="DIV">
		<h2>Most devices</h2>
		<canvas ref="chartEl"></canvas>
	</div>
</template>

<script setup>

import { ref, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';
import { chartOne } from '@/config/chart';

const DIV = ref(null);

const chartEl = ref(null);

const chartInstanceOne = ref(null);

const props = defineProps({
	dataCart: Array,
});
 
const chartFn = async (DATA) => {

	await nextTick();

	if (!chartEl.value || !chartEl.value.getContext) {
        console.error("Element canvas is not ready or context is unavailable.");
        return;
    }

	if (chartInstanceOne.value) {
		chartInstanceOne.value.destroy();
	}

	chartInstanceOne.value = new Chart(chartEl.value, chartOne(DATA));
};

watch(
	() => props.dataCart,
	(newData) => {
		chartFn(newData);
	},
	{ immediate: true }
);
</script>

<style lang="scss" scoped>
div {
	flex: 1 1 360px;
	background: var(--white);
	border-radius: 12px;
	box-shadow: var(--box-shadow);
	border: var(--border);
	padding: 30px 20px;
	display: flex;
	flex-direction: column;
	aspect-ratio: 16/9 !important;
	justify-content: space-between;
	h2 {
		font-size: 1rem;
		font-weight: 500;
		color: var(--black);
		opacity: 0.7;
		text-transform: capitalize;
	}
	canvas {
		height: calc(100% - 45px) !important;
		width: 100% !important;
	}
}
</style>
