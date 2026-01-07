import apiClient from '../lib/interceptor';
import {
  CreateQuotationPayload,
  GenerateLinksPayload,
  QuotationRequest,
  ComparisonSummary,
  BestPrice,
} from '../types/quotation';

export const quotationApi = {
  list: async () => {
    const { data } = await apiClient.get<{ data: QuotationRequest[] }>('/quotations');
    return data.data;
  },
  get: async (id: number) => {
    const { data } = await apiClient.get<{ data: QuotationRequest }>(`/quotations/${id}`);
    return data.data;
  },
  create: async (payload: CreateQuotationPayload) => {
    const { data } = await apiClient.post(`/quotations`, payload);
    return data;
  },
  update: async (id: number, payload: Partial<CreateQuotationPayload> & { status?: QuotationRequest['status'] }) => {
    const { data } = await apiClient.put(`/quotations/${id}`, payload);
    return data;
  },
  remove: async (id: number) => {
    const { data } = await apiClient.delete(`/quotations/${id}`);
    return data;
  },
  generateLinks: async (id: number, payload: GenerateLinksPayload) => {
    const { data } = await apiClient.post(`/quotations/${id}/generate-links`, payload);
    return data;
  },
  getComparison: async (id: number) => {
    const { data } = await apiClient.get<{ data: ComparisonSummary }>(`/quotations/${id}/comparison`);
    return data.data;
  },
  getBestPrices: async (id: number) => {
    const { data } = await apiClient.get<{ data: BestPrice[] }>(`/quotations/${id}/best-prices`);
    return data.data;
  },
  exportComparison: async (id: number) => {
    const response = await apiClient.get(`/quotations/${id}/export`, {
      responseType: 'blob',
    });
    return response.data;
  },
  exportBestPrices: async (id: number) => {
    const response = await apiClient.get(`/quotations/${id}/export-orders`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
