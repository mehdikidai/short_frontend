import { ref } from "vue";
import { defineStore } from "pinia";

export const useQrcodeStore = defineStore("qrcode", () => {
    const color = ref("222");
    const bgColor = ref("fff");

    //const doubleCount = computed(() => count.value * 2)

    const changeColor = (co) => {
        color.value = co;
    };

    return { color, bgColor, changeColor };
});
