import axios from 'axios';
import Cookies from 'js-cookie';


//https://jrdrogaria.com.br/api/v1

export const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
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