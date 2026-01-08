/**
 * App Layout v3 - Multi-tenant
 * Layout principal para páginas v3
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import MobileNavV3 from './MobileNavV3';
import { useTenantStore } from '../../context/TenantStoreContext';
import { Navigate } from 'react-router-dom';
import { Toaster } from '../ui/toaster';

const AppLayoutV3: React.FC = () => {
  const { isAuthenticated, isLoading, currentStore } = useTenantStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNavV3 />
      
      <main className="pb-20 md:pb-4 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 4.5rem)' }}>
        {!currentStore ? (
          <div className="flex items-center justify-center h-[calc(100vh-120px)]">
            <div className="text-center bg-white p-8 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Selecione uma loja
              </h2>
              <p className="text-gray-500">
                Use o seletor no cabeçalho para escolher uma loja.
              </p>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      
      <Toaster />
    </div>
  );
};

export default AppLayoutV3;
