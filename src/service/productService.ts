import { isAxiosError } from "axios";
import apiClient from "../lib/interceptor";
import {GeneralResponse, Product} from "../types/types.ts";



export const listProducts = async (): Promise<GeneralResponse | undefined> => {
    try {
        
        const response = await apiClient.get<GeneralResponse>('/products');
        return response.data;
    } catch (error) {
        if(isAxiosError(error)) {
            return error.response?.data
        }
    }
};

export const createProduct = async (product: Product): Promise<GeneralResponse | undefined> => {
    try {
        const response = await apiClient.post<GeneralResponse>('/products', product)
        return response.data
    } catch (error) {
        if(isAxiosError(error)) {
            return error.response?.data
        }
    }
}

export const deleteProduct = async (id: number | undefined): Promise<GeneralResponse | undefined> => {
    try {
        const response = await apiClient.delete<GeneralResponse>(`/products/${id}`)
        return  response.data
    } catch (error) {
        if (isAxiosError(error)) {
            return error.response?.data
        }
    }
}

export const createMultipleProducts = async (products: Product[]): Promise<GeneralResponse | undefined> => {
    try {
        const response = await apiClient.post<GeneralResponse>('/products/multiple',  products )
        return response.data
    } catch (error) {
        if(isAxiosError(error)) {
            return error.response?.data
        }
    }
}
