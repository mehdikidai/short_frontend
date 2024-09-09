<script setup>

import { onMounted } from 'vue';
import i18n from './lang';


onMounted(()=>{

  const lang = localStorage.getItem("lang");
  if (lang) i18n.global.locale = lang
  

})

</script>

<template>

  <RouterView />

</template>

<style scoped>

</style>
