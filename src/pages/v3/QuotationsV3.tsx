/**
 * Quotations v3 - Multi-tenant
 * Lista de cotações usando API v3
 */

import React, { useState, useEffect } from 'react';
import { useTenantStore } from '../../context/TenantStoreContext';
import { quotationApiV3 } from '../../services/v3/quotationApi.v3';
import { QuotationRequest } from '../../types/quotation';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus, FileText, Eye } from 'lucide-react';
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
  open: 'bg-blue-100 text-blue-700',
  closed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  draft: 'Rascunho',
  open: 'Aberta',
  closed: 'Fechada',
  cancelled: 'Cancelada',
};

const QuotationsV3: React.FC = () => {
  const { currentStore } = useTenantStore();
  const [quotations, setQuotations] = useState<QuotationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadQuotations = async () => {
      if (!currentStore) return;

      try {
        setLoading(true);
        const data = await quotationApiV3.list();
        if (isMounted) {
          setQuotations(data || []);
        }
      } catch (error) {
        console.error('Error loading quotations:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadQuotations();

    return () => {
      isMounted = false;
    };
  }, [currentStore]);

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
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
          <h1 className="text-2xl font-bold text-gray-900">Cotações</h1>
          <p className="text-gray-600">{quotations.length} cotações</p>
        </div>
        <Link to="/v3/quotations/create">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova Cotação
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader />
        <CardContent>
          {quotations.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhuma cotação encontrada</p>
              <Link to="/v3/quotations/create">
                <Button variant="outline" className="mt-4">
                  Criar primeira cotação
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Fornecedores</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead>Criada em</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotations.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-medium">
                      {quotation.name}
                    </TableCell>
                    <TableCell>{quotation.items?.length || 0}</TableCell>
                    <TableCell>
                      {quotation.supplierQuotations?.length || 0}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[quotation.status] || ''}>
                        {statusLabels[quotation.status] || quotation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(quotation.deadline)}</TableCell>
                    <TableCell>{formatDate(quotation.created_at)}</TableCell>
                    <TableCell>
                      <Link to={`/v3/quotations/${quotation.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
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

export default QuotationsV3;
