import { API } from "@/api";

export const Logout = async (configApi, callback) => {
    try {
        const res = await API.post("/api/logout", null, {
            ...configApi,
        });
        if (res.status === 200) {
            callback();
        }
    } catch (err) {
        console.log(err);
    }
};
