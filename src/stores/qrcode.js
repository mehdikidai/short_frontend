import { ref } from "vue";
import { defineStore } from "pinia";

export const useQrcodeStore = defineStore("qrcode", () => {
    

    const color = ref(localStorage.getItem("color_qr") ?? "222222");

    const bgColor = ref(localStorage.getItem("bg_color_qr") ?? "ffffff");


    const changeColor = (co) => {
        color.value = co;
        localStorage.setItem("color_qr", co);
    };

    const changeBgColor = (co) => {
        bgColor.value = co;
        localStorage.setItem("bg_color_qr", co);
    };

    return { color, bgColor, changeColor, changeBgColor };

});
