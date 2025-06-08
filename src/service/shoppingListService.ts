import {GeneralResponse, IShoppingList} from "../types/types.ts";
import apiClient from "../lib/interceptor.ts";
import {isAxiosError} from "axios";

export const listShoppingLists = async (id_store: number): Promise<GeneralResponse | undefined> => {
    try {

        const response = await apiClient.get<GeneralResponse>('/shopping', {
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
export const findOneShoppingList = async (id_list: number, id_store: number) => {
    try {

        const response = await apiClient.get(`/shopping/${id_list}`, {
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

export const createShoppingList = async (newList: IShoppingList, id_store: number) => {
    try {
        const response = await apiClient.post('/shopping', newList,
            {
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
export const updateShoppingList = async (newList: IShoppingList, id_store: number): Promise<GeneralResponse | undefined> => {
    try {
        const response = await apiClient.put<GeneralResponse>(`/shopping/${newList.id}`, newList,
            {
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
export const deleteShoppingList = async (newList: IShoppingList, id_store: number) => {
    try {
        const response = await apiClient.delete(`/shopping/${newList.id}`,
            {
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

