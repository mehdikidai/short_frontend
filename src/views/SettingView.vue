<template>
	<Layout>
		<Tit :text="$t('pages.setting')" icon="tune" />
		<div class="settings-container">
			<div class="setting-item">
				<label class="tit_setting"> {{ $t('pages.dark_mode') }} </label>
				<div class="container">
					<input type="checkbox" :class="['checkbox', { active: darkBtnIsDark }]" id="checkbox" v-model="isDark" />
					<label class="switch" for="checkbox">
						<span class="slider"></span>
					</label>
				</div>
			</div>

			<div class="setting-item">
				<label class="tit_setting">{{ $t('pages.qr_code_color') }}</label>
				<span class="box_input_color">
					<input type="color" class="qr_color" v-bind:value="`#${color}`" @change="handelColor" />
				</span>
			</div>

			<div class="setting-item">
				<label class="tit_setting"> {{ $t('pages.qr_code_background') }}</label>
				<span class="box_input_color">
					<input type="color" class="qr_color" v-bind:value="`#${bgColor}`" @change="handelBgColor" />
				</span>
			</div>
		</div>
	</Layout>
</template>

<script setup>
import Layout from '@/components/Layout.vue';
import Tit from '@/components/Tit.vue';
import { onMounted, ref } from 'vue';
import { useDark } from '@vueuse/core';
import { useQrcodeStore } from '@/stores/qrcode';
import { storeToRefs } from 'pinia';
import gsap from 'gsap';
import { gsapConfig } from '@/config/gsap';

const darkBtnIsDark = ref(true);

const isDark = useDark({
	onChanged(dark) {
		darkBtnIsDark.value = dark;
	},
});

const store = useQrcodeStore();

const { color, bgColor } = storeToRefs(store);

const handelColor = (el) => {
	store.changeColor(el.target.value.replace('#', ''));
};

const handelBgColor = (el) => {
	store.changeBgColor(el.target.value.replace('#', ''));
};

onMounted(() => {
	gsap.from('.setting-item', { ...gsapConfig, y: 10, ease: 'elastic.out(1,0.5)' });
});
</script>

<style lang="scss" scoped>
@forward './../assets/scss/switch_btn';

.settings-container {
	display: flex;
	flex-direction: column;
	gap: 10px;
	.setting-item {
		background: transparent;
		height: auto;
		//border-top: 1px solid var(--border-color);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		//padding-block: 15px;
		background: var(--white);
		padding-inline: 20px;
		height: 50px;
		border-radius: 4px;
		.box_input_color {
			background: var(--border-color);
			display: flex;
			border-radius: 50%;
			padding: 1px;
			.qr_color {
				width: 24px;
				height: 24px;
				border: none;
				outline: none;
				clip-path: inset(3px round 12px);
				cursor: pointer;
			}
		}
		label {
			color: var(--black);
			font-size: toRem(14);
			opacity: 0.9;
			text-transform: capitalize;
		}
	}
}
</style>
