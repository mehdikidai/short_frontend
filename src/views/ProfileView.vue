<template>
	<Layout>
		<Tit :text="$t('pages.profile')" icon="person" />

		<div class="container">
			<div class="box_photo bx bx_1">
				<button class="edit" @click="INPUT_IMG.click()" :disabled="loading_upload_img">
					<Icon name="edit" />
				</button>
				<div :class="['photo_div', { loading: loading_upload_img }]">
					<loadingIcon w="2em" v-if="loading_upload_img" />
					<UserPicture v-memo="store.photo" :src="store.photo" w="120px" h="120px" />
				</div>
				<h2>@{{ store.name.replace(' ', '_') }}</h2>
				<span>{{ store.email }}</span>
				<form action="" method="post">
					<input type="file" name="photo_user" id="photo_user" @change="uploadImg" ref="INPUT_IMG" />
				</form>
			</div>

			<!-- update profile -->

			<div class="box_form bx bx_2">
				<form method="post" @submit.prevent="submit_profile">
					<div class="box">
						<label for="name"> {{ $t('pages.full_name') }} </label>
						<input
							type="text"
							id="name"
							name="namee"
							:placeholder="$t('pages.full_name')"
							v-model="data.name"
							ref="input_name"
						/>
					</div>
					<div class="box">
						<label for="email"> {{ $t('pages.email') }} </label>
						<input
							type="text"
							id="email"
							name="email"
							:placeholder="$t('pages.email')"
							v-model="data.email"
							ref="input_email"
						/>
					</div>

					<div class="box">
						<button type="submit" v-if="loading_form" :disabled="loading_form">
							<loadingIcon w="1em" v-if="loading_form" />
						</button>
						<button type="submit" v-else> {{ $t('pages.update_profile') }} </button>
					</div>
				</form>
			</div>

			<!-- update profile -->

			<!-- update password -->

			<div class="change_password box_form bx bx_3">
				<form method="post" @submit.prevent="submitPassword">
					<div class="box">
						<label for="current password"> {{ $t('pages.current_password') }} </label>
						<div class="box_see">
							<input
								:type="visiblePassword ? 'password' : 'text'"
								:placeholder="$t('pages.current_password')"
								v-model="dataPassword.currentPassword"
							/>
							<button class="show_password" @click="toggleVisiblePass" type="button">
								<Icon :name="visiblePassword ? 'visibility_off' : 'visibility'" />
							</button>
						</div>
					</div>
					<div class="box">
						<label for="new password"> {{ $t('pages.new_assword') }} </label>
						<div class="box_see">
							<input
								:type="visiblePassword ? 'password' : 'text'"
								:placeholder="$t('pages.new_assword')"
								v-model="dataPassword.newPassword"
							/>
							<button class="show_password" @click="toggleVisiblePass" type="button">
								<Icon :name="visiblePassword ? 'visibility_off' : 'visibility'" />
							</button>
						</div>
					</div>

					<div class="box">
						<button type="submit" v-if="loading_formPassword" :disabled="loading_formPassword">
							<loadingIcon w="1em" v-if="loading_formPassword" />
						</button>
						<button type="submit" v-else>{{ $t('pages.change_password') }}</button>
					</div>
				</form>
			</div>

			<!-- end div update password -->
			<h3 class="h3_text_delete_account bx_4">
				{{ $t('pages.delete_account') }} :
				<div class="text_delete_account" @click="deleteProfile"> {{ $t('pages.delete_your_account') }} </div>
			</h3>
		</div>
	</Layout>
</template>

<script setup>
import Layout from '@/components/Layout.vue';
import loadingIcon from '../components/loadingIcon.vue';
import Tit from '@/components/Tit.vue';
import UserPicture from '@/components/UserPicture.vue';
import { onMounted, reactive, ref } from 'vue';
import { updateSchema, updatePasswordSchema, zodPassword } from '@/types';
import { API } from '@/api';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import wait from 'mk_wait';
import { toast } from 'vue3-toastify';
import gsap from 'gsap';
import { gsapConfig } from '@/config/gsap';
import swal from 'sweetalert';
import { tr } from '@/helper';

const store = useUserStore();
const router = useRouter();
const loading_form = ref(false);
const loading_upload_img = ref(false);
const INPUT_IMG = ref(null);

const data = reactive({
	name: store.name,
	email: store.email,
});

// START uploadImg FUNCTION

const uploadImg = async (el) => {
	const file = el.target.files[0];
	if (file) {
		loading_upload_img.value = true;
		const imgURL = URL.createObjectURL(file);
		store.setPhoto(imgURL);
		const formData = new FormData();
		formData.append('photo', file);

		try {
			const response = await API.post('/api/upload_photo_profile', formData, {
				...store.configApi,
			});
			console.log(response);
			toast.success('upload successful image.');
		} catch (error) {
			console.log(error);
			toast.success('Error uploading image.');
		} finally {
			loading_upload_img.value = false;
		}
	}
};

// END uploadImg FUNCTION

// start submit function

const submit_profile = async () => {
	const { data: DATA, success } = updateSchema.safeParse(data);
	const oldEmail = store.email;
	const oldName = store.name;

	if (success) {
		if (DATA.name !== oldName || DATA.email !== oldEmail) {
			loading_form.value = true;
			try {
				const response = await API.put('/api/user', DATA, {
					...store.configApi,
				});

				store.setUser(response.data);

				toast.success('Profile updated.');

				if (response.data.email !== oldEmail) {
					router.push({ name: 'verifyEmail' });
				}
			} catch (error) {
				console.log(error);
				toast.error('Profile not updated.');
			} finally {
				loading_form.value = false;
			}
		}
	}
};

// end submit function

// update password

const dataPassword = reactive({
	currentPassword: '',
	newPassword: '',
});

const loading_formPassword = ref(false);

const submitPassword = async () => {
	const { data: dataPass, success } = updatePasswordSchema.safeParse(dataPassword);

	if (!success || dataPass?.currentPassword === dataPass?.newPassword) return;

	loading_formPassword.value = true;

	try {
		const response = await API.put('/api/user/upadete-password', dataPass, {
			...store.configApi,
		});
		if (response.status === 201) {
			toast.success('password updated');
			dataPassword.newPassword = '';
			dataPassword.currentPassword = '';
		} else {
			toast.error('password not updated');
		}
	} catch (error) {
		console.log(error.message);
		toast.error('password not updated');
	} finally {
		await wait(1000);
		loading_formPassword.value = false;
	}
};

// update password

// delete profile -----------

const deleteAccount = async (password) => {
	const response = await API.delete('/api/user/account', {
		...store.configApi,
		data: { password },
	});

	return response;
};


const deleteProfile = () => {
	swal({
		text: tr('pages.please_enter_your_password_to_confirm'),
		content: {
			element: 'input',
			attributes: {
				type: 'password',
				placeholder: tr('pages.password'),
			},
		},
		button: {
			text: tr('pages.delete_account'),
			className: 'swal-button--danger',
			closeModal: true,
		},
	}).then(async (pass) => {

		if(!pass) return

		if (!zodPassword.safeParse(pass).success) {
			toast.error('Password verified error');
			return;
		}

		try {

			const response = await deleteAccount(pass);
      
			if (response.status === 200) {
				toast.success('account deleted.', {
					onClose() {
						store.resetUser();
						router.push({ name: 'login' });
					},
				});
			}
			console.log(response);
		} catch (error) {

			console.log(error.message);

			if (error.response && error.response.status === 403) {

				toast.error('Access denied!');

			} else {
				toast.error('account not deleted.');
			}
		} 
	});
};

// delete profile -----------

// gsap --------------

let tl = gsap.timeline({ ...gsapConfig, delay: 0, duration: 0.1, stagger: 0.06 });

onMounted(() => {
	tl.from('.bx_1', { y: -20, opacity: 0, rotateX: 5 });
	tl.from('.bx_2', { y: -20, opacity: 0, rotateX: 5 });
	tl.from('.bx_3', { y: -20, opacity: 0, rotateX: 5 });
	tl.from('.bx_4', { y: -20, opacity: 0, rotateX: 5 });
});

// gsap --------------

// visible password -----

const visiblePassword = ref(true);

const toggleVisiblePass = () => (visiblePassword.value = !visiblePassword.value);

// visible password -----
</script>

<style lang="scss" scoped>
.container {
	min-height: 280px;
	//background: red;
	display: flex;
	flex-wrap: wrap;
	gap: 20px;
	margin-bottom: 20px;
	.bx {
		border-radius: 12px;
		background: var(--white);
		box-shadow: var(--box-shadow);
		border: var(--border);
	}

	.box_photo {
		height: 280px;
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		position: relative;
		button.edit {
			position: absolute;
			right: 10px;
			top: 10px;
			width: 26px;
			height: 26px;
			border: none;
			border-radius: 6px;
			background: rgba(255, 255, 255, 0.05);
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			i {
				color: var(--black);
				font-size: 16px;
				opacity: 0.7;
			}
		}
		.photo_div {
			background: transparent;
			margin-bottom: 15px;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			position: relative;
			width: 120px;
			height: 120px;
			svg {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				z-index: 3;
				color: rgb(255, 255, 255);
			}
			img {
				clip-path: circle();
				pointer-events: none;
			}
			&.loading {
				img {
					opacity: 0.5;
				}
			}
		}

		h2 {
			font-size: toRem(16);
			color: var(--black);
			opacity: 0.9;
			font-weight: 600;
		}
		span {
			font-size: 12px;
			color: var(--black);
			opacity: 0.6;
		}
		input[type='file'] {
			display: none;
		}
	}
	.box_form {
		// background: green;
		flex: 1 1 550px;
		padding: 40px 20px;
		
		form {
			//background: red;
			display: flex;
			flex-direction: column;
			gap: 12px;
			.box {
				flex: 0.5;
			}
			@extend %box_form;
		}
		.box_see {
			position: relative;
			button.show_password {
				position: absolute;
				right: 10px;
				top: 50%;
				width: 20px;
				height: 20px;
				transform: translateY(-50%) scale(1);
				border: none;
				background: transparent;
				cursor: pointer;
				display: flex;
				align-items: center;
				justify-content: center;
				transition: all 0.3s ease-in-out;
				i {
					font-size: 16px;
					color: var(--black);
					opacity: 0.5;
				}
				&:active {
					transform: translateY(-50%) scale(0);
				}
			}
		}
	}

	.change_password {
		//height: 100px;
		background: var(--white);
		width: 100%;
		//flex: 1 1 800px;
	}

	.h3_text_delete_account {
		color: var(--black);
		opacity: 0.9;
		flex: 1 1 100%;
		font-size: toRem(14);
		font-weight: 500;
		user-select: none;
		.text_delete_account {
			display: inline;
			color: var(--red);
			cursor: pointer;
		}
	}
}

@include phone {
	.container .box_photo {
		height: 220px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		position: relative;
		.photo_div {
			img {
				width: 100px !important;
				height: 100px !important;
			}
		}
	}
}
</style>
