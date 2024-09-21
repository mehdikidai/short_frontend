<template>
    <img
        :src="src"
        :alt="alt"
        :style="{ width: w, height: h }"
        @error="handleErrorImg"
    />
</template>

<script setup>
import Avatar from "@/assets/imgs/avatar.png";
defineProps({
    src: {
        type: String,
        default: "https://avatar.iran.liara.run/public",
    },
    alt: {
        type: String,
        default: "text random",
    },
    w: {
        type: String,
        default: "33px",
    },
    h: {
        type: String,
        default: "33px",
    },
});

const handleErrorImg = (el) => (el.target.src = Avatar);

</script>

<style lang="scss" scoped>
img{
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
