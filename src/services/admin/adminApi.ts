import {adminClient} from "../../lib/interceptor.ts";

export const adminAuthApi = {
  login: async (email: string, password: string) => {
    const response = await adminClient.post('/auth/login', { email, password });
    return response.data;
  },
};

export const adminDashboardApi = {
  getStats: async () => {
    const response = await adminClient.get('/dashboard/stats');
    return response.data;
  },
};

export const adminTenantsApi = {
  list: async (params?: { status?: string; plan?: string; search?: string; page?: number; limit?: number }) => {
    const response = await adminClient.get('/tenants', { params });
    return response.data;
  },
  get: async (id: number) => {
    const response = await adminClient.get(`/tenants/${id}`);
    return response.data;
  },
  create: async (data: {
    name: string;
    slug: string;
    plan: string;
    ownerName: string;
    ownerEmail: string;
    ownerPassword: string;
    storeName: string;
    storeCode?: string;
  }) => {
    const response = await adminClient.post('/tenants', data);
    return response.data;
  },
  updateStatus: async (id: number, status: string, reason?: string) => {
    const response = await adminClient.put(`/tenants/${id}/status`, { status, reason });
    return response.data;
  },
  updatePlan: async (id: number, plan: string, reason?: string) => {
    const response = await adminClient.put(`/tenants/${id}/plan`, { plan, reason });
    return response.data;
  },
};

export const adminUsersApi = {
  list: async () => {
    const response = await adminClient.get('/admin-users');
    return response.data;
  },
  create: async (data: { name: string; email: string; password: string; role: string }) => {
    const response = await adminClient.post('/admin-users', data);
    return response.data;
  },
};

export const adminAuditApi = {
  list: async (params?: { adminId?: number; tenantId?: number; action?: string; page?: number; limit?: number }) => {
    const response = await adminClient.get('/audit-logs', { params });
    return response.data;
  },
};

export default adminClient;
