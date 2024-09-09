<template>
    <div class="login_div">
        <!-- <button @click="toggleDark()">aaa</button> -->
        <div class="box box_photo">
            
            <span v-if="isLoading">Loading</span>
            <img v-else :src="Bg_login" alt="tt" />
            <div class="box_3"></div>
            
        </div>
        <div class="box box_form">
            <slot />
            <Switch @changeTheme="toggleDark"/>
        </div>
        
        
    </div>
</template>

<script setup>
import { useDark, useToggle } from "@vueuse/core";
import Bg_login from "@/assets/imgs/bg_login.jpg";
import { useImage } from "@vueuse/core";
import Logo from "./Logo.vue";
import Switch from "./Switch.vue";

const isDark = useDark();

const toggleDark = useToggle(isDark);

const { isLoading } = useImage({ src: Bg_login });
</script>

<style lang="scss" scoped>
@import "./../assets/scss/var";
.login_div {
    height: 100vh;
    background: var(--white);
    flex: 1;
    display: flex;
    align-items: stretch;
    position: relative;
    .box {
        background: var(--white);
        flex: 3;
        &_photo {
            flex: 2;
            overflow: hidden;
            position: relative;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
        }
        &_form {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            button.switch{
                position: absolute;
                top: 20px;
                right: 20px;
            }

        }
    }
    
    .box_3{
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        position: absolute;
        inset: 0;
    }
}

@include for-phone-only {
    .box_photo{
        display: none !important;
    }
    
}
</style>
