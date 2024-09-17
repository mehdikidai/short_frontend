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
                placeholder="Search Now"
            />

            <button class="cls" v-if="clsForm" @click="textSearch = ''">
                <Icon name="close" />
            </button>
        </div>
        <div class="box_two_result" v-if="showResult">
            <ul>
                <li v-for="el in dataSearch" :key="el.id">
                    <RouterLink :to="{ name: 'home' }">
                        {{ el.title }}
                    </RouterLink>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { watch, computed, ref, onMounted } from "vue";
import { debounce } from "lodash";
import { useAxios } from "@/api";
import { useUserStore } from "@/stores/user";
import { z as zod } from "zod";
import { useMediaQuery } from "@vueuse/core";

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
        const results = await useAxios("/api/search", {
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
        border: 1px solid var(--border-color);
        border-radius: 4px;
        gap: 10px;
        position: relative;
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
                input {
                    border: none;
                    background: transparent;
                    color: var(--black);
                    height: 34px;
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
                            font-size: 20px;
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
                            font-size: 18px;
                            color: var(--black);
                            opacity: 0.7;
                        }
                    }
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
                        font-size: 14px;
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
                            transition: all 0.3s ease;
                            &:hover {
                                opacity: 1;
                            }
                            
                        }
                    }
                }
            }
        }
    }
}
</style>
