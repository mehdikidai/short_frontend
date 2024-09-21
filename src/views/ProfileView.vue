<template>
    <Layout>
        <Tit text="profile" />
        <div class="container">
            <div class="box_photo bx"></div>
            <div class="box_form bx">
                <form method="post" @submit.prevent="submit">
                    <div class="box">
                        <label for="name">full name</label><br />
                        <input
                            type="text"
                            id="name"
                            name="namee"
                            placeholder="full name"
                            v-model="data.name"
                            ref="input_name"
                        />
                    </div>
                    <div class="box">
                        <label for="email">email</label><br />
                        <input
                            type="text"
                            id="email"
                            name="email"
                            placeholder="email"
                            v-model="data.email"
                            ref="input_email"
                        />
                    </div>
                    <div class="box">
                        <button
                            type="button"
                            v-if="loading_form"
                            :disabled="loading_form"
                        >
                            loading ..
                        </button>
                        <button type="submit" v-else>update</button>
                    </div>
                </form>
            </div>
        </div>
    </Layout>
</template>

<script setup>
import Layout from "@/components/Layout.vue";
import Tit from "@/components/Tit.vue";
import { reactive } from "vue";
import { updateSchema } from "@/types";
import { useAxios } from "@/api";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const store = useUserStore();
const router = useRouter();

const loading_form = ref(false);

const data = reactive({
    name: store.name,
    email: store.email,
});

// start submit function

const submit = async () => {
    const { data: DATA, success } = updateSchema.safeParse(data);
    const oldEmail = store.email;
    const oldName = store.name;

    if (success) {
        if (DATA.name !== oldName || DATA.email !== oldEmail) {
            loading_form.value = true;
            try {
                const response = await useAxios.put("/api/user", DATA, {
                    ...store.configApi,
                });

                store.setUser(response.data);

                if (response.data.email !== oldEmail) {
                    router.push({ name: "verifyEmail" });
                }
            } catch (error) {
                console.log(error);
            } finally {
                loading_form.value = false;
            }
        }
    }
};

// end submit function
</script>

<style lang="scss" scoped>
@import "./../assets/scss/var";
.container {
    min-height: 290px;
    //background: red;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
    .bx {
        border-radius: 12px;
        background: var(--white);
        box-shadow: var(--box-shadow);
        border: var(--border);
    }

    .box_photo {
        height: 290px;
        aspect-ratio: 1;
    }
    .box_form {
        // background: green;
        flex: 1 1 550px;

        padding: 40px 20px;
        form {
            //background: red;
            display: flex;
            flex-direction: column;
            gap: 15px;
            @extend %box_form;
        }
    }
}
</style>
