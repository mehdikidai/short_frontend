<template>
    <transition name="fade">
        <div class="splash-screen" v-if="isVisible">
            <h1 id="welcome">ziplink</h1>
            <Loading class="bx_loading" :color="colorIcon"/>
        </div>
    </transition>
</template>

<script setup>

import { computed, onMounted, ref } from "vue";
import { useDark } from "@vueuse/core";
import SplitType from "split-type";
import gsap from "gsap";
import Loading from "./Loading.vue";



const isDark = useDark()

const colorIcon = computed(() => (isDark.value ? "#f9f9f9" : "#111315"));


const isVisible = ref(true);

const checkIfLoaded = () => {
    setTimeout(() => {
        isVisible.value = false;
    }, 5000);
};

onMounted(() => {
    
    const text = new SplitType("#welcome");

    var tl = gsap.timeline({ defaults: { opacity: 0 } });

    tl.from(text.chars, {
        duration: 0.6,
        ease: "back.out(1.7)",
        y: -50,
        stagger: 0.1,
        rotateY: 180,
        filter: "blur(10px)",
        delay: 0.5,
        scale: 5,
    }).from(".bx_loading", {
        y: 0,
        filter: "blur(10px)",
        ease: "back.out(1.7)",
        scale:0
    });

    checkIfLoaded();
});
</script>

<style lang="scss" scoped>
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
    gap: 30px;
    h1 {
        font-size: 1.6rem;
        color: var(--black);
        text-transform: uppercase;
        //background: red;
        line-height: 1.6rem;
        letter-spacing: 0.25em;
    }
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
