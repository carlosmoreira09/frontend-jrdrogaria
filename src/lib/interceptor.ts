import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const adminClient = axios.create({
    baseURL: `${API_URL}/admin/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
});

[apiClient,adminClient].map(
    (con) => {
        return con.interceptors.request.use(
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
    }
)

export default apiClient;