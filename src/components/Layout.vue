<template>
    <div :class="['sidebar', { showsidebar: showMenu }]">
        <div class="cls" @click="handelMenu(true)"></div>
        <div class="logo">
            <RouterLink to="/"> <Logo /></RouterLink>
        </div>
        <ul>
            <li>
                <RouterLink to="/">
                    <Icon name="home" />
                    {{ $t("pages.home") }}
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/links">
                    <Icon name="link" />
                    {{ $t("pages.links") }}
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/login">
                    <Icon name="person" />
                    {{ $t("pages.profile") }}
                </RouterLink>
            </li>
            <li class="add_s_url">
                <RouterLink :to="{ name: 'createLink' }">
                    <Icon name="add" />
                    {{ $t("pages.Create_link") }}
                </RouterLink>
            </li>
        </ul>
        <div class="line"></div>
        <ul>
            <li>
                <RouterLink to="/login">
                    <i class="material-symbols-rounded">tune</i>
                    {{ $t("pages.setting") }}</RouterLink
                >
            </li>
        </ul>
        <button class="logout" @click="logout">{{ $t("pages.logout") }}</button>
    </div>

    <div class="main-content">
        <div class="header" ref="target">
            <button class="btn_menu" @click="handelMenu()">
                <i class="material-symbols-rounded"> menu </i>
            </button>
            <div class="title">
                <h1>{{ $route.name }}</h1>
                <span>{{ today }}</span>
            </div>
            <div class="box_profile">
                <button class="btn_theme" @click="handelShowLang()">
                    <Icon name="translate" />
                    <ul class="ul_lang" v-if="showLangList">
                        <li
                            v-for="locale in $i18n.availableLocales"
                            :key="`locale-${locale}`"
                        >
                            <button class="lang" @click="handelLang(locale)">
                                <i
                                    :class="[
                                        'material-symbols-rounded',
                                        { active: locale === $i18n.locale },
                                    ]"
                                >
                                    radio_button_checked
                                </i>
                                {{ locale }}
                            </button>
                        </li>
                    </ul>
                </button>
                <button
                    :class="[{ dark: isDark }, 'btn_theme']"
                    @click="toggleDark()"
                >
                    <Icon :name="isDark ? 'brightness_5' : 'brightness_4'" />
                </button>
                <RouterLink to="/">
                    <div class="profile_photo">
                        <img
                            class="img_user"
                            src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                            alt=""
                        />
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
</template>

<script setup>
import { onClickOutside } from "@vueuse/core";
import { useDark, useToggle } from "@vueuse/core";
import i18n from "@/lang";
import moment from "moment";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { useAxios } from "@/api";
import { Logout } from "@/auth";

const isDark = useDark();
const store = useUserStore();
const { name, email } = storeToRefs(store);
const showMenu = ref(false);
const router = useRouter();
const today = ref(moment().format("LL"));
const toggleDark = useToggle(isDark);
const handelMenu = (ok = false) => {
    if (ok) {
        showMenu.value = false;
    } else {
        showMenu.value = !showMenu.value;
    }
};

const showLangList = ref(false);

onClickOutside(showLangList, (event) => {
    if (event.target.className !== "lang") showLangList.value = false;
});

const handelShowLang = () => {
    showLangList.value = !showLangList.value;
};

const handelLang = (lang) => {
    i18n.global.locale = lang;
    localStorage.setItem("lang", lang);
};

const logout = () => {
    Logout(store.configApi, () => {
        store.resetUser();
        router.push({ name: "login" });
    });
};

onMounted(async () => {
    try {
        const res = await useAxios.get("/api/user", { ...store.configApi });
        store.setUser(res.data);
    } catch (err) {
        console.log(err.message);
        store.resetUser();
        router.push({ name: "login" });
    }
});
</script>

<style lang="scss" scoped>
@import "./../assets/scss/_var";

.sidebar {
    width: 210px;
    //background-color: #fafafa;
    background-color: var(--white);
    height: 100vh;
    position: sticky;
    top: 0;
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
    height: 100px;
    //background: red;
    display: flex;
    align-items: center;
    padding-inline: 20px;
}

.sidebar ul {
    list-style-type: none;
    padding-inline: 10px;
    margin-block: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.sidebar ul li {
    height: 36px;
    padding-inline: 10px;
    border-radius: 4px;
    transition: all 0.1s ease-in;
    font-size: 14px;
    &:hover {
        background: var(--main);
    }

    &:hover i,
    &:hover a {
        color: #fff;
    }

    &.add_s_url {
        background: var(--main);
        //margin-bottom: 10px;
        i,
        a {
            color: var(--white-fix);
        }
    }

    i {
        color: var(--black);
        font-size: 20px;
        transition: all 0.1s ease-in;
    }
    a {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 100%;
    }
}

.sidebar {
    .logout {
        background: transparent;
        position: absolute;
        bottom: 20px;
        left: 20px;
        width: calc(100% - 40px);
        right: 20px;
        cursor: pointer;
        border: 1px solid var(--black);
        height: 36px;
        font-size: 14px;
        text-transform: capitalize;
        color: var(--black);
        border-radius: 4px;
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
            font-size: 20px;
            font-weight: 600;
            text-transform: capitalize;
        }
        span {
            font-size: 12px;
            opacity: 0.5;
        }
    }
    .box_profile {
        height: 40px;
        min-width: 100px;
        //background: red;
        display: flex;
        align-items: center;
        gap: 20px;
        .profile_photo {
            display: flex;
            gap: 12px;
            align-items: center;
            img {
                width: 36px;
                height: 36px;
                clip-path: circle();
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
                    span {
                        font-size: 12px;
                        opacity: 0.5;
                        text-transform: lowercase;
                    }
                }
            }
        }

        button.btn_theme {
            background: transparent;
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
                font-size: 22px;
                color: var(--black);
                transition: all 0.3s ease-in-out;
            }
            ul.ul_lang {
                background: var(--white_2);
                position: absolute;
                top: 40px;
                left: 0;
                width: 100px;
                display: flex;
                flex-direction: column;
                //gap: 10px;
                padding: 12px 6px;
                border-radius: 6px;
                box-shadow: var(--box-shadow);
                li {
                    list-style: none;
                    //background: blue;
                    button.lang {
                        width: 100%;
                        cursor: pointer;
                        border: none;
                        height: 33px;
                        text-align: start;
                        padding-inline: 10px;
                        background: transparent;
                        color: var(--black);
                        text-transform: capitalize;
                        font-size: 14px;
                        border-radius: 4px;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        &:hover {
                            background: var(--white);
                        }
                        i {
                            font-size: 14px;
                            opacity: 0.2;
                            &.active {
                                opacity: 0.8;
                            }
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

@media (max-width: 600px) {
    .header .btn_menu {
        display: flex;
    }
    .sidebar {
        position: fixed;
        width: 240px;
        left: -100vw;
        top: 0;
        z-index: 1000;
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
                background: rgba(0, 0, 0, 0.3);
                transform: translateX(100%);
            }
        }
    }
    .header .box_profile {
        gap: 20px;
    }
    .header .title {
        display: none;
    }
}
</style>
