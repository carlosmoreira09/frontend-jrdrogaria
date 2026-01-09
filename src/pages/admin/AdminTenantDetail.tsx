/**
 * Admin Tenant Detail
 * Detalhes e ações do tenant
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminTenantsApi } from '../../services/admin/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ArrowLeft, Building2, Users, Store, FileText, AlertTriangle, Key } from 'lucide-react';

interface TenantDetail {
  id: number;
  name: string;
  slug: string;
  status: string;
  plan: string;
  storesCount: number;
  usersCount: number;
  quotationCount: number;
  stores?: { id: number; name: string; code: string; status: string }[];
  users?: { id: number; fullName: string; email: string; role: string }[];
  created_at: string;
}

const AdminTenantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<TenantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newPlan, setNewPlan] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadTenant = async () => {
      if (!id) return;
      try {
        const response = await adminTenantsApi.get(parseInt(id));
        if (isMounted) {
          setTenant(response.data);
        }
      } catch (error) {
        console.error('Error loading tenant:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTenant();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleStatusChange = async () => {
    if (!tenant || !newStatus) return;
    setSaving(true);
    try {
      await adminTenantsApi.updateStatus(tenant.id, newStatus, reason);
      setTenant({ ...tenant, status: newStatus });
      setShowStatusModal(false);
      setReason('');
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePlanChange = async () => {
    if (!tenant || !newPlan) return;
    setSaving(true);
    try {
      await adminTenantsApi.updatePlan(tenant.id, newPlan, reason);
      setTenant({ ...tenant, plan: newPlan });
      setShowPlanModal(false);
      setReason('');
    } catch (error) {
      console.error('Error updating plan:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!tenant || !newPassword || newPassword.length < 6) return;
    setSaving(true);
    try {
      await adminTenantsApi.resetOwnerPassword(tenant.id, newPassword);
      setShowPasswordModal(false);
      setNewPassword('');
      alert('Senha resetada com sucesso!');
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Erro ao resetar senha');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">Tenant não encontrado</p>
      </div>
    );
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/tenants')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{tenant.name}</h1>
          <p className="text-gray-500">{tenant.slug}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={statusColors[tenant.status]}>
                    {tenant.status === 'active' ? 'Ativo' :
                     tenant.status === 'trial' ? 'Trial' :
                     tenant.status === 'suspended' ? 'Suspenso' : 'Cancelado'}
                  </Badge>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-emerald-600"
                    onClick={() => {
                      setNewStatus(tenant.status);
                      setShowStatusModal(true);
                    }}
                  >
                    Alterar
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Plano</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={planColors[tenant.plan]}>
                    {tenant.plan.toUpperCase()}
                  </Badge>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-emerald-600"
                    onClick={() => {
                      setNewPlan(tenant.plan);
                      setShowPlanModal(true);
                    }}
                  >
                    Alterar
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Criado em</p>
                <p className="font-medium">{new Date(tenant.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Stores</span>
              </div>
              <span className="font-semibold">{tenant.storesCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Usuários</span>
              </div>
              <span className="font-semibold">{tenant.usersCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Cotações</span>
              </div>
              <span className="font-semibold">{tenant.quotationCount}</span>
            </div>
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-amber-600 border-amber-300 hover:bg-amber-50"
                onClick={() => setShowPasswordModal(true)}
              >
                <Key className="h-4 w-4 mr-2" />
                Resetar Senha Owner
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {tenant.stores && tenant.stores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Stores ({tenant.stores.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tenant.stores.map((store) => (
                <div key={store.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">{store.name}</p>
                      <p className="text-sm text-gray-500">{store.code}</p>
                    </div>
                  </div>
                  <Badge className={store.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}>
                    {store.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="suspended">Suspenso</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Motivo da alteração (opcional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleStatusChange} disabled={saving}>
              {saving ? 'Salvando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPlanModal} onOpenChange={setShowPlanModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Plano</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={newPlan} onValueChange={setNewPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Motivo da alteração (opcional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPlanModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handlePlanChange} disabled={saving}>
              {saving ? 'Salvando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resetar Senha do Owner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
              A nova senha será aplicada ao proprietário do tenant. Ele receberá instruções por email.
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handlePasswordReset} 
              disabled={saving || newPassword.length < 6}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {saving ? 'Resetando...' : 'Resetar Senha'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTenantDetail;
