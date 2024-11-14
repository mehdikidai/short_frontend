<template>
	<Layout>
		<Tit text="trash can" icon="delete" />
		<div class="box_trash">
			<table v-if="List.length > 0">
				<thead>
					<tr>
						<th>id</th>
						<th class="icon">logo</th>
						<th>title</th>
						<th class="date">date</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item, i) in List" :key="i">
						<td data-tit="id">{{ item.id }}</td>
						<td class="icon ignore">
							<img
								:src="'https://www.google.com/s2/favicons?domain=' + $getDomain(item.original_url) + '&sz=64'"
								alt="favicon"
							/>
						</td>
						<td data-tit="title">{{ item.title }}</td>
						<td class="date" data-tit="date">
							{{ $momentFromNow(item.deleted_at, $i18n.locale) }}
						</td>
						<td class="ignore">
							<span class="actions">
								<button :disabled="disabledBtn" @click="forceDelete(item.id)">
									<Icon name="delete" />
								</button>
								<button :disabled="disabledBtn" @click="restoreUrl(item.id)">
									<Icon name="restart_alt" />
								</button>
							</span>
						</td>
					</tr>
				</tbody>
			</table>
			<div v-else class="empty">

				<h2 v-if="empty">{{ $t('pages.empty') }}</h2>
				<h2 v-else>loading</h2>

			</div>

			<div class="pagination" v-if="currentPage < lastPage || currentPage > 1">
				<button class="show_more" :disabled="currentPage <= 1" @click="prevPage">prev</button>
				<span class="current_page"> {{ currentPage }} </span>
				<button class="show_more" :disabled="currentPage >= lastPage" @click="nextPage">next</button>
			</div>
		</div>
	</Layout>
</template>

<script setup>
//--------------------------------------------

import { API } from '@/api';
import Layout from '@/components/Layout.vue';
import Tit from '@/components/Tit.vue';
import { ref, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { useSwalDelete } from '@/helper';
import { toast } from 'vue3-toastify';

//--------------------------------------------

const store = useUserStore();
const loading = ref(false);
const empty = ref(false);
const disabledBtn = ref(false);
const currentPage = ref(1);
const lastPage = ref(1);
const Page = ref(1);
const List = ref([]);
const effect = ref(null);

//--------------------------------------------

const nextPage = () => (Page.value += 1);
const prevPage = () => (Page.value -= 1);

//--------------------------------------------

watch(
	[effect, Page],
	async () => {
		loading.value = true;
		try {
			const response = await API(`api/trash?page=${Page.value}`, {
				...store.configApi,
			});

			List.value = [...response.data.data];

			currentPage.value = response.data.current_page;

			lastPage.value = response.data.last_page;

			empty.value = response.data.data.length === 0;
		} catch (error) {
			console.log(error);
		} finally {
			loading.value = false;
		}
	},
	{ immediate: true }
);

//--------------------------------------------

const restoreUrl = async (id) => {
	disabledBtn.value = true;
	try {
		const response = await API.patch(`/api/restore_url/${id}`, null, {
			...store.configApi,
		});

		if (response.status === 200) {
			effect.value = new Date().getTime();
      toast.success('Successfully completed.')
			if (List.value.length <= 1) Page.value--;
		}
	} catch (error) {
		console.log(error);
	} finally {
		disabledBtn.value = false;
	}
};

//--------------------------------------------

const forceDelete = async (id) => {

	const doIt = await useSwalDelete({
		title: 'Delete short link',
		text: 'are you sure you want to delete',
		cancelText: 'cancel',
		deleteText: 'delete',
	});

	if (!doIt) return;

	disabledBtn.value = true;
	try {
		const response = await API.delete(`/api/force_delete_url/${id}`, {
			...store.configApi,
		});
		if (response.status === 200) {
			effect.value = new Date().getTime();

			if (List.value.length <= 1) Page.value--;
		}
	} catch (error) {
		console.log(error);
	} finally {
		disabledBtn.value = false;
	}
};

//--------------------------------------------
</script>

<style lang="scss" scoped>

.box_trash {
	//background: red;
	margin-bottom: 20px;
}
table,
td,
th {
	border: 1px solid var(--border-color);
	text-align: left;
}

table {
	border-collapse: collapse;
	width: 100%;
}

div.empty {
	height: 120px;
	display: flex;
	align-items: center;
	justify-content: center;
	h2 {
		font-size: 20px;
		color: var(--black);
		opacity: 0.7;
		text-transform: capitalize;
	}
}

tr {
	opacity: 0.8;
	// &:nth-child(even) {
	//     background: var(--white);
	// }
}

th {
	text-transform: capitalize;
}

th,
td {
	padding: 6px 12px;
	color: var(--black);
	font-size: 14px;
	span.actions {
		//background: red;
		display: flex;
		gap: 8px;
		button {
			width: 24px;
			height: 24px;
			border: none;
			background: rgba(255, 255, 255, 0.05);
			border-radius: 4px;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			transition: all 0.1s ease-in-out;
			&:active {
				box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
				transform: translateY(3px);
				i {
					opacity: 1;
				}
			}
			i {
				font-size: 16px;
				color: var(--black);
				opacity: 0.7;
			}
		}
	}
}

td.icon {
	padding: 0;
	position: relative;
	img {
		width: 18px;
		height: 18px;
		position: absolute;
		inset: 50%;
		transform: translate(-50%, -50%);
	}
}

td.icon,
th.icon {
	width: 42px;
}

th:nth-child(1),
td:nth-child(1) {
	width: 50px;
}

th.date,
td.date {
	width: 250px;
}

th:last-child,
td:last-child {
	width: 80px;
}

.pagination {
	display: flex;
	gap: 10px;
	.show_more {
		background: var(--white);
		border: none;
		max-width: 140px;
		height: 36px;
		padding-inline: 10px;
		border-radius: 4px;
		border: var(--border);
		cursor: pointer;
		color: var(--black);
		font-size: 12px;
		&[disabled] {
			opacity: 0.2;
			pointer-events: none;
		}
	}
	span.current_page {
		line-height: 36px;
		padding-inline: 10px;
		color: var(--black);
		font-size: 12px;
		min-width: 40px;
		text-align: center;
	}
}

@include phone {
	table {
		border: none;
		th {
			display: none;
		}
		tbody {
			display: flex;
			flex-direction: column;
			gap: 15px;
			tr {
				display: flex;
				flex-direction: column;
				background: var(--white);
				padding: 10px 15px;

				gap: 4px;
				border-radius: 6px;

				td {
					display: block;
					height: 40px;
					background: transparent;
					width: 100% !important;
					border: none;
					&:not(.ignore):before {
						content: attr(data-tit) ' : ';
					}
					&:not(:last-child) {
						border-bottom: 1px solid var(--border-color);
					}
					&.icon {
						order: -1;
						img {
							width: 18px;
							height: 18px;
							position: absolute;
							inset: auto;
							top: 50%;
							left: 10px;
							transform: translate(0, -50%);
						}
					}
				}
			}
		}
	}
}
</style>
