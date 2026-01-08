/**
 * Quotation API v3 - Multi-tenant
 */

import apiClientV3 from '../../lib/apiClientV3';
import {
  CreateQuotationPayload,
  GenerateLinksPayload,
  QuotationRequest,
  ComparisonSummary,
  BestPrice,
} from '../../types/quotation';

export const quotationApiV3 = {
  list: async () => {
    const { data } = await apiClientV3.get<{ data: QuotationRequest[] }>('/quotations');
    return data.data;
  },

  get: async (id: number) => {
    const { data } = await apiClientV3.get<{ data: QuotationRequest }>(`/quotations/${id}`);
    return data.data;
  },

  create: async (payload: CreateQuotationPayload) => {
    const { data } = await apiClientV3.post('/quotations', payload);
    return data;
  },

  update: async (id: number, payload: Partial<CreateQuotationPayload> & { status?: QuotationRequest['status'] }) => {
    const { data } = await apiClientV3.put(`/quotations/${id}`, payload);
    return data;
  },

  remove: async (id: number) => {
    const { data } = await apiClientV3.delete(`/quotations/${id}`);
    return data;
  },

  generateLinks: async (id: number, payload: GenerateLinksPayload) => {
    const { data } = await apiClientV3.post(`/quotations/${id}/generate-links`, payload);
    return data;
  },

  getComparison: async (id: number) => {
    const { data } = await apiClientV3.get<{ data: ComparisonSummary }>(`/quotations/${id}/comparison`);
    return data.data;
  },

  getBestPrices: async (id: number) => {
    const { data } = await apiClientV3.get<{ data: BestPrice[] }>(`/quotations/${id}/best-prices`);
    return data.data;
  },

  exportComparison: async (id: number) => {
    const response = await apiClientV3.get(`/quotations/${id}/export`, {
      responseType: 'blob',
    });
    return response.data;
  },

  exportBestPrices: async (id: number) => {
    const response = await apiClientV3.get(`/quotations/${id}/export-orders`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default quotationApiV3;
