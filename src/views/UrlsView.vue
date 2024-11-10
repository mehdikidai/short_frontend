<template>
	<Layout>
		<div class="box_main" v-if="Urls.length > 0">
			<div class="filter">
				<button
					:class="['filter-by-date', { asc: sortOrder === 'asc' }]"
					@click="handelSortOrder"
					:disabled="disabledBtnSortOrde"
				>
					{{ $t('pages.sort_by_date') }} <Icon name="filter_list" />
				</button>
			</div>
			<div class="list_items">
				<CardUrl
					v-for="url in Urls"
					:key="url.id"
					:url="url"
					@deleteUrl="deleteUrl"
					class="el_url"
					@handleVisibility="handleVisibility"
				/>
			</div>
			<div class="box_pagination" v-if="showPagination">
				<button
					:class="['btn_pagination', { active: p === currentPage }]"
					@click="handelNavigation(p)"
					v-for="(p, i) in btnsPag"
					:key="i"
				>
					{{ p }}
				</button>
			</div>
		</div>
		<div class="box_main_empty" v-else>
			<h2 v-if="messageEmpty">{{ $t('pages.empty') }}</h2>
			<loadingIcon w="2em" v-else />
		</div>
	</Layout>
</template>

<script setup>
import { API } from '@/api';
import Layout from '@/components/Layout.vue';
import { watch, ref, computed, nextTick, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useSwalDelete, tr } from '@/helper';
import loadingIcon from '../components/loadingIcon.vue';
import CardUrl from '@/components/CardUrl.vue';
import gsap from 'gsap';
import { gsapConfig } from '@/config/gsap';
import { toast } from 'vue3-toastify';
import wait from 'mk_wait';

const disabledBtnSortOrde = ref(true);

const store = useUserStore();
const Urls = ref([]);
const messageEmpty = ref(false);
const sortOrder = ref('desc'); // asc - desc
const currentPage = ref(1);
const lastPage = ref(1);
const effect = ref(0);
const btnsPag = computed(() => {
	const n = currentPage.value;
	const l = lastPage.value;
	const arr = [1, n - 2, n - 1, n, n + 1, n + 2, l];
	return [...new Set(arr)].filter((el) => {
		return el > 0 && el <= lastPage.value;
	});
});

const showPagination = computed(() => lastPage.value != 1);

//---------------------------------------

const tl = gsap.timeline({
	defaults: { ...gsapConfig },
});

watch(
	Urls,
	async () => {
		await nextTick();

		gsap.from('.filter-by-date', {
			opacity: 0,
			duration: 0.2,
			x: 20,
		});

		tl.from('.el_url', {
			stagger: 0.2,
		}); // btn_pagination

		tl.from('.btn_pagination', {
			stagger: 0.15,
			y: 10,
		});

		tl.eventCallback('onComplete', () => {
			disabledBtnSortOrde.value = false;
		});
	},
	{ once: true }
);

//---------------------------------------

const handelNavigation = (pageNumber) => {
	currentPage.value = pageNumber;
	window.scroll({ top: 0, behavior: 'smooth' });
};

const handelSortOrder = () => {
	sortOrder.value = sortOrder.value == 'desc' ? 'asc' : 'desc';
	currentPage.value = 1;
};

//---------------------------------------------------

const handleVisibility = async (id) => {

	const visibilityId = toast.loading('Please wait...');

	try {
		const response = await API.put(`api/urls/${id}/visual/`, null, {
			...store.configApi,
		});

		if (response.status === 200) {
			effect.value = new Date().getTime();

			await wait(1000);

			toast.update(visibilityId, {
				render: response.data.visible ? 'Shown successfully' : 'Hide successfully',
				type: 'success',
				isLoading: false,
				autoClose: 1500,
				closeOnClick: true,
				closeButton: true,
				hideProgressBar: true,
			});
		}
	} catch (error) {

		console.log(error.response?.status || error.message);

		toast.update(visibilityId, {
			render: 'Failed to update visibility',
			type: 'error',
			isLoading: false,
			autoClose: 1500,
			closeOnClick: true,
			closeButton: true,
			hideProgressBar: true,
		});
	}
};

//---------------------------------------------------

const deleteUrl = async (id) => {
	const doIt = await useSwalDelete({
		title: tr('pages.delete_Url'),
		text: tr('pages.It_will_be_moved_to_the_trash'),
		cancelText: tr('pages.cancel'),
		deleteText: tr('pages.delete'),
	});

	if (!doIt) return;

	try {
		const res = await API.delete(`api/urls/${id}`, {
			...store.configApi,
		});

		if (res.data.message) effect.value = new Date().getTime();

		if (Urls.value.length === 1) currentPage.value--;
	} catch (error) {
		console.log(error);
	}
};

watch(
	[currentPage, sortOrder, effect],
	async () => {
		//console.log(currentPage.value);
		try {
			const res = await API.get(`/api/urls/${sortOrder.value}`, {
				...store.configApi,
				params: {
					page: currentPage.value,
				},
			});
			Urls.value = res.data.data;
			lastPage.value = res.data.last_page;

			messageEmpty.value = res.data.data.length === 0;

			console.log(res.data.data);
		} catch (error) {
			console.log(error);
		}
	},
	{ immediate: true }
);
</script>

<style lang="scss" scoped>
@import './../assets/scss/var';
.box_main {
	//background: red;
	min-height: 100px;
	&_empty {
		flex: 1;
		background: transparent;
		display: flex;
		align-items: center;
		justify-content: center;
		max-height: 400px;
		svg {
			color: var(--black);
		}
		h2 {
			color: var(--black);
			opacity: 0.7;
			text-transform: capitalize;
		}
	}
	.filter {
		height: 36px;
		//background: blue;
		//margin-top: 20px;
		&-by-date {
			height: 36px;
			padding-inline: 15px;
			float: right;
			cursor: pointer;
			border: none;
			border-radius: 6px;
			display: flex;
			align-items: center;
			gap: 4px;
			border: var(--border);
			background: var(--white);
			color: var(--black);
			i {
				font-size: 16px;
				transition: all 0.3s ease-in-out;
			}
			&.asc {
				i {
					transform: rotate(180deg);
				}
			}
		}
	}
	.list_items {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
		gap: 20px;
		margin-block: 20px 20px;
		min-height: 340px;
		align-content: start;
	}
	.box_pagination {
		display: flex;
		flex-direction: row;
		gap: 10px;
		.btn_pagination {
			width: toRem(40);
			height: toRem(40);
			background: var(--white);
			border-radius: 4px;
			border: none;
			cursor: pointer;
			color: var(--black);
			font-size: toRem(12);
			border: var(--border);
			&.active {
				background: var(--main);
				color: #fff;
			}
		}
	}
}

@include phone {
	.box_main .list_items {
		grid-template-columns: 1fr;
		gap: 15px;
		.box {
			height: 190px;
			display: flex;
			flex-direction: column;
			padding: 20px 15px;
			.link-card-icon-information {
				gap: 15px;
			}
			.link-card-icon-information .link-card__info-container a.link.link_short {
				line-height: 21px;
			}
		}
		.link-card__button-container {
			height: 26px;
			display: flex;
			justify-content: flex-end;
			gap: 8px;
		}
	}
}
</style>
