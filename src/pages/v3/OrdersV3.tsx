/**
 * Orders v3 - Multi-tenant
 * Lista de pedidos usando API v3
 */

import React, { useState, useEffect } from 'react';
import { useTenantStore } from '../../context/TenantStoreContext';
import { orderApiV3 } from '../../services/v3/orderApi.v3';
import { PurchaseOrderV3 } from '../../types/order.v3';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ShoppingCart, Eye, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  confirmed: 'bg-blue-100 text-blue-700',
  sent: 'bg-yellow-100 text-yellow-700',
  delivered: 'bg-green-100 text-green-700',
};

const statusLabels: Record<string, string> = {
  draft: 'Rascunho',
  confirmed: 'Confirmado',
  sent: 'Enviado',
  delivered: 'Entregue',
};

const OrdersV3: React.FC = () => {
  const { currentStore } = useTenantStore();
  const [orders, setOrders] = useState<PurchaseOrderV3[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      if (!currentStore) return;

      try {
        setLoading(true);
        const data = await orderApiV3.list();
        if (isMounted) {
          setOrders(data || []);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [currentStore]);

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleExport = async (orderId: number) => {
    try {
      const blob = await orderApiV3.export(orderId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pedido_${orderId}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting order:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-600">{orders.length} pedidos</p>
        </div>
      </div>

      <Card>
        <CardHeader />
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhum pedido encontrado</p>
              <p className="text-gray-400 text-sm mt-2">
                Gere pedidos a partir de cotações finalizadas
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      {order.supplier?.supplier_name || '-'}
                    </TableCell>
                    <TableCell>{order.items?.length || 0}</TableCell>
                    <TableCell>{formatCurrency(order.totalValue)}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status] || ''}>
                        {statusLabels[order.status] || order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(order.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link to={`/v3/orders/${order.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExport(order.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersV3;
