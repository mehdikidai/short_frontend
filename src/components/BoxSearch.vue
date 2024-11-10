<template>
    <div class="box_search" v-if="isLargeScreen">
        <div class="box_one">
            <button class="btn_search">
                <Icon name="search" />
            </button>
            <input
                type="text"
                v-model="textSearch"
                name="search"
                :placeholder="$t('pages.search_now')"
                ref="inputSearch"
            />

            <button class="cls" v-if="clsForm" @click="textSearch = ''">
                <Icon name="close" />
            </button>
            <span v-else class="ctrl_k"> ctrl+k </span>
        </div>
        <div class="box_two_result" v-if="showResult">
            <ul>
                <li v-for="el in dataSearch" :key="el.id">
                    <RouterLink :to="{ name: 'url', params: { id: el.id } }">
                        <img
                            :src="
                                'https://www.google.com/s2/favicons?domain=' +
                                $getDomain(el.original_url) +
                                '&sz=16'
                            "
                            alt="icon"
                        />
                        {{ el.title }}
                    </RouterLink>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { watch, computed, ref, onMounted, watchEffect } from "vue";
import { debounce } from "lodash";
import { API } from "@/api";
import { useUserStore } from "@/stores/user";
import { z as zod } from "zod";
import { useMediaQuery } from "@vueuse/core";

import { useMagicKeys, whenever } from "@vueuse/core";

const inputSearch = ref(null);

const { ctrl_k } = useMagicKeys({
    passive: false,
    onEventFired(e) {
        if (e.ctrlKey && e.key === "k" && e.type === "keydown")
            e.preventDefault();
    },
});

whenever(ctrl_k, () => inputSearch.value?.focus());

// const keys = useMagicKeys();
// const shiftCtrlA = keys["Shift+K"];

// watch(shiftCtrlA, (v) => {
//     if (v) {

//         inputSearch.value?.focus();

//     }
// });

const isLargeScreen = useMediaQuery("(min-width: 1200px)");

const querySchema = zod.string().min(3).max(20);

const storeUser = useUserStore();

const textSearch = ref("");

const dataSearch = ref([]);

const showResult = computed(() => dataSearch.value.length > 0);
const clsForm = computed(() => textSearch.value.length > 0);

const performSearch = debounce(async (query) => {
    const { success: goToServer } = querySchema.safeParse(query);

    //console.log(goToServer)

    if (!goToServer) {
        dataSearch.value = [];
        return;
    }

    try {
        const results = await API("/api/search", {
            params: { query },
            ...storeUser.configApi,
        });

        console.log(results);

        dataSearch.value = results.data;
    } catch (error) {
        console.log(error);
    }
}, 400);

watch(textSearch, (newText) => {
    performSearch(newText);
});
</script>

<style lang="scss" scoped>
@import "./../assets/scss/_var";
.box_search {
    height: 36px;
    width: 0px;
    display: none !important;
}
@include for-desktop-up {
    .box_search {
        height: 36px;
        width: 440px;
        display: flex !important;
        flex-direction: column;
        background: var(--white);
        border: var(--border);
        border-radius: 4px;
        gap: 10px;
        position: relative;
        padding: 2px;
        .box {
            &_one {
                display: flex;
                height: 100%;
                width: 100%;
                //background: red;
                flex-direction: row-reverse;
                align-items: center;
                display: grid;
                grid-template-columns: 32px 1fr;
                position: relative;
                gap: 5px;
                input {
                    border: none;
                    background: transparent;
                    color: var(--black);
                    height: 32px;
                    padding-right: 4px;
                }
                button {
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    &.btn_search {
                        height: 32px;
                        background: transparent;
                        pointer-events: none;
                        i {
                            color: var(--black);
                            font-size: 1.25rem;
                            opacity: 0.7;
                        }
                    }
                    &.cls {
                        background: transparent;
                        position: absolute;
                        right: 6px;
                        width: 20px;
                        height: 20px;
                        top: 50%;
                        transform: translateY(-50%);
                        border-radius: 50%;
                        i {
                            font-size: 1.125rem;
                            color: var(--black);
                            opacity: 0.7;
                        }
                    }
                }
                span.ctrl_k {
                    position: absolute;
                    right: 6px;
                    width: auto;
                    height: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 12px;
                    padding-inline: 10px;
                    text-transform: uppercase;
                    opacity: 0.5;
                    pointer-events: none;
                }
            }
            &_two_result {
                height: auto;
                background: var(--white);
                width: 100%;
                border: 1px solid var(--border-color);
                border-radius: 4px;
                box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.07);
                transition: all 0.3s ease-in-out;

                ul {
                    li {
                        list-style: none;
                        font-size: 0.875rem;
                        &:not(:last-child) {
                            border-bottom: 1px solid var(--border-color);
                        }
                        a {
                            display: block;
                            width: 100%;
                            height: 100%;
                            padding: 8px 12px;
                            color: var(--black);
                            opacity: 0.8;
                            display: flex;
                            transition: all 0.3s ease;
                            line-height: 0.875rem;
                            gap: 8px;
                            &:hover {
                                opacity: 1;
                            }
                            img {
                                width: 0.875rem;
                                height: 0.875rem;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
