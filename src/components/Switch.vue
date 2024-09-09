<template>
    <button class="switch" @click="emit('changeTheme')">
        <i data-v-fcebc900="" class="material-symbols-rounded">
            {{ isDark ? "brightness_5" : "brightness_4" }}
        </i>
    </button>
</template>

<script setup>

import { useDark } from "@vueuse/core";

const emit = defineEmits(["changeTheme"]);
const isDark = useDark();

</script>

<style lang="scss" scoped>
/* From Uiverse.io by RaspberryBee */
/* The switch - the box around the slider */
.switch {
    height: 22px;
    width: 22px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: transparent;
    i {
        font-size: 22px;
        color: var(--black);
        opacity: 0.7;
    }
}
</style>
