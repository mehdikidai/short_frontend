<script setup>
import Layout from '@/components/Layout.vue';
import Chart from 'chart.js/auto';
import { ref, watch, computed, onMounted, onUnmounted, nextTick, watchEffect } from 'vue';
import { API } from '@/api';
import { useUserStore } from '@/stores/user';
import { z } from 'zod';
import SelectBox from '@/components/SelectBox .vue';
import gsap from 'gsap';
import { gsapConfig } from '@/config/gsap';
import { format } from 'numerable';
import { useMediaQuery } from '@vueuse/core';
import { io } from 'socket.io-client';
import { chartVisitsConfig, chartTwoConfig } from '@/config/chart';
import FlagBox from '@/components/FlagBox.vue';
import { Icon as Iconx } from '@iconify/vue';
import { debounce } from 'lodash';

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
const disabledFilter = ref(false);

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

const mostCountries = ref([]);

const topFuorCountries = computed(() => mostCountries.value.slice(0, 4));

const totalCountries = computed(() => mostCountries.value.length);

//--------------------------------------------------------------------------

watch([data_visits], async () => {
	chartVisits(data_visits.value);
	chartTwo(numberOfVisits.value);
});

//-----------------------------------------------

onMounted(async () => {
	await nextTick();

	gsap.from('.box', { ...gsapConfig });
	gsap.from('.number_box', { ...gsapConfig, y: 0, x: 40, duration: 1.2, delay: 1.2 });
	gsap.from('.select_page_home', { ...gsapConfig, y: 0, x: -40, filter: 'blur(10px)', duration: 1.2, delay: 1.6 });
});

watch(mostCountries, async () => {
	await nextTick();

	if (disabledFilter.value) return;

	const gt = gsap.timeline({});
	gt.from('.box_flag', {
		...gsapConfig,
		duration: 1.2,
		opacity: 0,
		x: 0,
		y: 40,
		delay: 0,
		opacity: 0,
		onStart: () => {
			disabledFilter.value = true;
		},
		onComplete: () => {
			disabledFilter.value = false;
			gsap.set('.box_flag', { clearProps: 'all' });
		},
	});
});

//-----------------------------------------------

watch(
	[updateAnalytics, filter, socketEvent],
	async () => {
		const { success } = FilterEnum.safeParse(filter.value);

		if (success) {
			try {
				const response = await API(`/api/analytics/${filter.value}`, {
					...store.configApi,
				});

				console.log(response.data.total_urls);

				totalUrls.value = response.data.total_urls;
				urls.value = response.data.urls;
				trash.value = response.data.urls_trash;
				numberOfVisits.value = response.data.number_of_visits;
				mostCountries.value = response.data.most_countries;
				console.log(response.data.most_countries);
			} catch (error) {
				console.log(error.message);
			}
		}
	},
	{ immediate: true }
);

//-----------------------------------

const chartVisits = (DATA) => {
	if (!isSmallScreen) return;

	if (chartInstanceOne.value) chartInstanceOne.value.destroy();

	chartInstanceOne.value = new Chart(chartA.value, chartVisitsConfig(DATA));
};

//-----------------------------------

const chartTwo = (DATA) => {
	if (!isSmallScreen) return;

	if (chartInstanceTwo.value) chartInstanceTwo.value.destroy();

	chartInstanceTwo.value = new Chart(chartB.value, chartTwoConfig(DATA));
};

//-----------------------------------

const handelFilter = (v) => (filter.value = v);

// section socket io  ---------------

try {
	let socket;

	const socketSetInterval = setInterval(() => {
		if (store.socketRoom === null) return;

		socket = io(import.meta.env.VITE_SOCKET_IO_URL, { query: { room: store.socketRoom } });

		socket.on(
			'newVisit',
			debounce(() => {
				if (!disabledFilter.value) {
					socketEvent.value = new Date().getTime();
				}
			}, 2000)
		);

		clearInterval(socketSetInterval);
	}, 2000);

	onUnmounted(() => {
		if (socket) {
			socket.disconnect();
		}
	});
} catch (error) {
	console.log(error.message);
}

//----------------------------------
</script>

<template>
	<Layout>
		<div class="filter_url_x">
			<SelectBox
				:options="listFilter"
				:value="filter"
				@selectedValue="handelFilter"
				class="select_page_home"
				:disabled="disabledFilter"
			/>
		</div>
		<div class="boxs">
			<div class="box">
				<div class="icon_filter">
					<icon name="more_horiz" />
				</div>
				<div class="icon">
					<!-- <icon name="link" /> -->
					<Iconx icon="charm:link" />
				</div>
				<div class="content">
					<h2 class="tit_box">{{ $t('pages.number_of_links') }}</h2>
					<h3 class="number_box">{{ format(totalUrls, '0 a') }}</h3>
					<span class="span_box">{{ $t('pages.total_links_created') }}</span>
				</div>
			</div>

			<div class="box">
				<div class="icon_filter">
					<icon name="more_horiz" />
				</div>
				<div class="icon">
					<Iconx icon="charm:eye" />
				</div>
				<div class="content">
					<h2 class="tit_box">{{ $t('pages.number_of_visits') }}</h2>
					<h3 class="number_box">{{ format(visits, '0 a') }}</h3>
					<span class="span_box">{{ $t('pages.total_visits') }}</span>
				</div>
			</div>
			<div class="box">
				<div class="icon_filter">
					<icon name="more_horiz" />
				</div>
				<div class="icon">
					<Iconx icon="charm:bin" />
				</div>
				<div class="content">
					<h2 class="tit_box">{{ $t('pages.trash') }}</h2>
					<h3 class="number_box">{{ format(trash, '0 a') }}</h3>

					<span class="span_box">{{ $t('pages.deleted_links') }}</span>
				</div>
			</div>
			<div class="box">
				<div class="icon_filter">
					<icon name="more_horiz" />
				</div>
				<div class="icon">
					<Iconx icon="charm:flag" />
				</div>
				<div class="content">
					<h2 class="tit_box">{{ $t('pages.countries') }}</h2>
					<h3 class="number_box">{{ totalCountries }}</h3>

					<span class="span_box">{{ $t('pages.total_countries') }}</span>
				</div>
			</div>
		</div>
		<div class="chart_boxs" v-if="isSmallScreen">
			<div class="box_1 continer" ref="DIV">
				<h2>{{ $t('pages.latest_links') }}</h2>
				<canvas ref="chartA"></canvas>
			</div>
			<div class="box_2 continer">
				<h2>{{ $t('pages.latest_statistics') }}</h2>
				<canvas ref="chartB"></canvas>
			</div>
			<div class="box_3 continer">
				<h2>{{ $t('pages.most_countries') }}</h2>
				<div class="flag">
					<FlagBox
						v-for="(el, i) in topFuorCountries"
						:key="i"
						:country="el.country"
						:code="el.code"
						:visits="el.visits"
						class="box_flag_gsap"
					/>
				</div>
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
		height: 150px;
		//border-radius: 12px;
		display: flex;
		align-items: stretch;
		padding: 20px;
		gap: 20px;
		box-shadow: var(--box-shadow);
		border: var(--border);
		position: relative;
		clip-path: inset(0 round 12px);
		&::after {
			content: 'gg';
			position: absolute;
			top: -80px;
			right: -80px;
			width: 160px;
			height: 160px;
			border-radius: 50%;
			filter: blur(50px);
			opacity: 0.1;
			background: rgba(255, 255, 255, 0.2);
		}
		.icon {
			width: 1.75rem;
			height: 1.75rem;
			background: transparent;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 4px;
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
			svg {
				color: var(--main);
				font-size: 1.15rem;
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
				font-size: 1.5rem;
				font-weight: 600;
			}
			span {
				font-size: toRem(14);
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
	div.continer {
		flex: 1 1 360px;
		background: var(--white);
		border-radius: 12px;
		box-shadow: var(--box-shadow);
		border: var(--border);
		padding: 30px 20px;
		display: flex;
		flex-direction: column;
		&:not(:last-child) {
			aspect-ratio: 3/2 !important;
		}
		&:last-child {
			.flag {
				transform: translateY(10px);
			}
		}

		h2 {
			font-size: 0.9rem;
			font-weight: 500;
			color: var(--black);
			opacity: 0.7;
			text-transform: capitalize;
			margin-bottom: 20px;
		}
		// canvas,.countries{
		// 	//height: calc(100% * 0.7) !important;
		// 	//width: 100% !important;
		// }
		.flag {
			//background: red;
			flex: 1;
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-template-rows: max-content max-content;
			gap: 20px;
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
