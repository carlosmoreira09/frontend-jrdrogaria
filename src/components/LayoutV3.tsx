/**
 * Layout v3 - Multi-tenant
 * Wrapper com HeaderV3 e estrutura padrão para páginas v3
 */

import React from 'react';
import HeaderV3 from './HeaderV3';
import { useTenantStore } from '../context/TenantStoreContext';
import { Navigate } from 'react-router-dom';

interface LayoutV3Props {
  children: React.ReactNode;
  requireStore?: boolean;
}

const LayoutV3: React.FC<LayoutV3Props> = ({ children, requireStore = true }) => {
  const { isAuthenticated, isLoading, currentStore } = useTenantStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireStore && !currentStore) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderV3 />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Selecione uma loja
            </h2>
            <p className="text-gray-500">
              Use o seletor no cabeçalho para escolher uma loja.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderV3 />
      <main className="p-4">
        {children}
      </main>
    </div>
  );
};

export default LayoutV3;
