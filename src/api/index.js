import axios from 'axios';
import { toast } from 'vue3-toastify';

const defaultTimeout = 6000;

const useAxios = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: defaultTimeout,
	'Content-type': 'application/json',
});

useAxios.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		if (error.response && error.response.status === 401 && localStorage.getItem('token')) {
			toast.warning('Session expired, please log in again.', {
				onClose() {
					localStorage.removeItem('token');
				},
			});
		}
		return Promise.reject(error);
	}
);

export { useAxios };
