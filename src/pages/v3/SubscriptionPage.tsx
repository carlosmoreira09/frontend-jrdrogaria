/**
 * Subscription Page - Visualização e upgrade de plano
 * Cores: emerald + white (CotaRodar Design System)
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../../components/ui/dialog';
import { 
  Check, 
  X, 
  Crown, 
  Zap, 
  Building2, 
  Users, 
  FileText,
  Package,
  Truck,
  MessageSquare,
  Code,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { apiClient } from '../../lib/interceptor';

interface PlanLimits {
  stores: number;
  users: number;
  quotationsPerMonth: number;
  suppliers: number;
  products: number;
  historyDays: number;
  whatsappEnabled: boolean;
  apiEnabled: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
  limits: PlanLimits;
}

interface Usage {
  stores: number;
  users: number;
  suppliers: number;
  products: number;
  quotationsThisMonth: number;
}

interface SubscriptionDetails {
  subscription: {
    id: number;
    plan: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
  };
  limits: PlanLimits;
  usage: Usage;
  price: number;
}

const SubscriptionPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [plansRes, subRes] = await Promise.all([
        apiClient.get('/api/v3/billing/plans'),
        apiClient.get('/api/v3/billing/subscription'),
      ]);
      setPlans(plansRes.data.data);
      setSubscription(subRes.data.data);
    } catch (error) {
      console.error('Error loading subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!selectedPlan) return;
    setUpgrading(true);
    try {
      await apiClient.post('/api/v3/billing/upgrade', { plan: selectedPlan.id });
      await loadData();
      setShowUpgradeModal(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error('Error upgrading plan:', error);
    } finally {
      setUpgrading(false);
    }
  };

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === Infinity) return 0;
    return Math.min((current / limit) * 100, 100);
  };

  const formatLimit = (limit: number) => {
    return limit === Infinity ? 'Ilimitado' : limit.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const currentPlan = subscription?.subscription.plan || 'free';

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assinatura</h1>
        <p className="text-gray-500">Gerencie seu plano e veja o uso dos recursos</p>
      </div>

      {/* Current Plan Card */}
      <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Plano {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</CardTitle>
                <CardDescription>
                  {subscription?.subscription.status === 'active' ? 'Ativo' : 
                   subscription?.subscription.status === 'trialing' ? 'Período de teste' : 
                   subscription?.subscription.status}
                </CardDescription>
              </div>
            </div>
            <Badge className={
              currentPlan === 'enterprise' ? 'bg-purple-100 text-purple-700' :
              currentPlan === 'pro' ? 'bg-emerald-100 text-emerald-700' :
              'bg-gray-100 text-gray-700'
            }>
              {currentPlan === 'free' ? 'Gratuito' : 
               currentPlan === 'pro' ? 'R$ 199/mês' : 
               'R$ 499/mês'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {subscription?.subscription.current_period_end && (
            <p className="text-sm text-gray-500 mb-4">
              Próxima renovação: {new Date(subscription.subscription.current_period_end).toLocaleDateString('pt-BR')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Usage Stats */}
      {subscription && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Uso do Plano</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span>Lojas</span>
                  </div>
                  <span className="font-medium">
                    {subscription.usage.stores} / {formatLimit(subscription.limits.stores)}
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(subscription.usage.stores, subscription.limits.stores)} 
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>Usuários</span>
                  </div>
                  <span className="font-medium">
                    {subscription.usage.users} / {formatLimit(subscription.limits.users)}
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(subscription.usage.users, subscription.limits.users)} 
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-400" />
                    <span>Fornecedores</span>
                  </div>
                  <span className="font-medium">
                    {subscription.usage.suppliers} / {formatLimit(subscription.limits.suppliers)}
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(subscription.usage.suppliers, subscription.limits.suppliers)} 
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span>Produtos</span>
                  </div>
                  <span className="font-medium">
                    {subscription.usage.products} / {formatLimit(subscription.limits.products)}
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(subscription.usage.products, subscription.limits.products)} 
                  className="h-2"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span>Cotações este mês</span>
                  </div>
                  <span className="font-medium">
                    {subscription.usage.quotationsThisMonth} / {formatLimit(subscription.limits.quotationsPerMonth)}
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(subscription.usage.quotationsThisMonth, subscription.limits.quotationsPerMonth)} 
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans Comparison */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Planos Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = plan.id === currentPlan;
            const isPro = plan.id === 'pro';
            
            return (
              <Card 
                key={plan.id} 
                className={`relative ${isPro ? 'border-emerald-500 border-2' : ''} ${isCurrentPlan ? 'bg-gray-50' : 'bg-white'}`}
              >
                {isPro && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-emerald-500 text-white">
                      <Zap className="h-3 w-3 mr-1" />
                      Mais popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-gray-900">
                      {plan.price === 0 ? 'Grátis' : `R$ ${(plan.price / 100).toFixed(0)}`}
                    </span>
                    {plan.price > 0 && <span className="text-gray-500">/mês</span>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>{formatLimit(plan.limits.stores)} {plan.limits.stores === 1 ? 'loja' : 'lojas'}</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>{formatLimit(plan.limits.users)} usuários</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>{formatLimit(plan.limits.quotationsPerMonth)} cotações/mês</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>{formatLimit(plan.limits.suppliers)} fornecedores</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>{formatLimit(plan.limits.products)} produtos</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      {plan.limits.whatsappEnabled ? (
                        <>
                          <MessageSquare className="h-4 w-4 text-emerald-500" />
                          <span>WhatsApp integrado</span>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 text-gray-300" />
                          <span className="text-gray-400">WhatsApp integrado</span>
                        </>
                      )}
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      {plan.limits.apiEnabled ? (
                        <>
                          <Code className="h-4 w-4 text-emerald-500" />
                          <span>Acesso à API</span>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 text-gray-300" />
                          <span className="text-gray-400">Acesso à API</span>
                        </>
                      )}
                    </li>
                  </ul>

                  <Button
                    className={`w-full ${
                      isCurrentPlan 
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : isPro
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    disabled={isCurrentPlan}
                    onClick={() => {
                      setSelectedPlan(plan);
                      setShowUpgradeModal(true);
                    }}
                  >
                    {isCurrentPlan ? (
                      'Plano atual'
                    ) : (
                      <>
                        {plan.price > (subscription?.price || 0) ? 'Fazer upgrade' : 'Selecionar'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar alteração de plano</DialogTitle>
            <DialogDescription>
              Você está prestes a mudar para o plano {selectedPlan?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="py-4">
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Plano {selectedPlan.name}</span>
                  <span className="text-lg font-bold text-emerald-600">
                    {selectedPlan.price === 0 ? 'Grátis' : `R$ ${(selectedPlan.price / 100).toFixed(2)}/mês`}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  A alteração terá efeito imediato. Seus novos limites serão aplicados automaticamente.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpgradeModal(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleUpgrade} 
              disabled={upgrading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {upgrading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                'Confirmar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPage;
