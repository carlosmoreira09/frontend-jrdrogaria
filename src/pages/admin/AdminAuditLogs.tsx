/**
 * Admin Audit Logs
 * Logs de auditoria das ações dos admins
 */

import React, { useState, useEffect } from 'react';
import { adminAuditApi } from '../../services/admin/adminApi';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Search, FileText } from 'lucide-react';

interface AuditLog {
  id: number;
  action: string;
  details: Record<string, any>;
  ip_address: string;
  created_at: string;
  admin_user: { name: string; email: string };
  tenant?: { name: string };
}

const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const loadLogs = async () => {
      try {
        setLoading(true);
        const response = await adminAuditApi.list({
          action: search || undefined,
          page,
          limit: 50,
        });
        if (isMounted) {
          setLogs(response.data || []);
          setTotalPages(response.totalPages || 1);
        }
      } catch (error) {
        console.error('Error loading logs:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadLogs();

    return () => {
      isMounted = false;
    };
  }, [search, page]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  const formatAction = (action: string) => {
    const actions: Record<string, string> = {
      'tenant.create': 'Criou tenant',
      'tenant.status_change': 'Alterou status',
      'tenant.plan_change': 'Alterou plano',
      'admin.create': 'Criou admin',
      'admin.login': 'Login',
    };
    return actions[action] || action;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Logs de Auditoria</h1>
        <p className="text-gray-600">Histórico de ações dos administradores</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Filtrar por ação..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhum log encontrado</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Detalhes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(log.created_at)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{log.admin_user?.name}</p>
                          <p className="text-xs text-gray-500">{log.admin_user?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatAction(log.action)}
                      </TableCell>
                      <TableCell>{log.tenant?.name || '-'}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {log.details ? (
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {JSON.stringify(log.details).substring(0, 50)}...
                          </code>
                        ) : '-'}
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

export default AdminAuditLogs;
