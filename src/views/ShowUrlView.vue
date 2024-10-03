<script setup>
import Layout from "@/components/Layout.vue";
import { onMounted } from "vue";
import { useRoute,useRouter } from "vue-router";

const rotate = useRoute();
const rotater = useRouter()

const { id } = rotate.params;

onMounted(() => {
    console.log(id);
});
</script>
<template>
    <Layout>
        <button @click="rotater.back()">back</button>
        <h1>page show url {{ id }}</h1>
    </Layout>
</template>

<style lang="scss" scoped></style>
