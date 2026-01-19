import apiClient from "../lib/interceptor.ts";
import {GeneralResponse} from "../types/types.ts";
import {isAxiosError} from "axios";

export const getTotalAmount = async (id_store: number) => {
    try {
        const response = await apiClient.get<GeneralResponse>(`/general`, {
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