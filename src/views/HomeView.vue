<script setup>
import Layout from '@/components/Layout.vue';
import Chart from 'chart.js/auto';
import { ref, watch, computed, onMounted, nextTick, onUnmounted } from 'vue';
import { useAxios } from '@/api';
import { useUserStore } from '@/stores/user';
import { z } from 'zod';
import SelectBox from '@/components/SelectBox .vue';
import gsap from 'gsap';
import { gsapConfig } from '@/config/gsap';
import { format } from 'numerable';
import { useMediaQuery } from '@vueuse/core';
import { io } from 'socket.io-client';

const store = useUserStore();

const chartA = ref(null);
const chartB = ref(null);

const isSmallScreen = useMediaQuery('(min-width: 600px)');

const DIV = ref(null);

const chartInstanceOne = ref(null);
const chartInstanceTwo = ref(null);

const updateAnalytics = ref(null);

const filter = ref('all');

const socketEvent = ref(null);

//--------------------------------------------------------------------------

//--------------------------------------------------------------------------

const listFilter = ref(['last_day', 'last_week', 'last_month', 'last_year', 'all']);

const FilterEnum = z.enum(listFilter.value);

//--------------------------------------------------------------------------

const totalUrls = ref(0);
const urls = ref([]);
const visits = computed(() => urls.value.reduce((total, el) => total + el.clicks_count, 0));
const trash = ref(0);

const data_visits = computed(() => {
	let list = [];
	urls.value.forEach((el) => {
		list.push({
			id: el.id,
			visits: el.clicks_count,
		});
	});

	return [...list, ...new Array(5).fill({ id: '_', visits: '0' })].slice(0, 5);
});

const numberOfVisits = ref([]);

//--------------------------------------------------------------------------

const gridChart = {
	x: {
		grid: {
			display: true,
			color: 'rgba(255, 255, 255, 0)',
		},
		ticks: {
			beginAtZero: true,
			font: {
				size: 12,
			},
			color: '#777',
		},
		border: {
			color: '#0000',
		},
	},
	y: {
		grid: {
			display: true,
			color: 'rgba(255, 255, 255, 0)',
		},
		ticks: {
			beginAtZero: true,
			font: {
				size: 12,
			},
			color: '#777',
		},
		border: {
			color: '#0000',
		},
		beginAtZero: true,
	},
};

watch([data_visits], async () => {
	chartVisits(data_visits.value);
	chartTwo(numberOfVisits.value);
});

//-----------------------------------------------

onMounted(() => {
	const gt = gsap.timeline();

	gsap.from('.box', {
		...gsapConfig,
	});
	gsap.from('.tit_box', { ...gsapConfig, y: 0, x: -40 });
	gt.from('.number_box', { ...gsapConfig, y: 0, x: 40 });
	gt.from('.content span', { ...gsapConfig, y: 40, filter: 'blur(10px)' });
});

//-----------------------------------------------

watch(
	[updateAnalytics, filter, socketEvent],
	async () => {
		const { success } = FilterEnum.safeParse(filter.value);

		if (success) {
			try {
				const response = await useAxios(`/api/analytics/${filter.value}`, {
					...store.configApi,
				});

				console.log(response.data.total_urls);

				totalUrls.value = response.data.total_urls;
				urls.value = response.data.urls;
				trash.value = response.data.urls_trash;
				numberOfVisits.value = response.data.number_of_visits;
				console.log(response.data.number_of_visits);
			} catch (error) {
				console.log(error.message);
			}
		}
	},
	{ immediate: true }
);

const chartVisits = (DATA) => {
	if (!isSmallScreen) {
		return;
	}

	if (chartInstanceOne.value) {
		chartInstanceOne.value.destroy();
	}

	chartInstanceOne.value = new Chart(chartA.value, {
		type: 'line',
		data: {
			labels: DATA.map((row) => row.id),
			datasets: [
				{
					label: 'Number of visits by id',
					data: DATA.map((row) => row.visits),
					backgroundColor: '#2a9d8f',
					borderColor: '#2a9d8f', // mainColor.value
					tension: 0.3,
				},
			],
		},
		options: {
			plugins: {
				title: {
					display: false,
				},
				legend: {
					display: false,
				},
			},
			scales: gridChart,
			responsive: true,
			maintainAspectRatio: false,
		},
	});
};

const chartTwo = (DATA) => {
	if (!isSmallScreen) {
		return;
	}
	if (chartInstanceTwo.value) {
		chartInstanceTwo.value.destroy();
	}

	chartInstanceTwo.value = new Chart(chartB.value, {
		type: 'bar',
		data: {
			labels: Object.keys(DATA),
			datasets: [
				{
					label: 'Visits',
					data: Object.values(DATA),
					backgroundColor: ['#e76f51', '#2a9d8f'],
					borderColor: '#36A2EB',
					barPercentage: 0.1,
					borderRadius: 0,
					borderSkipped: false,
				},
			],
		},
		options: {
			plugins: {
				title: {
					display: false,
				},
				legend: {
					display: false,
				},
			},
			scales: gridChart,
			responsive: true,
			maintainAspectRatio: false,
		},
	});
};

const handelFilter = (v) => {
	filter.value = v;
};

// section socket io  ===========

try {
	
	const socket = io(import.meta.env.VITE_SOCKET_IO_URL);

	socket.on('newVisit', (id) => {

		if (id === store.id) {

			socketEvent.value = new Date().getTime();
		}

	});

	onUnmounted(() => {

		socket.disconnect();
		
	});

} catch (error) {

	console.log(error.message);

}

//===============================
</script>

<template>
	<Layout>
		<div class="filter_url_x">
			<SelectBox :options="listFilter" :value="filter" @selectedValue="handelFilter" />
		</div>
		<div class="boxs">
			<div class="box">
				<div class="icon_filter">
					<icon name="more_horiz" />
				</div>
				<div class="icon">
					<icon name="link" />
				</div>
				<div class="content">
					<h2 class="tit_box">Number of links</h2>
					<h3 class="number_box">{{ format(totalUrls, '0 a') }}</h3>
					<span>Lorem ipsum dolor sit.</span>
				</div>
			</div>

			<div class="box">
				<div class="icon_filter">
					<icon name="more_horiz" />
				</div>
				<div class="icon">
					<icon name="visibility" />
				</div>
				<div class="content">
					<h2 class="tit_box">Number of visits</h2>
					<h3 class="number_box">{{ format(visits, '0 a') }}</h3>
					<span>Lorem ipsum dolor sit.</span>
				</div>
			</div>
			<div class="box">
				<div class="icon_filter">
					<icon name="more_horiz" />
				</div>
				<div class="icon">
					<icon name="delete" />
				</div>
				<div class="content">
					<h2 class="tit_box">trash</h2>
					<h3 class="number_box">{{ format(trash, '0 a') }}</h3>

					<span>Lorem ipsum dolor sit.</span>
				</div>
			</div>
		</div>
		<div class="chart_boxs" v-if="isSmallScreen">
			<div class="box_1" v-kidai ref="DIV">
				<h2>Most devices</h2>
				<canvas ref="chartA"></canvas>
			</div>
			<div class="box_2" v-kidai>
				<h2>Most devices</h2>
				<canvas ref="chartB"></canvas>
			</div>
		</div>
	</Layout>
</template>

<style lang="scss" scoped>
.filter_url_x {
	height: 36px;
	//background: red;
	margin-bottom: 20px;
	span {
		float: right;
		position: relative;
		select {
			font-size: 0.9rem;
			padding: 6px 40px 6px 15px;
			border-radius: 4px;
			background: var(--white);
			color: var(--black);
			border: var(--border);
			appearance: none;
			font-size: 0.875rem;
			text-transform: capitalize;
			cursor: pointer;
			option {
				background: transparent;
				color: var(--black);
				border: none;
			}
		}
		i {
			position: absolute;
			background: transparent;
			right: 10px;
			top: 50%;
			transform: translateY(-50%);
			font-size: 18px;
			color: var(--black);
			pointer-events: none;
		}
	}
}

.boxs {
	min-height: 100px;
	//background: red;
	display: flex;
	flex-wrap: wrap;
	gap: 20px;
	.box {
		flex: 1 1 360px;
		background: var(--white);
		height: 160px;
		border-radius: 12px;
		display: flex;
		align-items: stretch;
		padding: 20px;
		gap: 20px;
		box-shadow: var(--box-shadow);
		border: var(--border);
		position: relative;
		.icon {
			width: 1.75rem;
			height: 1.75rem;
			background: transparent;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 6px;
			&_filter {
				position: absolute;
				top: 20px;
				right: 20px;
				background: transparent;
				width: 24px;
				height: 24px;
				cursor: pointer;
				z-index: 10;
				i {
					color: var(--black);
				}
			}
			i {
				color: var(--main);
				font-size: 1.25rem;
				color: var(--black-fix);
			}
		}
		&:nth-last-of-type(1) {
			.icon {
				background: #c7e6f0;
			}
		}
		&:nth-last-of-type(2) {
			.icon {
				background: #f6e899;
			}
		}
		&:nth-last-of-type(3) {
			.icon {
				background: #e0daf1;
			}
		}
		&:nth-last-of-type(4) {
			.icon {
				background: rgba(252, 172, 86, 1);
			}
		}
		.content {
			flex: 1;
			//background: blue;
			display: flex;
			flex-direction: column;
			//gap: 0;
			h2 {
				font-size: 1rem;
				font-weight: 500;
				line-height: 30px;
				color: var(--black);
				opacity: 0.8;
				text-transform: capitalize;
			}
			h3 {
				color: var(--black);
				font-size: 2rem;
				font-weight: 600;
			}
			span {
				font-size: 0.875rem;
				color: var(--black);
				opacity: 0.5;
				margin-top: auto;
				text-transform: capitalize;
			}
		}
	}
}

.chart_boxs {
	min-height: 100px;
	//background: red;
	margin-block: 20px;
	display: flex;
	gap: 20px;
	flex-wrap: wrap;
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
}

@include phone {
	.boxs {
		gap: 15px;
		.box {
			height: 140px;
		}
	}
	.chart_boxs {
		margin-block: 15px;
		gap: 15px;
	}
	.chart_boxs div {
		aspect-ratio: 4/3 !important;
		gap: 15px;
	}
	.filter_url_x {
		margin-bottom: 15px;
	}
}
</style>
