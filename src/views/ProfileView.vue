<template>
    <Layout>
        <Tit text="profile" />
        <div class="container">
            <div class="box_photo bx" v-kidai>
                <button
                    class="edit"
                    @click="INPUT_IMG.click()"
                    :disabled="loading_upload_img"
                >
                    <Icon name="edit" />
                </button>
                <div :class="['photo_div', { loading: loading_upload_img }]">
                    <loadingIcon w="2em" v-if="loading_upload_img" />
                    <UserPicture
                        v-memo="store.photo"
                        :src="store.photo"
                        w="120px"
                        h="120px"
                    />
                </div>
                <h2>@{{ store.name.replace(" ", "_") }}</h2>
                <span>{{ store.email }}</span>
                <form action="" method="post">
                    <input
                        type="file"
                        name="photo_user"
                        id="photo_user"
                        @change="uploadImg"
                        ref="INPUT_IMG"
                    />
                </form>
            </div>
            <div class="box_form bx" v-kidai>
                <form method="post" @submit.prevent="submit">
                    <div class="box" v-ef>
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
                            <loadingIcon w="1em" v-if="loading_form" />
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
import loadingIcon from "../components/loadingIcon.vue";
import Tit from "@/components/Tit.vue";
import UserPicture from "@/components/UserPicture.vue";
import { reactive } from "vue";
import { updateSchema } from "@/types";
import { useAxios } from "@/api";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const store = useUserStore();
const router = useRouter();

const loading_form = ref(false);
const loading_upload_img = ref(false);
const INPUT_IMG = ref(null);

const data = reactive({
    name: store.name,
    email: store.email,
});



// START uploadImg FUNCTION

const uploadImg = async (el) => {
    const file = el.target.files[0];
    if (file) {
        loading_upload_img.value = true;
        const imgURL = URL.createObjectURL(file);
        store.setPhoto(imgURL);
        const formData = new FormData();
        formData.append("photo", file);

        try {
            const response = await useAxios.post(
                "/api/upload_photo_profile",
                formData,
                {
                    ...store.configApi,
                }
            );
            console.log(response);
        } catch (error) {
            console.log(error);
        } finally {
            loading_upload_img.value = false;
        }
    }
};

// END uploadImg FUNCTION

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
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        position: relative;
        button.edit {
            position: absolute;
            right: 10px;
            top: 10px;
            width: 26px;
            height: 26px;
            border: none;
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.05);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            i {
                color: var(--black);
                font-size: 16px;
                opacity: 0.7;
            }
        }
        .photo_div {
            background: transparent;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            position: relative;
            svg {
                position: absolute;
                inset: 50%;
                transform: translate(-50%, -50%);
                z-index: 3;
                color: aliceblue;
            }
            img {
                clip-path: circle();
                pointer-events: none;
            }
            &.loading {
                img {
                    opacity: 0.5;
                }
            }
        }

        h2 {
            font-size: 14px;
            color: var(--black);
            opacity: 0.9;
            font-weight: 400;
        }
        span {
            font-size: 12px;
            color: var(--black);
            opacity: 0.6;
        }
        input[type="file"] {
            display: none;
        }
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
            .box {
                flex: 0.5;
            }
            @extend %box_form;
        }
    }
}
</style>
