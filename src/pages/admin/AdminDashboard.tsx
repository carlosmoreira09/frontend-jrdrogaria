/**
 * Admin Dashboard
 * Métricas e visão geral da plataforma
 */

import React, { useState, useEffect } from 'react';
import { adminDashboardApi } from '../../services/admin/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Building2, FileText, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalTenants: number;
  activeTenants: number;
  trialTenants: number;
  totalUsers: number;
  totalQuotations: number;
  planBreakdown: Record<string, number>;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const response = await adminDashboardApi.getStats();
        if (isMounted) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Tenants',
      value: stats?.totalTenants || 0,
      icon: Building2,
      color: 'bg-blue-500',
    },
    {
      title: 'Tenants Ativos',
      value: stats?.activeTenants || 0,
      icon: TrendingUp,
      color: 'bg-emerald-500',
    },
    {
      title: 'Em Trial',
      value: stats?.trialTenants || 0,
      icon: Users,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Cotações',
      value: stats?.totalQuotations || 0,
      icon: FileText,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-600">Visão geral da plataforma BetterPrice</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`${card.color} p-2 rounded-lg`}>
                <card.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Plano</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.planBreakdown && Object.entries(stats.planBreakdown).map(([plan, count]) => (
                <div key={plan} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      plan === 'free' ? 'bg-gray-400' :
                      plan === 'pro' ? 'bg-emerald-500' :
                      'bg-purple-500'
                    }`} />
                    <span className="capitalize font-medium">{plan}</span>
                  </div>
                  <span className="text-gray-600">{count} tenants</span>
                </div>
              ))}
              {(!stats?.planBreakdown || Object.keys(stats.planBreakdown).length === 0) && (
                <p className="text-gray-500 text-center py-4">Nenhum tenant cadastrado</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Total de Usuários</span>
                <span className="font-semibold">{stats?.totalUsers || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Taxa de Conversão Trial</span>
                <span className="font-semibold">
                  {stats?.totalTenants ? 
                    Math.round((stats.activeTenants / stats.totalTenants) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Cotações por Tenant</span>
                <span className="font-semibold">
                  {stats?.totalTenants ? 
                    Math.round(stats.totalQuotations / stats.totalTenants) : 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
