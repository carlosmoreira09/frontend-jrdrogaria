import apiClient from "../lib/interceptor";
import {
  CreateOrderPayload,
  PurchaseOrder,
  UpdateOrderItemsPayload,
  OrderItemConfig,
} from "../types/order";

export const orderApi = {
  list: async () => {
    const { data } = await apiClient.get<{ data: PurchaseOrder[] }>("/orders");
    return data.data;
  },
  get: async (id: number) => {
    const { data } = await apiClient.get<{ data: PurchaseOrder }>(`/orders/${id}`);
    return data.data;
  },
  create: async (payload: CreateOrderPayload) => {
    const { data } = await apiClient.post("/orders", payload);
    return data;
  },
  generateFromBestPrices: async (quotationId: number, orderItems?: OrderItemConfig[]) => {
    const { data } = await apiClient.post<{ data: PurchaseOrder[] }>(
      `/orders/generate/${quotationId}`,
      { orderItems }
    );
    return data.data;
  },
  updateItems: async (id: number, payload: UpdateOrderItemsPayload) => {
    const { data } = await apiClient.put(`/orders/${id}/items`, payload);
    return data;
  },
  updateStatus: async (id: number, status: string) => {
    const { data } = await apiClient.put(`/orders/${id}/status`, { status });
    return data;
  },
  remove: async (id: number) => {
    const { data } = await apiClient.delete(`/orders/${id}`);
    return data;
  },
  export: async (id: number) => {
    const response = await apiClient.get(`/orders/${id}/export`, {
      responseType: "blob",
    });
    return response.data;
  },
};
