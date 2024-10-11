<template>
    <transition name="fade">
        <div class="splash-screen" v-if="isVisible">
            <h1>مرحباً بك في تطبيقي</h1>
        </div>
    </transition>
</template>

<script setup>
import { onMounted, ref } from "vue";

const isVisible = ref(true);

const checkIfLoaded = () => {
    setTimeout(() => {
        isVisible.value = false;
    }, 3000); // إخفاء الشاشة بعد 3 ثوانٍ
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
