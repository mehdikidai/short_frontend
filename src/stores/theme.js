import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {

  const isDark = ref(true)

  //const doubleCount = computed(() => count.value * 2)
  

  return { isDark }
})
