import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quotationApi } from "../services/quotationApi";
import { CreateQuotationPayload, GenerateLinksPayload } from "../types/quotation";

const QUERY_KEY = "quotations";

export function useQuotations() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: quotationApi.list,
  });
}

export function useQuotation(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => quotationApi.get(id),
    enabled: !!id,
  });
}

export function useCreateQuotation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateQuotationPayload) => quotationApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useUpdateQuotation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateQuotationPayload }) =>
      quotationApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useDeleteQuotation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => quotationApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useGenerateSupplierLinks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: GenerateLinksPayload }) =>
      quotationApi.generateLinks(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
