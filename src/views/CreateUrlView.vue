<template>
	<Layout>
		<Tit :text="$t('pages.create_new')" icon="link" />
		<div class="box_create">
			<form action="#" method="post" @submit.prevent="submit()">
				<div class="box">
					<label for="title">{{ $t('pages.title') }}</label>
					<input type="text" id="title" name="title" placeholder="title" v-model="data.title" ref="input_Title" />
					<span v-if="msgErrorTitle">{{ msgErrorTitle }}</span>
				</div>
				<div class="box">
					<label for="url">{{ $t('pages.destination') }}</label>
					<input
						type="text"
						id="url"
						name="url"
						placeholder="https://example.com/my-long-url"
						v-model="data.original_url"
						ref="input_url"
					/>
					<span v-if="msgErrorUrl">{{ msgErrorUrl }}</span>
				</div>
				<div class="box">
					<button type="submit" :disabled="lodingSubmit">
						{{ lodingSubmit ? 'loading ...' : $t('pages.create_new') }}
					</button>
				</div>
			</form>
		</div>
	</Layout>
</template>

<script setup>
import Layout from '@/components/Layout.vue';
import Tit from '@/components/Tit.vue';
import { onMounted, reactive, ref, watch } from 'vue';
import { z } from 'zod';
import { useFocus } from '@vueuse/core';
import { API } from '@/api';
import { useUserStore } from '@/stores/user';
import wait from 'mk_wait';
import { toast } from 'vue3-toastify';
import gsap from 'gsap';
import { useRouter } from 'vue-router';

const msgErrorUrl = ref('');
const msgErrorTitle = ref('');
const store = useUserStore();
const input_url = ref();
const input_Title = ref();

const router = useRouter();

const lodingSubmit = ref(false);

const { focused: f_url } = useFocus(input_url);
const { focused: f_tit } = useFocus(input_Title);

watch(f_url, (focused) => {
	if (focused) msgErrorUrl.value = '';
});

watch(f_tit, (focused) => {
	if (focused) msgErrorTitle.value = '';
});

const data = reactive({
	original_url: '',
	title: '',
});

const submit = async () => {
	const schemaData = z.object({
		original_url: z.string().url(),
		title: z.string().regex(/^[A-Za-z][\w\s]{1,20}[A-Za-z]$/),
	});

	const result = schemaData.safeParse(data);

	if (!result.success) {
		result.error.errors.forEach((issue) => {
			switch (issue.path.join('.')) {
				case 'original_url':
					msgErrorUrl.value = issue.message;
					break;
				case 'title':
					msgErrorTitle.value = issue.message;
					break;
			}
		});
	} else {
		//console.log(result.success);

		lodingSubmit.value = true;

		try {
			const res = await API.post('/api/urls', data, {
				...store.configApi,
			});

			data.original_url = '';
			data.title = '';
			await wait(500);
			lodingSubmit.value = false;
			toast.success('created link successful.', {
				async onClose() {
					await wait(200);
					router.push({ name: 'links' });
				},
			});
			console.log(res);
		} catch (error) {
			lodingSubmit.value = false;
			toast.error(error.response.data.message)
			
		}
	}
};

onMounted(() => {
	const gt = gsap.timeline({});

	gt.from('.box_create', { y: -10, delay: 0.01, opacity: 0 });
});
</script>

<style lang="scss" scoped>
@forward './../assets/scss/create_url_view';
</style>
