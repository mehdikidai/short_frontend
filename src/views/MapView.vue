<template>
    <Layout>
        <Tit/>
        <div class="box_map"></div>
    </Layout>
</template>

<script setup>
import Layout from "@/components/Layout.vue";
import Tit from "@/components/Tit.vue";
</script>

<style lang="scss" scoped>
.box_map{
    height: 600px;
    background: var(--white);
}
</style>
