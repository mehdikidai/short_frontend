<template>
    <Layout>
        <h1>  {{ $route.name  }} </h1>
    </Layout>
</template>

<script setup>
import Layout from '@/components/Layout.vue';

</script>

<style>
@media (min-width: 1024px) {
    .about {
        min-height: 100vh;
        display: flex;
        align-items: center;
    }
}
</style>
