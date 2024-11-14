<template>
    <h1 class="tit_h1"><Icon :name="icon" />{{ text }}</h1>
</template>

<script setup>
defineProps({
    text: {
        type: String,
        default: "hhhhhh",
    },
    icon: {
        type: String,
        default: "home",
    },
});
</script>

<style lang="scss" scoped>

h1.tit_h1 {
    font-size: toRem(18);
    line-height: toRem(18);
    font-weight: 600;
    color: var(--black);
    margin-block: 0 20px;
    text-transform: capitalize;
    display: flex;
    align-items: center;
    gap: 6px;
    i {
        opacity: 0.7;
        font-size: toRem(22);
        color: var(--black);
    }
}

</style>
