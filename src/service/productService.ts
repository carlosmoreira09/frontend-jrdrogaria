import { isAxiosError } from "axios";
import apiClient from "../lib/interceptor";
import {GeneralResponse, Product} from "../types/types.ts";



export const listProducts = async (id_store: number): Promise<GeneralResponse | undefined> => {
    try {
        
        const response = await apiClient.get<GeneralResponse>('/products', {
            headers: {
                'x-tenant-id': id_store
            }
        });
        return response.data;
    } catch (error) {
        if(isAxiosError(error)) {
            return error.response?.data
        }
    }
};

export const createProduct = async (product: Product, id_store: number): Promise<GeneralResponse | undefined> => {
    try {
        const response = await apiClient.post<GeneralResponse>('/products', product, {
            headers: {
                'x-tenant-id': id_store
            }
        })
        return response.data
    } catch (error) {
        if(isAxiosError(error)) {
            return error.response?.data
        }
    }
}

export const deleteProduct = async (id: number | undefined,id_store: number): Promise<GeneralResponse | undefined> => {
    try {
        const response = await apiClient.delete<GeneralResponse>(`/products/${id}`, {
            headers: {
                'x-tenant-id': id_store
            }

        })
        console.log(response)
        return  response.data
    } catch (error) {
        if (isAxiosError(error)) {
            return error.response?.data
        }
    }
}