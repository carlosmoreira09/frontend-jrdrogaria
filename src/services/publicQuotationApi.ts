import apiClient from '../lib/interceptor';
import { SupplierPricePayload } from '../types/supplierPrice';
import { QuotationRequest } from '../types/quotation';

export const publicQuotationApi = {
  getByToken: async (token: string) => {
    const { data } = await apiClient.get<{ data: QuotationRequest }>(`/public/quotation/${token}`);
    return data.data;
  },
  savePrices: async (token: string, prices: SupplierPricePayload[], submit = false) => {
    const { data } = await apiClient.post(`/public/quotation/${token}/prices`, { prices, submit });
    return data;
  },
};
