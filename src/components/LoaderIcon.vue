<template>
    <Icon name="progress_activity"/> 
</template>

<script setup></script>

<style lang="scss" scoped>
i {
    font-size: 16px;
    animation: rotation 1s linear infinite ;
}

@keyframes rotation {
    0% {
       transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
