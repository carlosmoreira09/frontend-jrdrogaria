/**
 * Admin Tenants List
 * Lista de tenants com filtros e ações
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminTenantsApi } from '../../services/admin/adminApi';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Search, Plus, Eye, Building2 } from 'lucide-react';

interface Tenant {
  id: number;
  name: string;
  slug: string;
  status: string;
  plan: string;
  storesCount: number;
  usersCount: number;
  created_at: string;
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  trial: 'bg-yellow-100 text-yellow-700',
  suspended: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-700',
};

const planColors: Record<string, string> = {
  free: 'bg-gray-100 text-gray-700',
  pro: 'bg-blue-100 text-blue-700',
  enterprise: 'bg-purple-100 text-purple-700',
};

const AdminTenants: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [planFilter, setPlanFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const loadTenants = async () => {
      try {
        setLoading(true);
        const response = await adminTenantsApi.list({
          search: search || undefined,
          status: statusFilter || undefined,
          plan: planFilter || undefined,
          page,
          limit: 20,
        });
        if (isMounted) {
          setTenants(response.data || []);
          setTotalPages(response.totalPages || 1);
        }
      } catch (error) {
        console.error('Error loading tenants:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTenants();

    return () => {
      isMounted = false;
    };
  }, [search, statusFilter, planFilter, page]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
          <p className="text-gray-600">Gerenciamento de clientes da plataforma</p>
        </div>
        <Link to="/admin/tenants/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Novo Tenant
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Todos</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="suspended">Suspenso</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Todos</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : tenants.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhum tenant encontrado</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Stores</TableHead>
                    <TableHead>Usuários</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell className="font-medium">{tenant.name}</TableCell>
                      <TableCell className="text-gray-500">{tenant.slug}</TableCell>
                      <TableCell>
                        <Badge className={planColors[tenant.plan] || ''}>
                          {tenant.plan.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[tenant.status] || ''}>
                          {tenant.status === 'active' ? 'Ativo' :
                           tenant.status === 'trial' ? 'Trial' :
                           tenant.status === 'suspended' ? 'Suspenso' : 'Cancelado'}
                        </Badge>
                      </TableCell>
                      <TableCell>{tenant.storesCount}</TableCell>
                      <TableCell>{tenant.usersCount}</TableCell>
                      <TableCell>{formatDate(tenant.created_at)}</TableCell>
                      <TableCell>
                        <Link to={`/admin/tenants/${tenant.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Anterior
                  </Button>
                  <span className="py-2 px-4 text-sm text-gray-600">
                    Página {page} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Próximo
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTenants;
