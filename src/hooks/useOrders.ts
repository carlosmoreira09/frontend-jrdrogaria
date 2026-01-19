import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../services/orderApi";
import { CreateOrderPayload, UpdateOrderItemsPayload, OrderItemConfig } from "../types/order";

const QUERY_KEY = "orders";

export function useOrders() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: orderApi.list,
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => orderApi.get(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => orderApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useGenerateOrders() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ quotationId, orderItems }: { quotationId: number; orderItems?: OrderItemConfig[] }) => 
      orderApi.generateFromBestPrices(quotationId, orderItems),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useUpdateOrderItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateOrderItemsPayload }) =>
      orderApi.updateItems(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      orderApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => orderApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
