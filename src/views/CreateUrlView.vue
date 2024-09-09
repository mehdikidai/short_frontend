<template>
    <Layout>
        <div class="box_create">
            <h1>{{ $t('pages.create_new') }}</h1>
            <form action="#" method="post" @submit.prevent="submit()">
                <div class="box">
                    <label for="url">{{ $t('pages.destination') }}</label><br />
                    <input
                        type="text"
                        id="url"
                        name="url"
                        placeholder="https://example.com/my-long-url"
                        v-model="data.url"
                        ref="input_url"
                    />
                    <span>{{ msgErrorUrl }}</span>
                </div>
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
                    <button type="submit">add url</button>
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

const msgErrorUrl = ref("");
const msgErrorTitle = ref("");

const input_url = ref();
const input_Title = ref();

const { focused:f_url } = useFocus(input_url);
const { focused:f_tit } = useFocus(input_Title);

watch(f_url, (focused) => {
    if (focused) msgErrorUrl.value = ''
});

watch(f_tit, (focused) => {
    if (focused) msgErrorTitle.value = ''
});


const data = reactive({
    url: "",
    title: "",
});

const submit = () => {
    const schemaData = z.object({
        url: z.string().url(),
        title: z.string().min(2).max(20),
    });

    const result = schemaData.safeParse(data);

    if (!result.success) {
        result.error.errors.forEach((issue) => {
            switch (issue.path.join(".")) {
                case "url":
                    msgErrorUrl.value = issue.message;
                    break;
                case "title":
                    msgErrorTitle.value = issue.message;
                    break;
            }
        });
    } else {
        console.log(result.success);
    }
};
</script>

<style lang="scss" scoped>
.box_create {
    background: var(--white);
    padding: 40px 20px;
    border-radius: 12px;
    box-shadow: var(--box-shadow);
    h1 {
        font-size: 22px;
        font-weight: 600;
        color: var(--black);
        margin-bottom: 30px;
        text-transform: capitalize;
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        .box {
            //background: blue;
            display: flex;
            flex-direction: column;
            gap: 4px;
            &:last-child {
                margin-top: 20px;
            }
            input {
                width: 100%;
                //max-width: 700px;
                height: 36px;
                border: 1px solid var(--border-color);
                background: transparent;
                color: var(--black);
                padding-inline: 20px;
                border-radius: 2px;
            }
            button {
                width: 100%;
                max-width: 300px;
                height: 36px;
                cursor: pointer;
                border: none;
                background: var(--main);
                color: var(--white-fix);
                font-size: 14px;
                text-transform: capitalize;
                border-radius: 2px;
            }
            label {
                color: var(--black);
                opacity: 0.8;
                font-size: 14px;
            }
            span {
                font-size: 12px;
                color: rgb(255, 69, 69);
            }
        }
    }
}
</style>
