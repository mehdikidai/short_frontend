<template>
	<div :class="['sidebar', { showsidebar: showMenu }]">
		<div class="cls" @click="handelMenu(true)"></div>
		<div class="logo">
			<RouterLink :to="{ name: 'home' }"> <Logo class="logo_gsap" /></RouterLink>
		</div>
		<ul class="ul_one">
			<li>
				<RouterLink :to="{ name: 'home' }" class="li_el">
					<Icon name="home" />
					{{ $t('pages.home') }}
				</RouterLink>
			</li>
			<li>
				<RouterLink :to="{ name: 'links' }" class="li_el">
					<Icon name="link" />
					{{ $t('pages.links') }}
				</RouterLink>
			</li>
			<li>
				<RouterLink :to="{ name: 'profile' }" class="li_el">
					<Icon name="person" />
					{{ $t('pages.profile') }}
				</RouterLink>
			</li>
			<li>
				<RouterLink :to="{ name: 'map' }" class="li_el">
					<Icon name="map" />
					{{ $t('pages.map') }}
				</RouterLink>
			</li>
			<li v-if="store.isAdmin">
				<RouterLink :to="{ name: 'users' }" class="li_el">
					<Icon name="group" />
					{{ 'users' }}
				</RouterLink>
			</li>
			<li>
				<RouterLink :to="{ name: 'Trash' }" class="li_el">
					<Icon name="delete" />
					{{ $t('pages.trash') }}
				</RouterLink>
			</li>
			<li>
				<RouterLink :to="{ name: 'createLink' }" class="li_el">
					<Icon name="add" />
					{{ $t('pages.Create_link') }}
				</RouterLink>
			</li>
			
		</ul>
		<div class="line"></div>
		<ul class="ul_two">
			<li>
				<RouterLink :to="{ name: 'setting' }">
					<Icon name="tune" />
					{{ $t('pages.setting') }}</RouterLink
				>
			</li>
		</ul>
		<ul class="ul_logout logout">
			<li>
				<a @click.prevent="logout">
					<Icon name="logout" />
					{{ $t('pages.logout') }}</a
				>
			</li>
		</ul>
		<!-- <button class="logout" @click="logout">{{ $t("pages.logout") }}</button> -->
	</div>

	<div class="main-content">
		<div class="header" ref="target">
			<button class="btn_menu" @click="handelMenu()">
				<Icon name="menu" />
			</button>
			<div class="title">
				<h1>
					<span>dashboard</span>
				</h1>
				<span class="title_today">{{ today }}</span>
			</div>
			<BoxSearch />
			<div class="box_profile">
				<button class="btn_theme" @click="handelShowLang()">
					<Icon name="translate" />
					<ul class="ul_lang" v-if="showLangList">
						<li v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`">
							<button :class="['lang', { active: locale === $i18n.locale }]" @click="handelLang(locale)" :disabled="locale === $i18n.locale">
								<i>
									<IconX :icon="getFlag(locale)" />
								</i>
								{{ locale }}
							</button>
						</li>
					</ul>
				</button>
				<button :class="[{ dark: isDark }, 'btn_theme']" @click="toggleDark()">
					<Icon :name="isDark ? 'brightness_5' : 'brightness_4'" />
				</button>
				<RouterLink :to="{ name: 'home' }">
					<div class="profile_photo">
						<img v-memo="photo" class="img_user" :src="photo" alt="" />
						<div class="name_user">
							<div>
								{{ name }}
								<span>{{ email }}</span>
							</div>
						</div>
					</div>
				</RouterLink>
			</div>
		</div>

		<div class="content">
			<main>
				<slot></slot>
			</main>
		</div>
	</div>
	<BtnNewLink />
</template>

<script setup>
import { onClickOutside } from '@vueuse/core';
import { useDark, useToggle } from '@vueuse/core';
import i18n from '@/lang';
import moment from 'moment';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { Logout } from '@/auth';
import BoxSearch from './BoxSearch.vue';
import { Icon as IconX } from '@iconify/vue';
import { getFlag } from '@/helper';
import BtnNewLink from './BtnNewLink.vue';
import {  ref } from 'vue';


//--------------------

const isDark = useDark();
const store = useUserStore();
const { name, email, photo } = storeToRefs(store);
const showMenu = ref(false);
const router = useRouter();
const today = ref(moment().format('LL'));

const toggleDark = useToggle(isDark);

const handelMenu = (ok = false) => {
	if (ok) {
		showMenu.value = false;
	} else {
		showMenu.value = !showMenu.value;
	}
};

const showLangList = ref(false);


//---------------------------

onClickOutside(showLangList, (event) => {
	if (event.target.className !== 'lang') showLangList.value = false;
});

const handelShowLang = () => {
	showLangList.value = !showLangList.value;
};

const handelLang = (lang) => {
	i18n.global.locale = lang;
	localStorage.setItem('lang', lang);
};

const logout = () => {
	Logout(store.configApi, () => {
		store.resetUser();
		router.push({ name: 'login' });
	});
};
</script>

<style lang="scss" scoped>
@import './../assets/scss/_var';

.sidebar {
	width: 230px;
	min-width: 230px;
	background-color: var(--white);
	height: 100vh;
	position: sticky;
	top: 0;
	border-right: var(--border);
	transition: all 0.3s ease-in;
	/*&:hover{
        width: 160px;
    }*/
	.line {
		height: 1px;
		background: var(--black);
		width: 50%;
		margin-left: 20px;
		opacity: 0.2;
		margin-block: 20px;
	}
}

.sidebar .logo {
	height: 90px;
	//background: red;
	display: flex;
	align-items: center;
	padding-inline: 20px;
	a {
		display: flex;
	}
}

.sidebar ul {
	list-style-type: none;
	padding-inline: 10px;
	//margin-block: 10px;
	display: flex;
	flex-direction: column;
	//gap: 10px;
	&.ul_logout {
		margin-top: auto;
	}
}

.sidebar ul li {
	height: 46px;
	transition: all 0.1s ease-in;
	font-weight: 400;

	i {
		color: var(--black);
		font-size: toRem(20);
		transition: all 0.1s ease-in;
	}
	a {
		display: flex;
		align-items: center;
		gap: 8px;
		height: 100%;
		padding-inline: 10px;
		border-radius: 0;
		cursor: pointer;
		font-size: toRem(16);
    background: transparent;
    border-radius: 6px;
		transition: all 0.6s ease-in-out;
		&.router-link-exact-active {
      background: var(--white_3);
		}
	}
}

.sidebar {
	.logout {
		background: transparent;
		position: absolute;
		bottom: 20px;
		left: 0;
		//width: calc(100% - 40px);
		right: 0;
		margin-block: 0;
	}
}

.sidebar ul li a {
	color: var(--black);
	text-decoration: none;
	flex: 1;
	transition: all 0.1s ease-in;
	text-transform: capitalize;
}

.main-content {
	flex-grow: 1;
	padding: 0;
	background-color: var(--gray);
}

.header {
	background-color: var(--gray);
	color: var(--black);
	padding: 20px;
	height: 90px;
	position: sticky;
	display: flex;
	align-items: center;
	justify-content: space-between;
	top: 0;
	z-index: 100;

	.title {
		height: 50px;
		min-width: 100px;
		//background: red;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		h1 {
			font-size: 1.125rem;
			font-weight: 600;
			text-transform: capitalize;
			display: flex;
			align-items: center;
			gap: 5px;
			i {
				font-size: 1.125rem;
				transform: rotate(-20deg);
			}
		}
		span {
			&.title_today {
				font-size: 0.75rem;
				opacity: 0.5;
			}
		}
	}
	.box_profile {
		height: 40px;
		min-width: 100px;
		//background: red;
		display: flex;
		align-items: center;
		gap: 10px;
		.profile_photo {
			display: flex;
			gap: 12px;
			align-items: center;
			img {
				width: 32px;
				height: 32px;
				clip-path: circle();
        object-fit: cover;
			}
			.name_user {
				display: flex;
				align-items: center;
				justify-content: start;
				color: var(--black);
				div {
					text-transform: capitalize;
					display: flex;
					flex-direction: column;
					font-size: 0.875rem;
					span {
						font-size: 0.75rem;
						opacity: 0.5;
						text-transform: lowercase;
					}
				}
			}
		}

		button.btn_theme {
			background: var(--white);
			border: none;
			width: 33px;
			height: 33px;
			border-radius: 50%;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			//background: var(--white);

			i {
				font-size: toRem(18);
				color: var(--black);
				transition: all 0.3s ease-in-out;
			}
			ul.ul_lang {
				background: var(--white_2);
				position: absolute;
				top: 40px;
				left: 0;
				width: 80px;
				display: flex;
				flex-direction: column;
				//gap: 10px;
				//padding: 6px;
				//border-radius: 6px;
				box-shadow: 0px 0px 8px rgb(0, 0, 0, 0.3);
				border-radius: 6px;
				overflow: hidden;
				opacity: 1;
				transform: scale(1);
				transform-origin: 20% 0;
				transition: all 0.3s linear;
				@starting-style {
					opacity: 0;
					transform: scale(0);
				}

				li {
					list-style: none;
					//background: blue;
					button.lang {
						width: 100%;
						cursor: pointer;
						border: none;
						height: 30px;
						text-align: start;
						padding-inline: 10px;
						background: transparent;
						color: var(--black);
						text-transform: capitalize;
						font-size: 14px;
						//border-radius: 4px;
						display: flex;
						align-items: center;
						gap: 6px;
						&:hover,
						&.active {
							background: var(--white_3);
						}
            &:disabled{
              filter: grayscale(100%);
              cursor:auto;
            }
						i {
							font-size: 12px;
							display: flex;
							align-items: center;
							justify-content: center;
						}
					}
				}
			}
		}
	}
	.btn_menu {
		background: transparent;
		border: none;
		display: none;
		align-items: center;
		justify-content: center;
		i {
			color: var(--black);
		}
	}
}

.content {
	main {
		//background: red;
		padding: 20px;
		min-height: calc(100vh - 90px);
		position: relative;
		display: flex;
		flex-direction: column;
	}
}

.card {
	background-color: white;
	padding: 20px;
	border-radius: 5px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	flex: 1;
	text-align: center;
}

.card h3 {
	margin-top: 0;
}

.card p {
	color: #7f8c8d;
}

@include phone {
	$height_nav: 70px;

	.header {
		background: var(--white);
		height: $height_nav;
		padding: 15px;
	}
	.header .btn_menu {
		display: flex;
	}
	.sidebar {
		position: fixed;
		width: 240px;
		left: -100vw;
		top: 0;
		z-index: 1000;
		box-shadow: 3px 0 10px rgba(0, 0, 0, 0.2);
		transition: all 0.6s ease-in-out;
		div.cls {
			position: absolute;
			top: 0;
			right: 0;
			width: calc(100vw - 240px);
			height: 100vh;
			background: rgba(0, 0, 0, 0);
			z-index: -4;
			transform: translateX(0);
			transition: all 0.3s ease-in-out;
		}

		&.showsidebar {
			left: 0;
			div.cls {
				background: rgba(0, 0, 0, 0);
				transform: translateX(100%);
			}
		}
	}
	.header .box_profile {
		gap: 15px;
	}
	.header .title {
		display: none;
	}

	.header .box_profile .profile_photo .name_user {
		display: none;
	}

	.header .box_profile button.btn_theme {
		width: 30px;
		height: 30px;
	}

	.header .box_profile .profile_photo img {
		width: 30px;
		height: 30px;
	}

	.header .box_profile {
		height: 30px;
		gap: 8px;
	}

	.content {
		main {
			//background: red;
			padding: 20px 15px 40px;
			min-height: calc(100vh - $height_nav);
		}
	}
}
</style>
