import axios from "axios";
const defaultTimeout = 6000;

const useAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: defaultTimeout,
});

useAxios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response && error.response.status === 401) {
            //alert("Token expired or invalid.");
            localStorage.removeItem("token");
        }
        return Promise.reject(error);
    }
);

export { useAxios };
