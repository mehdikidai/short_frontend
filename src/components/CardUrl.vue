<template>
	<div class="box">
		<div class="link-card-icon-information">
			<div class="link-card__icon-container">
				<img
					:src="'https://www.google.com/s2/favicons?domain=' + $getDomain(url.original_url) + '&sz=64'"
					alt="favicon"
				/>
			</div>
			<div class="link-card__info-container">
				<RouterLink :to="{ name: 'url', params: { id: url.id } }"
					><h3 class="h3">{{ $sliceUrl(url.title, 16) }}</h3></RouterLink
				>

				<a :href="url.url_server + '/' + url.code" class="link link_short" target="_blank"
					>{{ url.domain }}/{{ url.code }}</a
				>
				<a href="#" class="link long-url" target="_blank">{{ $sliceUrl(url.original_url,30) }}</a>
				<span class="date_url">
					<Icon name="schedule" />
					{{ $momentFromNow(url.created_at, $i18n.locale) }}</span
				>
			</div>
		</div>
		<div class="link-card__button-container">
			<button
				class="action hint--top hint--rounded hint--no-arrow hint--small"
				@click="$copyText(`${url.url_server}/${url.code}`)"
				:aria-label="$t('pages.copy')"
			>
				<Icon name="content_copy" />
			</button>
			<button
				class="action hint--top hint--rounded hint--no-arrow hint--small"
				:aria-label="$t('pages.qr_code')"
				@click="
					showQr({
						url: `${url.url_server}/${url.code}`,
						color: qrcodeStore.color,
						bgColor: qrcodeStore.bgColor,
					})
				"
			>
				<Icon name="qr_code_2" />
			</button>
			<button class="action hint--top hint--rounded hint--no-arrow hint--small" @click="editUrl(url.id)" :aria-label="$t('pages.edit')">
				<Icon name="edit" />
			</button>
			<button class="action hint--top hint--rounded hint--no-arrow hint--small" @click="deleteurl(url.id)" v-if="showBtnDelete" :aria-label="$t('pages.delete')">
				<Icon name="delete" />
			</button>

			<button class="action hint--top hint--rounded hint--no-arrow hint--small" @click="handleShow(url.id)" :aria-label="url.visible ? $t('pages.hide_url') : $t('pages.show_url')">
				<Icon :name="url.visible ? 'visibility' : 'visibility_off'" />
			</button>
		</div>
	</div>
</template>

<script setup>
import { useQrcodeStore } from '@/stores/qrcode';
import { useRouter } from 'vue-router';
import { showQr } from '@/helper';

const qrcodeStore = useQrcodeStore();
const router = useRouter();

const emit = defineEmits(['deleteUrl', 'handleVisibility']);

defineProps({
	url: {
		type: Object,
		required: true,
	},
	showBtnDelete: {
		type: Boolean,
		default: true,
	},
});

const deleteurl = (id) => emit('deleteUrl', id);

const editUrl = (id) => router.push({ name: 'editLink', params: { id: id } });

const handleShow = (id) => emit('handleVisibility', id);

</script>

<style lang="scss" scoped>


.box {
	height: 160px;
	background: var(--white);
	border-radius: 12px;
	box-shadow: var(--box-shadow);
	display: flex;
	flex-direction: row;
	gap: 20px;
	padding: 20px;
	border: var(--border);
	.link-card-icon-information {
		flex: 1;
		//background: blue;
		height: 100%;
		display: flex;
		flex-direction: row;
		gap: 20px;
		.link-card__icon-container {
			width: toRem(24);
			height: toRem(24);
			background: transparent;
			//transform: translateY(5px);

			clip-path: inset(0 round 4px);
			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				pointer-events: none;
			}
		}
		.link-card__info-container {
			flex: 1;
			//background: green;
			overflow: hidden;
			height: 100%;
			display: flex;
			flex-direction: column;
			gap: 5px;
			.h3 {
				font-size: toRem(18);
				color: var(--black);
				font-weight: 500;
				line-height: 30px;
				text-transform: capitalize;
				line-height: 24px;
			}
			a.link {
				overflow: hidden;
				
				&.long-url {
					color: var(--black);
					font-size: toRem(14);
					opacity: 0.7;
				}
				&.link_short {
					color: var(--main);
					font-size: toRem(14);
					font-weight: 500;
				}
			}
			span.date_url {
				font-size: 12px;
				color: var(--black);
				opacity: 0.5;
				margin-top: auto;
				display: flex;
				align-items: center;
				flex-direction: row;
				gap: 8px;
				i {
					font-size: 16px;
				}
			}
		}
	}
	.link-card__button-container {
		//background: rgb(9, 255, 0);
		height: 24px;
		display: flex;
		gap: 8px;
		background: transparent;
		button.action {
			width: 24px;
			height: 24px;
			border: none;
			background: rgba(255, 255, 255, 0.05);
			border-radius: 4px;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			border: var(--border);
			transition: all 0.1s ease-in-out;
			&:active {
				box-shadow: 0 1px 2pxrgba (0, 0, 0, 0.4) 0;
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

@include phone {
	.box {
		height: 190px;
		display: flex;
		flex-direction: column;
		padding: 20px 15px;
		.link-card-icon-information {
			gap: 15px;
			.link-card__info-container {
				.h3 {
					line-height: toRem(24);
				}
				a.link.link_short {
					font-size: 14px;
				}
			}
		}
	}
	.box .link-card__button-container {
		height: 24px;
		display: flex;
		gap: 8px;
		background: transparent;
		justify-content: end;
	}
}
</style>
