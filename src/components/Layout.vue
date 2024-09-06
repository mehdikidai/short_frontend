<template>
    <div class="sidebar">
        <div class="logo">
            <Logo />
        </div>
        <ul>
            <li>
                <i class="material-symbols-rounded">home</i>

                <RouterLink to="/">Home</RouterLink>
            </li>
            <li>
                <i class="material-symbols-rounded">link</i
                ><RouterLink to="/about">Links</RouterLink>
            </li>
            <li>
                <i class="material-symbols-rounded">monitoring</i
                ><RouterLink to="/login">Analytics</RouterLink>
            </li>
        </ul>
        <div class="line"></div>
        <ul>
            <li>
                <i class="material-symbols-rounded">person</i
                ><RouterLink to="/login">Login</RouterLink>
            </li>
            <li>
                <i class="material-symbols-rounded">tune</i
                ><RouterLink to="/login">Settings</RouterLink>
            </li>
        </ul>
    </div>

    <div class="main-content">
        <div class="header">
            <div class="title">
                <h1>{{ $route.name }}</h1>
                <span>12th Oct 2024</span>
            </div>
            <div class="box_profile">
                <button :class="[{dark:isDark},'btn_theme']" @click="toggleDark()">
                    <i class="material-symbols-rounded"> {{ isDark ? 'brightness_5' : 'brightness_4' }} </i>
                </button>
                <RouterLink to="/">
                    <div class="profile_photo">
                        <img
                            class="img_user"
                            src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                            alt=""
                        />
                        <div class="name_user">
                            <div>Jese Leos</div>
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
import { RouterLink, RouterView } from "vue-router";
import Logo from "./Logo.vue";
import { ref,watch } from "vue";

import { useDark, useToggle } from '@vueuse/core'



const isDark = useDark()

const toggleDark = useToggle(isDark)



// watch(checked,(newValue)=>{
//     console.log(newValue)
//     toggleDark()
// })



</script>

<style lang="scss" scoped>
@import "../assets/scss/switch";
.sidebar {
    width: 210px;
    background-color: #fafafa;
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
    margin-block: 40px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.sidebar ul li {
    height: 36px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding-inline: 10px;
    border-radius: 4px;
    transition: all 0.1s ease-in;
    &:hover {
        background: var(--main);
    }

    &:hover i,
    &:hover a {
        color: #fff;
    }

    i {
        color: var(--black);
        font-size: 20px;
        transition: all 0.1s ease-in;
    }
}

.sidebar ul li a {
    color: var(--black);
    text-decoration: none;
    flex: 1;
    transition: all 0.1s ease-in;
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
    height: 100px;
    position: sticky;
    display: flex;
    align-items: center;
    justify-content: space-between;
    top: 0;
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
            font-size: 14px;
            opacity: 0.5;
        }
    }
    .box_profile {
        height: 40px;
        min-width: 100px;
        //background: red;
        display: flex;
        align-items: center;
        gap: 40px;
        .profile_photo {
            display: flex;
            gap: 10px;
            img {
                width: 40px;
                height: 40px;
                clip-path: circle();
            }
            .name_user {
                display: flex;
                align-items: center;
                justify-content: start;
                color: var(--black);
                div {
                    text-transform: capitalize;
                }
            }
        }

        button.btn_theme{
            background: transparent;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            
            i{
                font-size: 24px;
                color: var(--black);
                transition: all .3s ease-in-out;
            }
            
        }
    }
}

.content {
    main {
        //background: red;
        padding: 20px;
        min-height: calc(100vh - 100px);
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
</style>
