import axios from 'axios';
import Cookies from 'js-cookie';

export const apiClient = axios.create({
    baseURL: 'http://172.235.150.164/api/v1',
});

apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;