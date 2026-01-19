/**
 * API Client v3 - Multi-tenant
 * Inclui headers X-Tenant-Slug e X-Store-Id automaticamente
 */

import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:3000';

export const apiClientV3 = axios.create({
  baseURL: `${API_BASE_URL}/api/v3`,
});

apiClientV3.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    const tenantSlug = Cookies.get('tenantSlug');
    const storeId = Cookies.get('storeId');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (tenantSlug) {
      config.headers['X-Tenant-Slug'] = tenantSlug;
    }

    if (storeId) {
      config.headers['X-Store-Id'] = storeId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClientV3.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      Cookies.remove('tenantSlug');
      Cookies.remove('storeId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClientV3;
