import axios from 'axios';
import Cookies from 'js-cookie';


//https://jrdrogaria.com.br/api/v1

export const apiClient = axios.create({
    baseURL: 'https://jrdrogaria.com.br/api/v1',
});

apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        const tenant = Cookies.get('tenant');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        console.log(tenant)
        if (tenant) {
            config.headers['x-tenant-id'] = tenant;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;