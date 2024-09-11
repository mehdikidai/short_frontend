<template>
    <i class="material-symbols-rounded">{{ name }}</i>
</template>

<script setup>
const props = defineProps({
    name: {
        type: String,
        default: "home",
    },
});
</script>
