import { ref, computed } from "vue";
import { defineStore } from "pinia";

const defaultImg = "https://avatar.iran.liara.run/public";

export const useUserStore = defineStore("user", () => {

    const token = ref(localStorage.getItem("token") || null);
    const email = ref("");
    const name = ref("");
    const photo = ref(defaultImg);
    const id = ref("");
    const emailVerified = ref(true);
    const isAdmin = ref(false)

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
        if (img !== photo.value) {

            photo.value = img ?? defaultImg

        }
    }

    function setUser(data) {
        const {
            email: e,
            name: n,
            id: i,
            email_verified_at: emailV,
            photo: p,
            is_admin
        } = data;

        email.value = e;
        name.value = n;
        id.value = i;
        photo.value = p ?? defaultImg;
        emailVerified.value = emailV == null ? false : true;
        isAdmin.value = is_admin
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
        isAdmin.value = false
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
        isAdmin
    };
});
