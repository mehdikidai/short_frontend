import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
    const token = ref(localStorage.getItem("token") || null);
    const email = ref("");
    const name = ref("");
    const photo = ref("https://avatar.iran.liara.run/public");
    const id = ref("");
    const emailVerified = ref(true);

    const isAuthenticated = computed(() => !!token.value);

    const configApi = computed(() => {
        return {
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
        };
    });

    function setToken(t) {
        token.value = t;
        localStorage.setItem("token", t);
    }

    function setPhoto(img) {
        if (img !== photo.value) photo.value = img;
    }

    function setUser(data) {
        const { email: e, name: n, id: i, email_verified_at: emailV } = data;

        email.value = e;
        name.value = n;
        id.value = i;
        emailVerified.value = emailV == null ? false : true;
        localStorage.setItem("email_verified", emailV ? true : false);
    }

    function setEmailVerified(v) {
        emailVerified.value = v;
        localStorage.setItem("email_verified", v ? true : false);
    }

    function resetUser() {
        name.value = "";
        id.value = "";
        token.value = null;
        emailVerified.value = true;
        localStorage.removeItem("token");
        localStorage.removeItem("email_verified");
    }

    return {
        token,
        name,
        email,
        isAuthenticated,
        setToken,
        setUser,
        id,
        resetUser,
        configApi,
        emailVerified,
        setEmailVerified,
        photo,
        setPhoto,
    };
});
