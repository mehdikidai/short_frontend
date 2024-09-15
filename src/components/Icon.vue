<template>
    <i class="material-symbols-rounded">{{ name }}</i>
</template>

<script setup lang="ts">
defineProps({
    name: {
        type: String,
        default: "home",
    },
});
</script>

