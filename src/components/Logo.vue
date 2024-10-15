<template>
    <img v-if="isDark" class="logo_img" :src="logoImgWhite" alt="logo" />
    <img v-else class="logo_img" :src="logoImgBlack" alt="logo" />
</template>

<script setup>

import logoImgBlack from "@/assets/imgs/logos/logo_black.png";
import logoImgWhite from "@/assets/imgs/logos/logo_white.png";
import { useDark } from "@vueuse/core";

const isDark = useDark()


</script>

<style lang="scss" scoped>
img.logo_img {
    height: toRem(22);
    opacity: 0.8;
}
</style>
