/**
 * Suppliers v3 - Multi-tenant
 * Lista de fornecedores usando API v3
 */

import React, { useState, useEffect } from 'react';
import { useTenantStore } from '../../context/TenantStoreContext';
import { supplierApiV3 } from '../../services/v3/supplierApi.v3';
import { Supplier } from '../../types/types';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Plus, Search, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';

const SuppliersV3: React.FC = () => {
  const { currentStore } = useTenantStore();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadSuppliers = async () => {
      if (!currentStore) return;

      try {
        setLoading(true);
        const response = await supplierApiV3.list();
        if (isMounted && response?.data) {
          setSuppliers(response.data as Supplier[]);
        }
      } catch (error) {
        console.error('Error loading suppliers:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSuppliers();

    return () => {
      isMounted = false;
    };
  }, [currentStore]);

  const filteredSuppliers = suppliers.filter((s) =>
    s.supplier_name?.toLowerCase().includes(search.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Fornecedores</h1>
          <p className="text-gray-600">
            {suppliers.length} fornecedores cadastrados
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Fornecedor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar fornecedores..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSuppliers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhum fornecedor encontrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">
                      {supplier.supplier_name}
                    </TableCell>
                    <TableCell>{supplier.cnpj || '-'}</TableCell>
                    <TableCell>{supplier.contactName || '-'}</TableCell>
                    <TableCell>{supplier.whatsAppNumber || '-'}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          supplier.status
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {supplier.status ? 'Ativo' : 'Inativo'}
                      </span>
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

export default SuppliersV3;
