<template>
    <Layout>
        <h1><Icon name="link"/>{{ $t("pages.create_new") }}</h1>
        <div class="box_create" v-kidai>
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
import { reactive, ref, watch } from "vue";
import { z } from "zod";
import { useFocus } from "@vueuse/core";
import { useAxios } from "@/api";
import { useUserStore } from "@/stores/user";
import swal from "sweetalert";
import router from "@/router";

const msgErrorUrl = ref("");
const msgErrorTitle = ref("");
const store = useUserStore();
const input_url = ref();
const input_Title = ref();

const lodingSubmit = ref(false);

const { focused: f_url } = useFocus(input_url);
const { focused: f_tit } = useFocus(input_Title);

watch(f_url, (focused) => {
    if (focused) msgErrorUrl.value = "";
});

watch(f_tit, (focused) => {
    if (focused) msgErrorTitle.value = "";
});

const data = reactive({
    original_url: "",
    title: "",
});

const submit = async () => {
    const schemaData = z.object({
        original_url: z.string().url(),
        title: z.string().regex(/^[A-Za-z][\w\s]{1,20}[A-Za-z]$/),
    });

    const result = schemaData.safeParse(data);

    if (!result.success) {
        result.error.errors.forEach((issue) => {
            switch (issue.path.join(".")) {
                case "original_url":
                    msgErrorUrl.value = issue.message;
                    break;
                case "title":
                    msgErrorTitle.value = issue.message;
                    break;
            }
        });
    } else {
        //console.log(result.success);

        lodingSubmit.value = true;

        try {
            const res = await useAxios.post("/api/urls", data, {
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
                        router.push({ name: "links" });
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
