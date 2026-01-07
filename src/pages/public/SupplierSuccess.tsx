import React from 'react';
import {HeaderQuotation} from "./SupplierQuotationForm.tsx";

const SupplierSuccess: React.FC = () => {
  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-100"
           style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(209 213 219 / 0.4) 1px, transparent 0)', backgroundSize: '24px 24px' }}>
          <HeaderQuotation />
    <div className="p-4 space-y-2 text-center">
      <h1 className="text-xl font-semibold">Cotação enviada</h1>
      <p className="text-sm text-gray-600">Obrigado! Seus preços foram recebidos.</p>
    </div>
      </div>
  );
};

export default SupplierSuccess;
