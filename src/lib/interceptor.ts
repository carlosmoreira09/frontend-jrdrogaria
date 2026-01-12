import axios from 'axios';
import Cookies from 'js-cookie';

export const apiClient = axios.create({
    baseURL: 'https://api.jrdrogaria.com.br/api/v1',
});

adminClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('admin_token');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

export const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
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
            });

export default apiClient;