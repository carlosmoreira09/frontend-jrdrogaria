import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'https://api.jrdrogaria.com.br'

export const adminClient = axios.create({
    baseURL: `${API_URL}/admin/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});
adminClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
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
    baseURL: 'https://api.jrdrogaria.com.br/api/v1',
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