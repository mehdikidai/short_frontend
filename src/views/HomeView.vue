<script setup>
import Layout from '@/components/Layout.vue';
import { useCounterStore } from '@/stores/counter';
import { storeToRefs } from 'pinia'

const store = useCounterStore()

const { count, doubleCount } = storeToRefs(store)



</script>

<template>
  <Layout>
    <h1>TTTTTTTTTTTTTTTT {{ count }}</h1>
  </Layout>
</template>
