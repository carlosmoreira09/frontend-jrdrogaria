/**
 * Home v3 - Multi-tenant Dashboard
 */

import React from 'react';
import { useTenantStore } from '../../context/TenantStoreContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Package, Users, FileText, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomeV3: React.FC = () => {
  const { tenantName, currentStore } = useTenantStore();

  const cards = [
    {
      title: 'Produtos',
      description: 'Gerenciar produtos',
      icon: Package,
      href: '/v3/products',
      color: 'bg-blue-500',
    },
    {
      title: 'Fornecedores',
      description: 'Gerenciar fornecedores',
      icon: Users,
      href: '/v3/suppliers',
      color: 'bg-green-500',
    },
    {
      title: 'Cotações',
      description: 'Criar e gerenciar cotações',
      icon: FileText,
      href: '/v3/quotations',
      color: 'bg-purple-500',
    },
    {
      title: 'Pedidos',
      description: 'Acompanhar pedidos',
      icon: ShoppingCart,
      href: '/v3/orders',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">
          Bem-vindo ao {tenantName}
        </h1>
        <p className="text-gray-600">
          Loja atual: <span className="font-medium">{currentStore?.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link key={card.title} to={card.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`${card.color} p-2 rounded-lg`}>
                  <card.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">{card.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Loja</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Código:</span>{' '}
              <span className="font-medium">{currentStore?.code}</span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>{' '}
              <span className="font-medium capitalize">{currentStore?.status}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeV3;
