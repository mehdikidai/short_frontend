<template>
    <Layout>
        <Tit text="setting" icon="tune" />
        <div class="settings-container">

            
            <div class="setting-item">
                <label class="tit_setting">dark mode</label>
                <div class="container">
                    <input
                        type="checkbox"
                        :class="['checkbox', { checked: isDark }]"
                        id="checkbox"
                        v-model.lazy="isDark"
                    />
                    <label class="switch" for="checkbox">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>

            <div class="setting-item">
                <label class="tit_setting">language</label>
                <SelectBox
                    :options="$i18n.availableLocales"
                    :value="LANG"
                    @selectedValue="handelLang"
                    icon="translate"
                />
            </div>

            <div class="setting-item">
                <label class="tit_setting">qr code color</label>
                <input
                    type="color"
                    class="qr_color"
                    v-bind:value="`#${color}`"
                    @change="handelColor"
                />
            </div>

            <div class="setting-item">
                <label class="tit_setting">qr code background</label>
                <input
                    type="color"
                    class="qr_color"
                    v-bind:value="`#${bgColor}`"
                    @change="handelBgColor"
                />
            </div>
        </div>
    </Layout>
</template>

<script setup>
import Layout from "@/components/Layout.vue";
import Tit from "@/components/Tit.vue";
import SelectBox from "@/components/SelectBox .vue";
import i18n from "@/lang";
import { onMounted, ref } from "vue";
import { useDark } from "@vueuse/core";
import { useQrcodeStore } from "@/stores/qrcode";
import { storeToRefs } from "pinia";
import gsap from "gsap";
import { gsapConfig } from "@/config/gsap";

const isDark = useDark();

const store = useQrcodeStore();

const { color , bgColor } = storeToRefs(store)

const LANG = ref(localStorage.getItem("lang") || "en");

const handelLang = (lang) => {
    i18n.global.locale = lang;
    localStorage.setItem("lang", lang);
};

const handelColor = (el) => {
    store.changeColor(el.target.value.replace('#',''))
};

const handelBgColor = (el) => {
    store.changeBgColor(el.target.value.replace('#',''))
};


onMounted(()=>{
    gsap.from('.setting-item',{...gsapConfig,y:10,ease: "elastic.out(1,0.5)"})
})

</script>

<style lang="scss" scoped>

@import "./../assets/scss/switch_btn";

.settings-container {
    display: flex;
    flex-direction: column;
    .setting-item {
        background: transparent;
        height: auto;
        border-top: 1px solid var(--border-color);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        //padding-block: 15px;
        height: 65px;
        label {
            color: var(--black);
            font-size: toRem(14);
            opacity: 0.9;
            text-transform: capitalize;
        }

        .qr_color {
            width: 26px;
            height: 26px;
            border: none;
            outline: none;
            clip-path: inset(1px round 4px);
            cursor: pointer;
        }

    }
}
</style>
