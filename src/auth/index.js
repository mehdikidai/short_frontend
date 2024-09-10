import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

export const isNotLogin = (to, from, next) => {
    const isNotAuthenticated = !localStorage.getItem("token");

    console.log(isNotAuthenticated);

    if (isNotAuthenticated) {
        return next();
    }
    return next("/");
};

export const isAuthenticated = !!localStorage.getItem("token");

export const axiosUser = (set) => {
    if (isAuthenticated) {
        axios
            .get(`${import.meta.env.VITE_API_URL}/api/user`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    set(res.data);
                }
            })
            .catch((error) => {
                if (error.status) {
                    localStorage.removeItem("token");
                    router.push({ name: "login" });
                }
            });
    }
};
