<template>
    <Layout>
        <div class="box_main" v-if="Urls.length > 0">
            <div class="filter">
                <button
                    :class="['filter-by-date', { asc: sortOrder === 'asc' }]"
                    @click="handelSortOrder"
                >
                    sort by date <Icon name="filter_list" />
                </button>
            </div>
            <div class="list_items">
                <div class="box" v-for="url in Urls" :key="url.id" v-kidai>
                    <div class="link-card-icon-information">
                        <div class="link-card__icon-container">
                            <img
                                :src="
                                    'https://www.google.com/s2/favicons?domain=' +
                                    $getDomain(url.original_url) +
                                    '&sz=64'
                                "
                                alt="favicon"
                            />
                        </div>
                        <div class="link-card__info-container">
                            <RouterLink
                                :to="{ name: 'url', params: { id: url.id } }"
                                ><h3 class="h3">{{ url.title }}</h3></RouterLink
                            >

                            <a
                                :href="url.url_server + '/' + url.code"
                                class="link link_short"
                                target="_blank"
                                >{{ url.domain }}/{{ url.code }}</a
                            >
                            <a href="#" class="link long-url" target="_blank">{{
                                $sliceUrl(url.original_url)
                            }}</a>
                            <span class="date_url">
                                <Icon name="schedule" />
                                {{
                                    $momentFromNow(url.created_at, $i18n.locale)
                                }}</span
                            >
                        </div>
                    </div>
                    <div class="link-card__button-container">
                        <button
                            class="action"
                            @click="$copyText(`${url.url_server}/${url.code}`)"
                        >
                            <Icon name="content_copy" />
                        </button>
                        <button
                            class="action"
                            @click="
                                showQr({
                                    url: `${url.url_server}/${url.code}`,
                                    color: qrcodeStore.color,
                                    bgColor: qrcodeStore.bgColor,
                                })
                            "
                        >
                            <Icon name="qr_code_2" />
                        </button>
                        <button class="action" @click="editUrl(url.id)">
                            <Icon name="edit" />
                        </button>
                        <button class="action" @click="deleteUrl(url.id)">
                            <Icon name="delete" />
                        </button>
                    </div>
                </div>
            </div>
            <div class="box_pagination" v-if="showPagination">
                <button
                    :class="['btn_pagination', { active: p === currentPage }]"
                    @click="handelNavigation(p)"
                    v-for="(p, i) in btnsPag"
                    :key="i"
                >
                    {{ p }}
                </button>
            </div>
        </div>
        <div class="box_main_empty" v-else>
            <h2 v-if="messageEmpty">empty</h2>
            <loadingIcon w="2em" v-else />
        </div>
    </Layout>
</template>

<script setup>
import { useAxios } from "@/api";
import Layout from "@/components/Layout.vue";
import { watch, ref, computed } from "vue";
import { useUserStore } from "@/stores/user";
import { showQr, useSwalDelete } from "@/helper";
import { useRouter } from "vue-router";
import swal from "sweetalert";
import { useQrcodeStore } from "@/stores/qrcode";
import loadingIcon from "../components/loadingIcon.vue";

const store = useUserStore();
const qrcodeStore = useQrcodeStore();

const Urls = ref([]);
const messageEmpty = ref(false);
const sortOrder = ref("desc"); // asc - desc
const currentPage = ref(1);
const lastPage = ref(1);
const effect = ref(0);
const router = useRouter();
const btnsPag = computed(() => {
    const n = currentPage.value;
    const l = lastPage.value;
    const arr = [1, n - 2, n - 1, n, n + 1, n + 2, l];
    return [...new Set(arr)].filter((el) => {
        return el > 0 && el <= lastPage.value;
    });
});

const showPagination = computed(() => lastPage.value != 1);

const handelNavigation = (pageNumber) => {
    currentPage.value = pageNumber;
    window.scroll({ top: 0, behavior: "smooth" });
};

const handelSortOrder = () => {
    //sortOrder.value = sortOrder.value == "desc" ? "asc" : "desc";
    sortOrder.value = sortOrder.value == "desc" ? "asc" : "desc";
    currentPage.value = 1;
};

const deleteUrl = async (id) => {
    const doIt = await useSwalDelete({
        title: "Delete Url",
        text: "wack mtakd ?",
        cancelText: "cancel",
        deleteText: "delete",
    });

    if (!doIt) return;

    try {
        const res = await useAxios.delete(`api/urls/${id}`, {
            ...store.configApi,
        });

        if (res.data.message) effect.value = new Date().getTime();

        if (Urls.value.length === 1) currentPage.value--;
    } catch (error) {
        console.log(error);
    }
};

const editUrl = (id) => router.push({ name: "editLink", params: { id: id } });

watch(
    [currentPage, sortOrder, effect],
    async () => {
        //console.log(currentPage.value);
        try {
            const res = await useAxios.get("/api/urls", {
                ...store.configApi,
                params: {
                    sort_order: sortOrder.value,
                    page: currentPage.value,
                },
            });
            Urls.value = res.data.data;
            lastPage.value = res.data.last_page;

            messageEmpty.value = res.data.data.length === 0;

            console.log(res.data.data);
        } catch (error) {
            console.log(error);
        }
    },
    { immediate: true }
);
</script>

<style lang="scss" scoped>
@import "./../assets/scss/var";
.box_main {
    //background: red;
    min-height: 100px;
    &_empty {
        flex: 1;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        max-height: 400px;
        svg {
            color: var(--black);
        }
        h2 {
            color: var(--black);
            opacity: 0.7;
            text-transform: capitalize;
        }
    }
    .filter {
        height: 36px;
        //background: blue;
        //margin-top: 20px;
        &-by-date {
            height: 36px;
            padding-inline: 15px;
            float: right;
            cursor: pointer;
            border: none;
            border-radius: 6px;
            display: flex;
            align-items: center;
            gap: 4px;
            border: var(--border);
            background: var(--white);
            color: var(--black);
            i {
                font-size: 16px;
                transition: all 0.3s ease-in-out;
            }
            &.asc {
                i {
                    transform: rotate(180deg);
                }
            }
        }
    }
    .list_items {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
        gap: 20px;
        margin-block: 20px 20px;
        min-height: 360px;
        .box {
            height: 170px;
            background: var(--white);
            border-radius: 12px;
            box-shadow: var(--box-shadow);
            display: flex;
            flex-direction: row;
            gap: 20px;
            padding: 20px;
            border: var(--border);
            .link-card-icon-information {
                flex: 1;
                //background: blue;
                height: 100%;
                display: flex;
                flex-direction: row;
                gap: 20px;
                .link-card__icon-container {
                    width: 22px;
                    height: 22px;
                    background: transparent;
                    transform: translateY(5px);
                    //clip-path: circle();
                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
                .link-card__info-container {
                    flex: 1;
                    //background: green;
                    overflow: hidden;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    .h3 {
                        font-size: 18px;
                        color: var(--black);
                        font-weight: 500;
                        line-height: 30px;
                        text-transform: capitalize;
                    }
                    a.link {
                        // display: block;
                        //overflow: hidden;
                        //text-overflow: ellipsis;
                        //white-space: nowrap;
                        overflow: hidden;
                        display: -webkit-box;
                        -webkit-line-clamp: 1; /* number of lines to show */
                        line-clamp: 1;
                        -webkit-box-orient: vertical;
                        &.long-url {
                            color: var(--black);
                            font-size: 14px;
                            opacity: 0.7;
                        }
                        &.link_short {
                            color: var(--main);
                        }
                    }
                    span.date_url {
                        font-size: 12px;
                        color: var(--black);
                        opacity: 0.5;
                        margin-top: auto;
                        display: flex;
                        align-items: center;
                        flex-direction: row;
                        gap: 8px;
                        i {
                            font-size: 16px;
                        }
                    }
                }
            }
            .link-card__button-container {
                //background: rgb(9, 255, 0);
                height: 26px;
                display: flex;
                gap: 8px;
                button.action {
                    width: 24px;
                    height: 24px;
                    border: none;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    border: var(--border);
                    transition: all 0.1s ease-in-out;
                    &:active {
                        box-shadow: 0 1px 2pxrgba (0, 0, 0, 0.4) 0;
                        transform: translateY(3px);
                        i {
                            opacity: 1;
                        }
                    }
                    i {
                        font-size: 16px;
                        color: var(--black);
                        opacity: 0.7;
                    }
                }
            }
        }
    }
    .box_pagination {
        display: flex;
        flex-direction: row;
        gap: 10px;
        .btn_pagination {
            width: 40px;
            height: 40px;
            background: var(--white);
            border-radius: 4px;
            border: none;
            cursor: pointer;
            color: var(--black);
            font-size: 12px;
            border: var(--border);
            &.active {
                background: var(--main);
                color: #fff;
            }
        }
    }
}

@include for-phone-only {
    .box_main .list_items {
        grid-template-columns: 1fr;
        .box {
            height: 200px;
            display: flex;
            flex-direction: column;
            padding: 20px 15px;
            .link-card-icon-information
                .link-card__info-container
                a.link.link_short {
                font-size: 14px;
            }
        }
        .link-card__button-container {
            height: 26px;
            display: flex;
            justify-content: flex-end;
            gap: 8px;
        }
    }
}
</style>
