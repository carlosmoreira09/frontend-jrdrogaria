/**
 * Supplier API v3 - Multi-tenant
 */

import apiClientV3 from '../../lib/apiClientV3';
import { Supplier, GeneralResponse } from '../../types/types';

export const supplierApiV3 = {
  list: async (): Promise<GeneralResponse> => {
    const { data } = await apiClientV3.get<GeneralResponse>('/suppliers');
    return data;
  },

  get: async (id: number): Promise<Supplier> => {
    const { data } = await apiClientV3.get<{ data: Supplier }>(`/suppliers/${id}`);
    return data.data;
  },

  create: async (supplier: Partial<Supplier>): Promise<GeneralResponse> => {
    const { data } = await apiClientV3.post<GeneralResponse>('/suppliers', supplier);
    return data;
  },

  update: async (id: number, supplier: Partial<Supplier>): Promise<GeneralResponse> => {
    const { data } = await apiClientV3.put<GeneralResponse>(`/suppliers/${id}`, supplier);
    return data;
  },

  remove: async (id: number): Promise<GeneralResponse> => {
    const { data } = await apiClientV3.delete<GeneralResponse>(`/suppliers/${id}`);
    return data;
  },
};

export default supplierApiV3;
