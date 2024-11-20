<script setup>
import LayoutTwo from "@/components/LayoutTwo.vue";
import { ref, reactive } from "vue";
import z, { zodEmail, zodPassword, zodName } from "@/types";
import { useRouter } from "vue-router";
import axios from "axios";
import { useUserStore } from "@/stores/user";

const store = useUserStore();
const router = useRouter();
const showPassword = ref(false);
const data = reactive({
    email: "",
    password: "",
    name: "",
});

const dataSchema = z.object({
    email: zodEmail,
    password: zodPassword,
    name: zodName,
});

const handelShowPassword = () => {
    showPassword.value = !showPassword.value;
};

const submit = () => {
    const result = dataSchema.safeParse(data);
    console.log(result.success);

    if (result.success) {
        //console.log(data.name);

        axios
            .post(`${import.meta.env.VITE_API_URL}/api/register`, {
                email: data.email,
                password: data.password,
                name: data.name,
            })
            .then((res) => {
                //console.log(res.data);
                if (res.status === 201) {
                    store.setToken(res.data.token);
                    store.setUser(res.data.user);
                    router.push({ name: "home" });
                }
            })
            .catch((error) => {
                console.log(error.message);
            });
    }
};
</script>

<template>
    <LayoutTwo>
        <div class="login-container">
            <button class="logo_img">
                <Logo />
            </button>
            <h2>{{ $t("pages.sign_in") }}</h2>

            <form action="/login" method="POST" @submit.prevent="submit">
                <div class="form-group">
                    <label for="email">{{ $t("pages.name") }}</label>
                    <div class="box_input">
                        <input
                            type="text"
                            id="email"
                            name="name"
                            :placeholder="$t('pages.name')"
                            v-model="data.name"
                            autoComplete="off"
                            spellcheck="false"
                        />
                    </div>
                </div>
                <div class="form-group">
                    <label for="email">{{ $t("pages.email") }}</label>
                    <div class="box_input">
                        <input
                            type="text"
                            id="email"
                            name="email"
                            :placeholder="$t('pages.email')"
                            v-model="data.email"
                            autoComplete="off"
                            spellcheck="false"
                        />
                    </div>
                </div>
                <div class="form-group">
                    <label for="password">{{ $t("pages.password") }}</label>
                    <div class="box_input">
                        <input
                            :type="showPassword ? 'text' : 'password'"
                            id="password"
                            name="password"
                            :placeholder="$t('pages.password')"
                            v-model="data.password"
                        />
                        <button
                            type="button"
                            class="show_pass"
                            @click="handelShowPassword"
                        >
                            <i class="material-symbols-rounded">
                                {{
                                    showPassword
                                        ? "visibility_off"
                                        : "visibility"
                                }}
                            </i>
                        </button>
                    </div>
                </div>

                <button class="btn_login" type="submit">
                    {{ $t("pages.register") }}
                </button>
                <div class="line">
                    <span class="or">{{  $t("pages.or") }}</span>
                </div>
                <span class="link_register">
                    {{ $t("pages.i_have_an_account") }}
                    <RouterLink :to="{ name: 'login' }">{{
                        $t("pages.login")
                    }}</RouterLink>
                </span>
            </form>
        </div>
    </LayoutTwo>
</template>

<style lang="scss" scoped>
@forward "./../assets/scss/login";
</style>
