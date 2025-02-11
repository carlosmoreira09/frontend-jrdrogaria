import { isAxiosError } from "axios";
import apiClient from "../lib/interceptor";
import { LoginResponse } from "../types/types";


export const loginService = async (user: string, password: string): Promise<LoginResponse | undefined> => {
    try {
        const data = {
            user: user,
            password: password
        }
        if(user.includes('@')) {
            data.user = user
        } else {
            data.user = user.replace(/\D/g, '')
        }
        
        const response = await apiClient.post('/auth/login', data);
        return response.data;
    } catch (error) {
        if(isAxiosError(error)) {
            return error.response?.data
        }
    }
};