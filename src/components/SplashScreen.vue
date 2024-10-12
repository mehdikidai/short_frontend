<template>
    <transition name="fade">
        <div class="splash-screen" v-if="isVisible">
            <l-zoomies
                size="80"
                stroke="5"
                bg-opacity="0.1"
                speed="1.4"
                :color="colorIcon"
            ></l-zoomies>
        </div>
    </transition>
</template>

<script setup>

import { computed, onMounted, ref } from "vue";
import { zoomies } from "ldrs";
import { useDark } from "@vueuse/core";

zoomies.register();

const isDark = useDark();

const colorIcon = computed(() => (isDark.value ? "#f9f9f9" : "#111315"));

const isVisible = ref(true);

const checkIfLoaded = () => {
    setTimeout(() => {
        isVisible.value = false;
    }, 5000);
};

onMounted(() => {
    checkIfLoaded();
});
</script>

<style>
.splash-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--white);
    z-index: 9999;
    flex-direction: column;
    gap: 20px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
