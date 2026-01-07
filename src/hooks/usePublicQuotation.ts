import { useQuery, useMutation } from "@tanstack/react-query";
import { publicQuotationApi } from "../services/publicQuotationApi";
import { SupplierPricePayload } from "../types/supplierPrice";

export function usePublicQuotation(token: string) {
  return useQuery({
    queryKey: ["publicQuotation", token],
    queryFn: () => publicQuotationApi.getByToken(token),
    enabled: !!token,
    retry: false,
  });
}

export function useSaveSupplierPrices() {
  return useMutation({
    mutationFn: ({
      token,
      prices,
      finalSubmit,
    }: {
      token: string;
      prices: SupplierPricePayload[];
      finalSubmit: boolean;
    }) => publicQuotationApi.savePrices(token, prices, finalSubmit),
  });
}
