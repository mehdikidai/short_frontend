<template>
    <img class="logo_img" :src="logoImg" alt="logo" />
</template>

<script setup>
import logoImg from "@/assets/imgs/logo.png";
</script>

<style lang="scss" scoped>
img.logo_img {
    height: 32px;
}
</style>
