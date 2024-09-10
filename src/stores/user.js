import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
    const token = ref(localStorage.getItem("token") || null);
    const email = ref("");
    const name = ref("");
    const id = ref("");

    const isAuthenticated = computed(() => !!token.value);

    function setToken(t) {
        token.value = t;
        localStorage.setItem("token", t);
    }


    function setUser({ email: e, name: n, id: i }) {
        email.value = e;
        name.value = n;
        id.value = i;
    }

    function resetUser() {
        email.value = "";
        name.value = "";
        id.value = "";
        token.value = null;
        localStorage.removeItem("token");
    }

    return {
        token,
        name,
        email,
        isAuthenticated,
        setToken,
        setUser,
        id,
        resetUser
    };
});
