/**
 * Error 401 - Acesso não autorizado
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ShieldX, ArrowLeft } from 'lucide-react';

const Error401: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <ShieldX className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">401</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Acesso Não Autorizado</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Você não tem permissão para acessar esta página. 
          Por favor, faça login com uma conta autorizada.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao início
            </Link>
          </Button>
          <Button asChild className="bg-green-700 hover:bg-green-800">
            <Link to="/login">
              Fazer Login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Error401;
