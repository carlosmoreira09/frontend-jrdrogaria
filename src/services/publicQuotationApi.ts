import apiClient from '../lib/interceptor';
import { SupplierPricePayload } from '../types/supplierPrice';
import { SupplierQuotation } from '../types/quotation';

export const publicQuotationApi = {
  getByToken: async (token: string) => {
    const { data } = await apiClient.get<{ data: SupplierQuotation }>(`/public/quotation/${token}`);
    return data.data;
  },
  savePrices: async (token: string, prices: SupplierPricePayload[], submit = false) => {
    const { data } = await apiClient.post(`/public/quotation/${token}/prices`, { prices, submit });
    return data;
  },
};
