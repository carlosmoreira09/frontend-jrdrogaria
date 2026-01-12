/**
 * Admin Create Tenant
 * Formulário para criar novo tenant
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminTenantsApi } from '../../services/admin/adminApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { ArrowLeft, Building2, Loader2 } from 'lucide-react';

const AdminCreateTenant: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    plan: 'free',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
    storeName: '',
    storeCode: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'name' && !formData.slug) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminTenantsApi.create(formData);
      navigate('/admin/tenants');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar tenant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/tenants')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle>Novo Tenant</CardTitle>
              <CardDescription>Cadastre um novo cliente na plataforma</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 border-b pb-2">Dados do Tenant</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Empresa *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Ex: Supermercado ABC"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL) *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    placeholder="Ex: supermercado-abc"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    URL: {formData.slug || 'slug'}.cotarodar.com
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan">Plano *</Label>
                <Select value={formData.plan} onValueChange={(v) => handleChange('plan', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free - Gratuito</SelectItem>
                    <SelectItem value="pro">Pro - R$ 99/mês</SelectItem>
                    <SelectItem value="enterprise">Enterprise - Sob consulta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 border-b pb-2">Proprietário (Owner)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Nome Completo *</Label>
                  <Input
                    id="ownerName"
                    value={formData.ownerName}
                    onChange={(e) => handleChange('ownerName', e.target.value)}
                    placeholder="Nome do responsável"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ownerEmail">Email *</Label>
                  <Input
                    id="ownerEmail"
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => handleChange('ownerEmail', e.target.value)}
                    placeholder="email@empresa.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerPassword">Senha Inicial *</Label>
                <Input
                  id="ownerPassword"
                  type="password"
                  value={formData.ownerPassword}
                  onChange={(e) => handleChange('ownerPassword', e.target.value)}
                  placeholder="Senha inicial do owner"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500">Mínimo 6 caracteres</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 border-b pb-2">Primeira Loja</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nome da Loja *</Label>
                  <Input
                    id="storeName"
                    value={formData.storeName}
                    onChange={(e) => handleChange('storeName', e.target.value)}
                    placeholder="Ex: Matriz"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="storeCode">Código (opcional)</Label>
                  <Input
                    id="storeCode"
                    value={formData.storeCode}
                    onChange={(e) => handleChange('storeCode', e.target.value)}
                    placeholder="Ex: MTZ"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/tenants')}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Tenant'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCreateTenant;
