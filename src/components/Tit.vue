<template>
    <h1><Icon :name="icon" />{{ text }}</h1>
</template>

<script setup>
defineProps({
    text: {
        type: String,
        default: "hhhhhh",
    },
    icon:{
        type: String,
        default: "home",
    }
});
</script>

<style lang="scss" scoped>
h1 {
    font-size: 20px;
    font-weight: 600;
    color: var(--black);
    margin-block: 20px;
    text-transform: capitalize;
    display: flex;
    align-items: center;
    gap: 5px;
    i {
        opacity: 0.7;
    }
}
</style>
