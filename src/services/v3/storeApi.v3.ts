/**
 * Store API v3 - Multi-tenant
 */

import apiClientV3 from '../../lib/apiClientV3';

export interface Store {
  id: number;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  status: 'active' | 'inactive';
  sortOrder: number;
  created_at: string;
}

export const storeApiV3 = {
  list: async (): Promise<Store[]> => {
    const { data } = await apiClientV3.get<{ data: Store[] }>('/stores');
    return data.data;
  },

  get: async (id: number): Promise<Store> => {
    const { data } = await apiClientV3.get<{ data: Store }>(`/stores/${id}`);
    return data.data;
  },
};

export default storeApiV3;
