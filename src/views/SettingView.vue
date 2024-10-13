<template>
    <Layout>
        <Tit text="setting" icon="tune" />
        <div class="settings-container">
            <div class="setting-item">
                <label class="tit_setting">Show declined events</label>
                <div class="container">
                    <input type="checkbox" class="checkbox" id="checkbox" />
                    <label class="switch" for="checkbox">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>

            <div class="setting-item">
                <label class="tit_setting">Locale</label>
                <SelectBox
                    :options="['en', 'fr']"
                    :value="LANG"
                    @selectedValue="handelLang"
                    icon="translate"
                />
            </div>

            <div class="setting-item">
                <label class="tit_setting">Start of week</label>
                <div class="option-group">
                    <button>Sunday</button>
                    <button class="active">Monday</button>
                </div>
            </div>

            <div class="setting-item">
                <label class="tit_setting">Time format</label>
                <div class="option-group">
                    <button class="active">12-hours</button>
                    <button>24-hours</button>
                </div>
            </div>
        </div>
    </Layout>
</template>

<script setup>
import Layout from "@/components/Layout.vue";
import Tit from "@/components/Tit.vue";
import SelectBox from "@/components/SelectBox .vue";

const LANG = ref("en");

const handelLang = (v) => {
    console.log(v);
};
</script>

<style lang="scss" scoped>
@import "./../assets/scss/var";

@import "./../assets/scss/switch_btn";

.settings-container {
    display: flex;
    flex-direction: column;
    .setting-item {
        background: transparent;
        height: auto;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        flex-direction: grid;
        justify-content: space-between;
        gap: 20px;
        padding-block: 15px;
        label {
            color: var(--black);
            font-size: toRem(14);
            opacity: 0.9;
        }
    }
}
</style>
