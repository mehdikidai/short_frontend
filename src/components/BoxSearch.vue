<template>
    <div class="box_search">
        <div class="box_one">
            <input
                type="text"
                v-model="textSearch"
                name="search"
                placeholder="search"
            />
            <button>
                <Icon />
            </button>
        </div>
    </div>
</template>

<script setup>
import { watch } from "vue";

const textSearch = ref("");
const data = ref([])

watch(textSearch, (oldText, newText) => {

    console.log(newText);
    
});



</script>

<style lang="scss" scoped>
@import "./../assets/scss/_var";
.box_search {
    height: 36px;
    width: 300px;
    background: #1a1d1f;
    display: none !important;
}
@include for-desktop-up {
    .header .box_search {
        height: 36px;
        width: 300px;
        display: flex !important;
        background: transparent;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        .box_one {
            display: flex;
            height: 100%;
            width: 100%;
            //background: red;
            flex-direction: row-reverse;
            align-items: center;
            padding-inline: 4px;
            input {
                flex: 1;
                padding-inline: 6px;
                border: none;
                background: transparent;
                color: var(--black);
            }
            button {
                width: 30px;
                aspect-ratio: 1;
                background: transparent;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                i {
                    color: var(--black);
                    font-size: 20px;
                    opacity: 0.7;
                }
            }
        }
    }
}
</style>
