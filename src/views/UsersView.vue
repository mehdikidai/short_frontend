<template>
	<Layout>
		<Tit :text="$t('pages.users')" icon="group" />
		<div class="box_users" v-if="loading">
			<table>
				<thead>
					<tr class="tr_el_head">
						<th class="box_img"></th>
						<th class="box_name"></th>
						<th class="box_action"></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(user, i) in users" :key="user.id" class="tr_el_body font_en">
						<td class="td_box_img">
							<span>
								<img
									:src="user.photo || `https://avatar.iran.liara.run/public/${i + 1 + 6 * currentPage}`"
									:alt="user.name"
								/>
							</span>
						</td>
						<td>
							<span class="span_name_email">
								<p>
									{{ $sliceUrl(user.name, 16) }}
									<b :class="{ admin: user.is_admin }">{{ user.is_admin ? 'admin' : null }}</b>
								</p>
								<small>{{ $sliceUrl(user.email, 25) }}</small>
							</span>
						</td>
						<td class="td_box_action">
							<button v-if="!user.is_admin" @click="deleteUser(user.id)" :disabled="disabledBtns">
								<Icon name="delete_forever" />
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="paginate" v-if="lastPage > 1">
			<button class="next btn_next" @click="handelPrev" :disabled="currentPage <= 1">
				<Icon name="arrow_back" />
			</button>
			<span>{{ currentPage }}</span>
			<button class="next btn_prev" @click="handelNext" :disabled="currentPage >= lastPage">
				<Icon name="arrow_forward" />
			</button>
		</div>
	</Layout>
</template>

<script setup>
import Layout from '@/components/Layout.vue';
import Icon from '@/components/Icon.vue';
import Tit from '@/components/Tit.vue';

import { useUserStore } from '@/stores/user';
import { nextTick, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { API } from '@/api';
import { useSwalDelete } from '@/helper';
import gsap from 'gsap';
import { gsapConfig } from '@/config/gsap';
import { toast } from 'vue3-toastify';

const storeUser = useUserStore();

const router = useRouter();

const loading = ref(true);

// users section

const users = ref([]);

const currentPage = ref(1);

const lastPage = ref(1);

// end users section

const eventWatch = ref(null);

// section gsap --

const disabledBtns = ref(false);

const tl = gsap.timeline({
	defaults: { ...gsapConfig, duration: 1.5 },
});

watch(
	users,
	async () => {
		await nextTick();
		gsap.from('.tr_el_head', {
			opacity: 0,
			duration: 0.2,
			y: 20,
		});

		tl.from('.tr_el_body', {
			stagger: 0.2,
			onStart: () => (disabledBtns.value = true),
			onComplete: () => (disabledBtns.value = false),
		});

		tl.from('.paginate', {
			stagger: 0.2,
		});
	},
	{ once: true }
);

// end section gsap --

const deleteUser = async (id) => {
	const doIt = await useSwalDelete({
		title: 'Delete User',
		text: 'wack mtakd ?',
		cancelText: 'cancel',
		deleteText: 'delete',
	});

	if (!doIt) return;

	try {
		const response = await API.delete(`/api/user/${id}`, {
			...storeUser.configApi,
		});

		if (response.status !== 200) return;

		users.value = users.value.filter((user) => user.id !== id);

		toast.success('Account deleted successfully');

		if (users.value.length === 0) handelPrev();

		eventWatch.value = new Date().getTime();

		//console.log(response)
	} catch (error) {
		console.log(error);
	}
};

const getUsers = async () => {
	try {
		const res = await API.get(`/api/user/users?page=${currentPage.value}`, {
			...storeUser.configApi,
		});

		console.log(res.data);

		const { data, last_page } = res.data;

		users.value = data;
		lastPage.value = last_page;

		loading.value = true;
	} catch (err) {
		router.push({ name: 'home' });
	}
};

watch(
	[currentPage, eventWatch],
	() => {
		getUsers();
		console.log(lastPage.value);
	},
	{ immediate: true }
);

const handelPrev = () => {
	if (currentPage.value <= 1) {
		return;
	}
	currentPage.value--;
};

const handelNext = () => {
	if (currentPage.value >= lastPage.value) {
		return;
	}

	currentPage.value++;
};
</script>

<style lang="scss" scoped>
.box_users {
	min-height: 440px;
}

table {
	width: 100%;
	border-collapse: collapse;
	border-collapse: separate;
	font-size: toRem(16);
	border: none;
	table-layout: auto;
	border-spacing: 0 10px;
	.box_img {
		width: 70px;
	}

	tr {
		background: var(--white);
		clip-path: inset(0 round 4px);
	}
	th,
	td {
		height: 60px;
		padding-inline: 0px;
		font-size: toRem(14);
		color: var(--black);
		border: none;
		text-transform: capitalize;
		text-align: start;
	}
	th {
		height: 0;
		overflow: hidden;
		&.box_name {
			width: auto;
		}
		&.box_action {
			//background: red;
			width: 60px;
			position: relative;
		}
	}
	td {
		&.td_box_img {
			position: relative;
			padding: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			span {
				width: 40px;
				height: 40px;
				background: transparent;
				display: flex;
				clip-path: circle();
				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
		}
		span {
			&.span_name_email {
				//background: blue;
				display: flex;
				flex-direction: column;
				gap: 5px;
				p {
					font-weight: 500;
					display: flex;
					align-items: center;
					gap: 10px;
					font-size: toRem(14);
					line-height: toRem(14);
					b {
						opacity: 0.8;
						&.admin {
							color: #2a9d8f;
						}
					}
				}
				small {
					opacity: 0.5;
					text-transform: lowercase;
					font-size: toRem(12);
					line-height: toRem(12);
				}
			}
		}
		&.td_box_action {
			position: relative;
			button {
				background: var(--white);
				@extend %el_center;
				display: flex;
				width: 26px;
				height: 26px;
				@extend %btn;
				align-items: center;
				justify-content: center;
				border-radius: 4px;
				i {
					font-size: toRem(20);
					color: var(--black);
					opacity: 0.7;
				}
			}
		}
	}
}

.paginate {
	margin-block: 20px;
	display: flex;
	justify-content: start;
	align-items: center;
	gap: 40px;
	button {
		cursor: pointer;
		height: 32px;
		width: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--white);
		border: none;
		color: var(--black);
		border-radius: 4px;
		transform: scale(1);
		transition: all 0.3s ease-in-out;
		&:active {
			transform: scale(0.8);
		}
		&:disabled {
			opacity: 0.2;
			pointer-events: none;
		}
		i {
			font-size: toRem(18);
		}
	}
	span {
		background: transparent;
		display: flex;
		width: 50px;
		align-items: center;
		justify-content: center;
		font-size: toRem(14);
		height: 32px;
		color: var(--black);
		opacity: 0.7;
		user-select: none;
	}
}

@include phone {
	table .box_img {
		width: 60px;
	}
	table td {
		height: 60px;
		padding-inline: 0px;
	}
}
</style>
