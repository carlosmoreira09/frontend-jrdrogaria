/**
 * Product API v3 - Multi-tenant
 */

import apiClientV3 from '../../lib/apiClientV3';
import { Product, GeneralResponse } from '../../types/types';

export const productApiV3 = {
  list: async (): Promise<GeneralResponse> => {
    const { data } = await apiClientV3.get<GeneralResponse>('/products');
    return data;
  },

  get: async (id: number): Promise<Product> => {
    const { data } = await apiClientV3.get<{ data: Product }>(`/products/${id}`);
    return data.data;
  },

  create: async (product: Partial<Product>): Promise<GeneralResponse> => {
    const { data } = await apiClientV3.post<GeneralResponse>('/products', product);
    return data;
  },

  update: async (id: number, product: Partial<Product>): Promise<GeneralResponse> => {
    const { data } = await apiClientV3.put<GeneralResponse>(`/products/${id}`, product);
    return data;
  },

  remove: async (id: number): Promise<GeneralResponse> => {
    const { data } = await apiClientV3.delete<GeneralResponse>(`/products/${id}`);
    return data;
  },

  createMultiple: async (products: Partial<Product>[]): Promise<GeneralResponse> => {
    const { data } = await apiClientV3.post<GeneralResponse>('/products/multiple', products);
    return data;
  },
};

export default productApiV3;
