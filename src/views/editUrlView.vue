<template>
    <Layout>
        <h1><Icon name="edit"/>{{ $t("pages.create_new") }}</h1>

        <div class="box_create" v-if="loading">
            <form action="#" method="post" @submit.prevent="submit()">
                <div class="box">
                    <label for="title">Title</label><br />
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="title"
                        v-model="data.title"
                        ref="input_Title"
                    />
                    <span>{{ msgErrorTitle }}</span>
                </div>

                <div class="box">
                    <label for="url">{{ $t("pages.destination") }}</label
                    ><br />
                    <input
                        type="text"
                        id="url"
                        name="url"
                        placeholder="https://example.com/my-long-url"
                        v-model="data.original_url"
                        ref="input_url"
                    />

                    <span>{{ msgErrorUrl }}</span>
                </div>
                <div class="box">
                    <label for="code">Code</label><br />
                    <input
                        type="text"
                        id="code"
                        name="code"
                        placeholder="code"
                        v-model="data.code"
                        ref="input_Code"
                    />
                    <span>{{ msgErrorCode }}</span>
                </div>
                <div class="box">
                    <button type="submit" :disabled="lodingSubmit">
                        {{
                            lodingSubmit
                                ? "loading ..."
                                : $t("pages.create_new")
                        }}
                    </button>
                </div>
            </form>
        </div>
    </Layout>
</template>

<script setup>
import Layout from "@/components/Layout.vue";
import Title from "@/components/Title.vue";
import { onMounted, reactive, ref, watch } from "vue";
import { z } from "zod";
import { useFocus } from "@vueuse/core";
import { useAxios } from "@/api";
import { useUserStore } from "@/stores/user";
import swal from "sweetalert";
import router from "@/router";
import { useRoute } from "vue-router";
import { zodId } from "@/types";

const route = useRoute();

const msgErrorUrl = ref("");
const msgErrorTitle = ref("");
const msgErrorCode = ref("");

const store = useUserStore();

const input_url = ref();
const input_Title = ref();
const input_Code = ref();
const loading = ref(false);

const lodingSubmit = ref(false);

const { focused: f_url } = useFocus(input_url);
const { focused: f_tit } = useFocus(input_Title);
const { focused: f_cod } = useFocus(input_Code);

const data = reactive({
    original_url: "",
    title: "",
    code: "",
});

watch(f_url, (focused) => {
    if (focused) msgErrorUrl.value = "";
});

watch(f_cod, (focused) => {
    if (focused) msgErrorCode.value = "";
});

watch(f_tit, (focused) => {
    if (focused) msgErrorTitle.value = "";
});

onMounted(async () => {
    const { id } = route.params;
    const resultId = zodId.safeParse(id).success;

    if (!resultId) {
        router.push({ name: "home" });
    } else {
        try {
            const res = await useAxios(`api/urls/${id}`, {
                ...store.configApi,
            });
            data.original_url = res.data?.original_url;
            data.title = res.data?.title;
            data.code = res.data?.code;

            loading.value = true

        } catch (error) {
            router.push({ name: "home" });
            console.log(error);
        }

        
    }
});

const submit = async () => {
    const schemaData = z.object({
        original_url: z.string().url(),
        title: z.string().regex(/^[A-Za-z][\w\s]{1,20}[A-Za-z]$/),
        code: z.string().regex(/^[A-Za-z0-9]{3,8}$/),
    });

    const result = schemaData.safeParse(data);

    if (!result.success) {
        console.log(result.success);
        result.error.errors.forEach((issue) => {
            switch (issue.path.join(".")) {
                case "original_url":
                    msgErrorUrl.value = issue.message;
                    break;
                case "title":
                    msgErrorTitle.value = issue.message;
                    break;
                case "code":
                    msgErrorCode.value = issue.message;
                    break;
            }
        });
    } else {
        console.log(result.success);

        //lodingSubmit.value = true;
        const { id } = route.params;

        try {
            const res = await useAxios.put(`/api/urls/${id}`, data, {
                ...store.configApi,
            });
            setTimeout(() => {
                lodingSubmit.value = false;
                swal({
                    title: "Are you sure?",
                    text: "Once deleted, you will not be able to recover this imaginary file!",
                    buttons: {
                        cancel: {
                            text: "Cancel",
                            value: null,
                            className: "",
                            visible: true,
                        },
                        confirm: {
                            text: "OK",
                            value: true,
                            className: "",
                        },
                    },
                    dangerMode: true,
                }).then((go) => {
                    if (go) {
                        router.back();
                    } else {
                        data.original_url = "";
                        data.title = "";
                    }
                });
            }, 300);

            console.log(res);
        } catch (error) {
            lodingSubmit.value = false;
            console.log(error);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./../assets/scss/create_url_view";
</style>
