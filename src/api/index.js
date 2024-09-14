import axios from "axios";
import swal from "sweetalert";
const defaultTimeout = 6000;

const useAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: defaultTimeout,
    "Content-type": "application/json",
});

useAxios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (
            error.response &&
            error.response.status === 401 &&
            localStorage.getItem("token")
        ) {
            //alert("Token expired or invalid.");
            swal("Here's the title!", "and here's the text!");
            localStorage.removeItem("token");
        }
        return Promise.reject(error);
    }
);

export { useAxios };
