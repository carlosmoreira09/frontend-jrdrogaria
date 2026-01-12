/**
 * CotaRodar Landing Page
 * Landing page moderna para plataforma SaaS de cotações B2B
 * Cores: emerald + white (CotaRodar Design System)
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import {
  FileText,
  Users,
  TrendingDown,
  Clock,
  Shield,
  Zap,
  Check,
  ArrowRight,
  Building2,
  Star,
} from 'lucide-react';

const CotaRodarLanding: React.FC = () => {
  const features = [
    {
      icon: FileText,
      title: 'Cotações Simplificadas',
      description: 'Envie cotações para múltiplos fornecedores com apenas alguns cliques.',
    },
    {
      icon: Users,
      title: 'Multi-fornecedor',
      description: 'Compare preços de vários fornecedores lado a lado automaticamente.',
    },
    {
      icon: TrendingDown,
      title: 'Economize Mais',
      description: 'Reduza custos identificando as melhores ofertas em segundos.',
    },
    {
      icon: Clock,
      title: 'Ganhe Tempo',
      description: 'Automatize processos manuais e foque no que importa.',
    },
    {
      icon: Shield,
      title: 'Seguro e Confiável',
      description: 'Seus dados protegidos com criptografia de ponta.',
    },
    {
      icon: Building2,
      title: 'Multi-loja',
      description: 'Gerencie cotações de múltiplas unidades em um só lugar.',
    },
  ];

  const plans = [
    {
      name: 'Free',
      price: 'R$ 0',
      period: '/mês',
      description: 'Perfeito para começar',
      features: ['1 loja', '2 usuários', '10 cotações/mês', '5 fornecedores'],
      cta: 'Começar Grátis',
      popular: false,
    },
    {
      name: 'Pro',
      price: 'R$ 199',
      period: '/mês',
      description: 'Para empresas em crescimento',
      features: ['5 lojas', '10 usuários', '100 cotações/mês', '50 fornecedores', 'WhatsApp integrado', 'Suporte prioritário'],
      cta: 'Assinar Pro',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'R$ 499',
      period: '/mês',
      description: 'Para grandes operações',
      features: ['Lojas ilimitadas', 'Usuários ilimitados', 'Cotações ilimitadas', 'Fornecedores ilimitados', 'API completa', 'Suporte dedicado'],
      cta: 'Falar com Vendas',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CotaRodar</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/v3/login" className="text-gray-600 hover:text-emerald-600 font-medium hidden sm:block">
              Entrar
            </Link>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link to="/v3/login">
                Começar Grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="h-4 w-4" />
            Plataforma #1 em cotações B2B
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Cotações que <span className="text-emerald-600">rodam</span>,<br />
            preços que <span className="text-emerald-600">fecham</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Simplifique suas cotações com fornecedores. Compare preços, 
            economize tempo e reduza custos com a plataforma mais completa do mercado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8">
              <Link to="/v3/login">
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-lg px-8">
              <a href="#demo">Ver Demonstração</a>
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            ✓ Sem cartão de crédito &nbsp;&nbsp; ✓ Setup em 2 minutos &nbsp;&nbsp; ✓ Cancele quando quiser
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-emerald-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <p className="text-4xl font-bold">500+</p>
              <p className="text-emerald-100">Empresas ativas</p>
            </div>
            <div>
              <p className="text-4xl font-bold">50k+</p>
              <p className="text-emerald-100">Cotações/mês</p>
            </div>
            <div>
              <p className="text-4xl font-bold">25%</p>
              <p className="text-emerald-100">Economia média</p>
            </div>
            <div>
              <p className="text-4xl font-bold">4.9★</p>
              <p className="text-emerald-100">Avaliação</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4" id="features">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para cotações eficientes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ferramentas poderosas para transformar seu processo de compras
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-gray-50" id="demo">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Como funciona
            </h2>
            <p className="text-xl text-gray-600">Em apenas 3 passos simples</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Crie sua cotação', desc: 'Adicione os produtos que precisa cotar' },
              { step: '2', title: 'Envie aos fornecedores', desc: 'Com um clique, envie para múltiplos fornecedores' },
              { step: '3', title: 'Compare e decida', desc: 'Veja todas as propostas lado a lado e escolha a melhor' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4" id="pricing">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Planos para todos os tamanhos
            </h2>
            <p className="text-xl text-gray-600">Comece grátis, escale quando precisar</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? 'border-emerald-500 border-2 shadow-xl' : 'border-gray-200'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Mais popular
                    </span>
                  </div>
                )}
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8 text-left">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-emerald-500" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    asChild 
                    className={`w-full ${plan.popular ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    <Link to="/v3/login">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-emerald-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para economizar nas suas compras?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Junte-se a mais de 500 empresas que já economizam com o CotaRodar
          </p>
          <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 text-lg px-8">
            <Link to="/v3/login">
              Criar Conta Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">CotaRodar</span>
              </div>
              <p className="text-gray-400 text-sm">
                Cotações que rodam, preços que fecham.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-white">Funcionalidades</a></li>
                <li><a href="#pricing" className="hover:text-white">Preços</a></li>
                <li><a href="#demo" className="hover:text-white">Demonstração</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Sobre nós</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Termos de uso</a></li>
                <li><a href="#" className="hover:text-white">Privacidade</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2026 CotaRodar. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CotaRodarLanding;
