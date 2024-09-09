<script setup>
import LayoutTwo from "@/components/LayoutTwo.vue";
import { ref, reactive } from "vue";
import z, { zodEmail, zodPassword } from "@/types";
import { useRouter } from "vue-router";
import Logo from "@/components/Logo.vue";

const router = useRouter();


const showPassword = ref(false);
const data = reactive({
    email: "",
    password: "",
});

const dataSchema = z.object({
    email: zodEmail,
    password: zodPassword,
});

const handelShowPassword = () => {
    showPassword.value = !showPassword.value;
};

const submit = () => {

    const result = dataSchema.safeParse(data); //error.issues
    console.log(result.success);
    
    if (result.success) {
        router.push({name:'home'})
        localStorage.setItem("token", data.email);
    }
};
</script>

<template>
    <LayoutTwo>
        <div class="login-container">
            <button class="logo_img">
               <Logo/>
            </button>
            <h2>{{ $t('pages.welcome_back') }}</h2>
            
            <form action="/login" method="POST" @submit.prevent="submit">
                <div class="form-group">
                    <label for="email">{{ $t('pages.email') }}</label>
                    <div class="box_input">
                        <input
                            type="text"
                            id="email"
                            name="email"
                            :placeholder="$t('pages.email')"
                            v-model="data.email"
                        />
                    </div>
                </div>
                <div class="form-group">
                    <label for="password">{{ $t('pages.password') }}</label>
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
                <RouterLink to="/">{{ $t('pages.reset_password') }} ?</RouterLink>
                <button class="btn_login" type="submit">{{ $t('pages.login') }}</button>
                <div class="line">
                    <span class="or">or</span>
                </div>
                <span class="link_register">
                    don't have an account
                    <RouterLink to="/">register</RouterLink>
                </span>
            </form>
        </div>
    </LayoutTwo>
</template>

<style lang="scss" scoped>
.login-container {
    width: calc(100vw - 40px);
    max-width: 400px;
    //background: var(--gray);
    padding: 40px 20px;
    border-radius: 12px;
    button{
        &.logo_img{
            margin: 0 auto;
            display: flex;
            border: none;
            background: transparent;
            margin-bottom: 15px;
            cursor: none;
            img{
                height: 36px;
            }
            
        }
    }
    .form-group {
        //background: red;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        label {
            color: var(--black);
            font-size: 12px;
            text-transform: capitalize;
        }
        .box_input {
            height: 36px;
            position: relative;
            input {
                width: 100%;
                height: 100%;
                background: transparent;
                border: 1px solid var(--border-color);
                padding-inline: 10px;
                color: var(--black);
            }
            button {
                &.show_pass {
                    width: 20px;
                    height: 20px;
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    i {
                        font-size: 18px;
                        color: var(--black);
                        opacity: 0.5;
                    }
                }
            }
        }
    }
    a {
        display: block;
        color: var(--black);
        font-size: 12px;
        opacity: 0.8;
    }
    h2 {
        text-align: center;
        text-transform: capitalize;
        color: var(--black);
        margin-bottom: 10px;
        font-weight: 500;
        font-size: 24px;
    }
    
    button {
        &.btn_login {
            background: var(--main);
            display: block;
            width: 100%;
            border: none;
            height: 36px;
            margin-top: 20px;
            color: var(--white-fix);
            font-size: 14px;
            text-transform: capitalize;
            cursor: pointer;
        }
    }
    .line {
        height: 1px;
        background: var(--border-color);
        margin-block: 40px;
        position: relative;

        .or {
            width: 40px;
            height: 20px;
            background: var(--white);
            opacity: 1;
            position: absolute;
            inset: 50%;
            transform: translate(-50%, -50%);
            line-height: 20px;
            text-align: center;
            color: var(--black);
            font-size: 14px;
        }
    }
    span.link_register {
        //background: red;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--black);
        opacity: 1;
        text-transform: capitalize;
        justify-content: center;
        a {
            font-size: 14px;
            color: var(--main);
        }
    }
}
</style>
