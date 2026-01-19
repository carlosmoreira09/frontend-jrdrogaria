/**
 * JR Drogaria Landing Page
 * Landing page focada na farmácia para SEO e divulgação
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import SEO from '../../components/SEO';
import {
  Heart,
  Clock,
  MapPin,
  Phone,
  Pill,
  Sparkles,
  Shield,
  Truck,
  Users,
  TrendingDown,
} from 'lucide-react';
import logoImg from '../../assets/logo.jpeg';

const JRDrogariaLanding: React.FC = () => {
  const services = [
    {
      icon: Pill,
      title: 'Medicamentos',
      description: 'Ampla variedade de medicamentos genéricos, similares e de referência.',
    },
    {
      icon: Sparkles,
      title: 'Beleza e Higiene',
      description: 'Produtos de cuidados pessoais, cosméticos e higiene das melhores marcas.',
    },
    {
      icon: Heart,
      title: 'Saúde e Bem-estar',
      description: 'Vitaminas, suplementos e produtos para sua saúde e qualidade de vida.',
    },
    {
      icon: Shield,
      title: 'Produtos Hospitalares',
      description: 'Materiais e equipamentos para cuidados médicos e hospitalares.',
    },
  ];

  const benefits = [
    {
      icon: TrendingDown,
      title: 'Melhores Preços',
      description: 'Preços competitivos e promoções exclusivas para você economizar.',
    },
    {
      icon: Truck,
      title: 'Entrega Rápida',
      description: 'Entregamos seus pedidos com agilidade e segurança.',
    },
    {
      icon: Users,
      title: 'Atendimento Humanizado',
      description: 'Equipe treinada e pronta para ajudar você.',
    },
    {
      icon: Clock,
      title: 'Horário Estendido',
      description: 'Funcionamos em horários convenientes para você.',
    },
  ];

  const WHATSAPP_NUMBER = '5522999799945';
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
  const PHONE_DISPLAY = '(22) 99979-9945';

  const stores = [
    {
      name: 'Princesa Isabel',
    },
    {
      name: 'Rodoviária',
    },
    {
      name: 'Barão de Amazonas',
    },
    {
      name: 'Lebret',
    },
  ];

  return (
    <>
      <SEO
        title="JR Drogaria - Sua Farmácia de Confiança"
        description="JR Drogaria - Farmácia com os melhores preços em medicamentos, produtos de higiene, beleza e saúde. Atendimento de qualidade, entrega rápida e várias unidades para melhor atendê-lo."
        keywords="farmácia, drogaria, medicamentos, remédios, saúde, beleza, higiene, JR Drogaria, farmácia perto de mim, comprar remédio, produtos farmacêuticos"
        url="/"
      />
      
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="JR Drogaria" className="h-12 w-auto rounded-lg" />
              <div>
                <span className="text-xl font-bold text-emerald-700">JR Drogaria</span>
                <p className="text-xs text-gray-500">O Melhor Para Você</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 text-emerald-600">
                <Phone className="h-4 w-4" />
                <span className="font-medium">{PHONE_DISPLAY}</span>
              </a>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Link to="/login">
                  Área do Cliente
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-emerald-50 to-white">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Heart className="h-4 w-4" />
                  Sua saúde em primeiro lugar
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  <span className="text-emerald-600">JR Drogaria</span><br />
                  O Melhor Para Você
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Há mais de 10 anos cuidando da saúde da sua família com 
                  <strong> os melhores preços</strong>, <strong>atendimento de qualidade</strong> e 
                  <strong> entrega rápida</strong>.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8">
                    <a href="#lojas">
                      Encontre uma Loja
                      <MapPin className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-lg px-8">
                    <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                      <Phone className="mr-2 h-5 w-5" />
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src={logoImg} 
                  alt="JR Drogaria - Farmácia de Confiança" 
                  className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-emerald-600">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              <div>
                <div className="text-4xl font-bold mb-2">10+</div>
                <div className="text-emerald-100">Anos de experiência</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">4</div>
                <div className="text-emerald-100">Unidades</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">5000+</div>
                <div className="text-emerald-100">Produtos</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50k+</div>
                <div className="text-emerald-100">Clientes atendidos</div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 px-4 bg-gray-50" id="servicos">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Tudo que você precisa em um só lugar
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Oferecemos uma ampla variedade de produtos para cuidar da sua saúde e bem-estar.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <service.icon className="h-7 w-7 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Por que escolher a JR Drogaria?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Compromisso com sua saúde e satisfação.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stores Section */}
        <section className="py-20 px-4 bg-emerald-50" id="lojas">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nossas Lojas
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Encontre a unidade mais próxima de você.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stores.map((store, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-4">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{store.name}</h3>
                    <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-600 font-medium">
                      <Phone className="h-4 w-4" />
                    </a>
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
              Cuide da sua saúde com a JR Drogaria
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              Visite uma de nossas lojas ou entre em contato. Estamos prontos para atendê-lo!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-8">
                <a href="#lojas">
                  <MapPin className="mr-2 h-5 w-5" />
                  Encontrar Loja
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-emerald-700 text-lg px-8">
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                  <Phone className="mr-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img src={logoImg} alt="JR Drogaria" className="h-10 w-auto rounded-lg" />
                  <div>
                    <span className="text-lg font-bold">JR Drogaria</span>
                    <p className="text-xs text-gray-400">O Melhor Para Você</p>
                  </div>
                </div>
                <p className="text-gray-400">
                  Sua farmácia de confiança há mais de 10 anos cuidando da saúde da sua família.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contato</h4>
                <div className="space-y-2 text-gray-400">
                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-emerald-400">
                    <Phone className="h-4 w-4" />
                  </a>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                   Av. Princesa Isabel, 193
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Horário de Funcionamento</h4>
                <div className="space-y-1 text-gray-400">
                  <p>Segunda a Sexta: 7h às 22h</p>
                  <p>Sábado: 8h às 20h</p>
                  <p>Domingo: 8h às 18h</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
              <p>© {new Date().getFullYear()} JR Drogaria. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default JRDrogariaLanding;
