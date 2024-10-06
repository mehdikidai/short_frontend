<template>
    <i class="material-symbols-rounded">{{ name }}</i>
</template>

<script setup lang="ts">
defineProps({
    name: {
        type: String,
        default: "home",
    },
    color: {
        type: String,
        default: "#fff",
    },
});
</script>

<style scoped lang="scss">
i {
    color: v-bind(color);
}
</style>
