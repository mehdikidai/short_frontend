import axios from "axios";
const token = localStorage.getItem("token");
const defaultTimeout = 6000;

export const authAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    timeout: defaultTimeout,
});

export const guestAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: defaultTimeout,
});
