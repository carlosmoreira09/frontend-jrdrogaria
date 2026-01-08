/**
 * Order API v3 - Multi-tenant
 */

import apiClientV3 from '../../lib/apiClientV3';
import { PurchaseOrderV3, CreateOrderPayloadV3, OrderStatus } from '../../types/order.v3';

export const orderApiV3 = {
  list: async () => {
    const { data } = await apiClientV3.get<{ data: PurchaseOrderV3[] }>('/orders');
    return data.data;
  },

  get: async (id: number) => {
    const { data } = await apiClientV3.get<{ data: PurchaseOrderV3 }>(`/orders/${id}`);
    return data.data;
  },

  create: async (payload: CreateOrderPayloadV3) => {
    const { data } = await apiClientV3.post('/orders', payload);
    return data;
  },

  generateFromQuotation: async (quotationId: number) => {
    const { data } = await apiClientV3.post(`/orders/generate/${quotationId}`);
    return data;
  },

  updateStatus: async (id: number, status: OrderStatus) => {
    const { data } = await apiClientV3.put(`/orders/${id}/status`, { status });
    return data;
  },

  updateItems: async (id: number, items: { productId: number; quantity: number }[]) => {
    const { data } = await apiClientV3.put(`/orders/${id}/items`, { items });
    return data;
  },

  remove: async (id: number) => {
    const { data } = await apiClientV3.delete(`/orders/${id}`);
    return data;
  },

  export: async (id: number) => {
    const response = await apiClientV3.get(`/orders/${id}/export`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default orderApiV3;
