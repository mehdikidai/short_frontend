<template>
    <div class="verification_code">
        <div class="box">
            <h1>enter verification code</h1>
            <p>Lorem ipsum dolor sit amet consectetur.</p>
            <form action="#" method="post" @submit.prevent="submit">
                <div class="box_form">
                    <input
                        type="text"
                        v-model="code.iOne"
                        maxlength="1"
                        @input="validateInput($event)"
                        data-n="1"
                        @keydown="keydownInput($event)"
                    />
                    <input
                        type="text"
                        v-model="code.iTwo"
                        maxlength="1"
                        @input="validateInput($event)"
                        data-n="2"
                        @keydown="keydownInput($event)"
                    />
                    <input
                        type="text"
                        v-model="code.iThree"
                        maxlength="1"
                        @input="validateInput($event)"
                        data-n="3"
                        @keydown="keydownInput($event)"
                    />
                    <input
                        type="text"
                        v-model="code.iFour"
                        maxlength="1"
                        @input="validateInput($event)"
                        data-n="4"
                        @keydown="keydownInput($event)"
                    />
                    <input
                        type="text"
                        v-model="code.iFive"
                        maxlength="1"
                        @input="validateInput($event)"
                        data-n="5"
                        @keydown="keydownInput($event)"
                    />
                    <input
                        type="text"
                        v-model="code.iSix"
                        maxlength="1"
                        @input="validateInput($event)"
                        data-n="6"
                        @keydown="keydownInput($event)"
                    />
                </div>
                <button type="submit">verify your account</button>
            </form>
            <span>didn't receive a code ? <a href="">click her</a></span>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useUserStore } from "@/stores/user";
import { z } from "zod";
import { API } from "@/api";


const ShowVerificationCode = ref(true);
const userStore = useUserStore();
const { setEmailVerified } = userStore;
const zodNumber = z.string().regex(/^[0-9]$/);
const zodCodeVerification = z.string().regex(/^[0-9]{6}$/);

const code = reactive({
    iOne: "",
    iTwo: "",
    iThree: "",
    iFour: "",
    iFive: "",
    iSix: "",
});

const submit = async () => {
    const fullCode = `${code.iOne}${code.iTwo}${code.iThree}${code.iFour}${code.iFive}${code.iSix}`;

    const { success, data: verification_code } =
        zodCodeVerification.safeParse(fullCode);

    if (success) {
        try {
            const res = await API.post(
                "/api/email/verify",
                { verification_code },
                { ...userStore.configApi }
            );

            setEmailVerified(true);

            console.log(res);

        } catch (error) {

            console.log(error.message);

        }
    }
};

const validateInput = (event) => {
    const el = event.target;
    const result = zodNumber.safeParse(el.value);

    if (Number(el.nextElementSibling?.dataset?.n) <= 6 && result.success) {
        el.nextElementSibling.focus();
    }
};

const keydownInput = (event) => {
    const el = event.target;

    switch (event.key) {
        case "Backspace":
            if (
                el.value === "" &&
                Number(el.previousElementSibling?.dataset?.n) >= 1
            ) {
                el.previousElementSibling.focus();
            }
            break;

        default:
            return;
    }
};

const showBoxVerification = computed(() => !userStore.emailVerified);

onMounted(async () => {
    console.log(userStore.emailVerified);
    if (!userStore.emailVerified) {
    }
});
</script>

<style lang="scss" scoped>
.verification_code {
    position: fixed;
    height: 100vh;
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    inset: 0;
    z-index: 9999;
    .box {
        position: absolute;
        inset: 50%;
        transform: translate(-50%, -70%);
        width: calc(100vw - 40px);
        max-width: 440px;
        height: auto;
        background: var(--white);
        padding: 40px;
        display: flex;
        flex-direction: column;
        height: 330px;
        gap: 5px;
        border-radius: 12px;
        box-shadow: var(--box-shadow);
        h1 {
            font-size: 24px;
            color: var(--black);
            font-weight: 600;
            text-transform: capitalize;
        }
        p {
            font-size: 14px;
            color: var(--black);
            opacity: 0.7;
        }
        form {
            display: flex;
            //background: red;
            flex-direction: column;
            gap: 30px;
            margin-block: 20px;
        }
        &_form {
            display: grid;
            grid-template-columns: repeat(6, 40px);
            justify-content: space-between;
            input {
                aspect-ratio: 1;
                text-align: center;
                background: transparent;
                border: 1px solid rgba(136, 136, 136, 0.877);
                color: var(--black);
                font-size: 18px;
                border-radius: 4px;
            }
        }
        button {
            height: 38px;
            border: none;
            padding-inline: 20px;
            border-radius: 4px;
            cursor: pointer;
            //font-size: 14px;
            background: var(--main);
            color: var(--white-fix);
        }
    }
    span {
        color: var(--black);
        opacity: 0.6;
        font-size: 14px;
        transition: all 0.3s ease-in-out;
        a {
            color: var(--main);
        }
        &:hover {
            opacity: 1;
        }
    }
}
</style>
