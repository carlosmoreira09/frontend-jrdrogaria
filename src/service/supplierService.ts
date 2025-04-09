import { isAxiosError } from "axios";
import apiClient from "../lib/interceptor";
import {GeneralResponse, Supplier} from "../types/types.ts";



export const listSuppliers = async (): Promise<GeneralResponse | undefined> => {
    try {
        
        const response = await apiClient.get<GeneralResponse>('/suppliers');
        return response.data;
    } catch (error) {
        if(isAxiosError(error)) {
            return error.response?.data
        }
    }
};

export const createSupplier = async (supplier: Supplier, id_store: number): Promise<GeneralResponse | undefined> => {
    try {
        const response = await apiClient.post<GeneralResponse>('/suppliers', supplier, {
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

export const deleteSupplier = async (id: number | undefined,id_store: number): Promise<GeneralResponse | undefined> => {
    try {
        const response = await apiClient.delete<GeneralResponse>(`/suppliers/${id}`, {
            headers: {
                'x-tenant-id': id_store
            }

        })
        return  response.data
    } catch (error) {
        if (isAxiosError(error)) {
            return error.response?.data
        }
    }
}