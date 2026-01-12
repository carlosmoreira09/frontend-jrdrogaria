/**
 * TenantStore Context - v3 Multi-tenant
 * Gerencia tenant, store selecionada e autenticação
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import apiClientV3 from '../lib/apiClientV3';

export type UserRole = 'tenant_owner' | 'admin' | 'buyer' | 'finance' | 'viewer';

export interface Store {
  id: number;
  name: string;
  code: string;
  status: 'active' | 'inactive';
}

export interface TokenPayload {
  userId: number;
  tenantId: number;
  tenantSlug: string;
  tenantName: string;
  role: UserRole;
  exp: number;
  iat: number;
}

export interface TenantStoreContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: number | null;
  tenantId: number | null;
  tenantSlug: string | null;
  tenantName: string | null;
  role: UserRole | null;
  token: string | null;
  stores: Store[];
  currentStore: Store | null;
  setCurrentStore: (store: Store) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadStores: () => Promise<void>;
}

const TenantStoreContext = createContext<TenantStoreContextType | null>(null);

export const useTenantStore = () => {
  const context = useContext(TenantStoreContext);
  if (!context) {
    throw new Error('useTenantStore must be used within TenantStoreProvider');
  }
  return context;
};

interface Props {
  children: React.ReactNode;
}

export const TenantStoreProvider: React.FC<Props> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [tenantId, setTenantId] = useState<number | null>(null);
  const [tenantSlug, setTenantSlug] = useState<string | null>(null);
  const [tenantName, setTenantName] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [currentStore, setCurrentStoreState] = useState<Store | null>(null);

  const clearAuth = useCallback(() => {
    Cookies.remove('token');
    Cookies.remove('tenantSlug');
    Cookies.remove('storeId');
    setIsAuthenticated(false);
    setUserId(null);
    setTenantId(null);
    setTenantSlug(null);
    setTenantName(null);
    setRole(null);
    setToken(null);
    setStores([]);
    setCurrentStoreState(null);
  }, []);

  const setAuthFromToken = useCallback((tokenValue: string) => {
    try {
      const decoded: TokenPayload = jwtDecode(tokenValue);
      
      if (decoded.exp * 1000 < Date.now()) {
        clearAuth();
        return false;
      }

      setUserId(decoded.userId);
      setTenantId(decoded.tenantId);
      setTenantSlug(decoded.tenantSlug);
      setTenantName(decoded.tenantName);
      setRole(decoded.role);
      setToken(tokenValue);
      setIsAuthenticated(true);

      Cookies.set('token', tokenValue, { expires: 7 });
      Cookies.set('tenantSlug', decoded.tenantSlug, { expires: 7 });

      return true;
    } catch (error) {
      console.error('Error decoding token:', error);
      clearAuth();
      return false;
    }
  }, [clearAuth]);

  const loadStores = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const { data } = await apiClientV3.get<{ data: Store[] }>('/stores');
      setStores(data.data || []);

      const savedStoreId = Cookies.get('storeId');
      if (savedStoreId && data.data) {
        const savedStore = data.data.find((s: Store) => s.id === Number(savedStoreId));
        if (savedStore) {
          setCurrentStoreState(savedStore);
        } else if (data.data.length > 0) {
          setCurrentStore(data.data[0]);
        }
      } else if (data.data && data.data.length > 0) {
        setCurrentStore(data.data[0]);
      }
    } catch (error) {
      console.error('Error loading stores:', error);
    }
  }, [isAuthenticated]);

  const setCurrentStore = useCallback((store: Store) => {
    setCurrentStoreState(store);
    Cookies.set('storeId', store.id.toString(), { expires: 7 });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiClientV3.post('/auth/login', { user: email, password });
    
    if (response.data?.token) {
      const success = setAuthFromToken(response.data.token);
      if (success) {
        await loadStores();
      }
    } else {
      throw new Error('Login failed');
    }
  }, [setAuthFromToken, loadStores]);

  const logout = useCallback(() => {
    clearAuth();
    window.location.href = '/v3/login';
  }, [clearAuth]);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const savedToken = Cookies.get('token');
      
      if (savedToken) {
        const isValid = setAuthFromToken(savedToken);
        if (isValid) {
          const savedStoreId = Cookies.get('storeId');
          if (savedStoreId) {
            setCurrentStoreState({ id: Number(savedStoreId) } as Store);
          }
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, [setAuthFromToken]);

  useEffect(() => {
    if (isAuthenticated && stores.length === 0) {
      loadStores();
    }
  }, [isAuthenticated, stores.length, loadStores]);

  return (
    <TenantStoreContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        userId,
        tenantId,
        tenantSlug,
        tenantName,
        role,
        token,
        stores,
        currentStore,
        setCurrentStore,
        login,
        logout,
        loadStores,
      }}
    >
      {children}
    </TenantStoreContext.Provider>
  );
};

export default TenantStoreProvider;
