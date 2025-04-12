import React from "react";
import { Link } from "react-router-dom";
import logoImage from "../assets/logo.jpeg";
import { Button } from "../components/ui/button.tsx";
import { PhoneCall, LogIn } from "lucide-react";

const LandingPage: React.FC = () => {
  // WhatsApp number - replace with the actual number
  const whatsappNumber = "5522999999999"; // Format: country code + number
  const whatsappMessage = encodeURIComponent("Olá! Gostaria de mais informações sobre a JR Drogaria.");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
      <div className="h-screen bg-gradient-to-b from-green-50 to-green-100">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="hidden ml-4 sm:flex items-center">
              <img src={logoImage} alt="JR Drogaria Logo" className="h-16 w-auto"/>
              <h1 className="text-2xl font-bold text-green-800">JR Drogaria</h1>
            </div>
            <div className="flex space-x-4">
              <Button
                  asChild
                  variant="outline"
                  className="border-green-800 text-green-800 hover:bg-green-800 hover:text-white"
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <PhoneCall className="mr-2 h-4 w-4"/>
                  Contato
                </a>
              </Button>
              <Button
                  asChild
                  className="bg-green-800 text-white hover:bg-green-900"
              >
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4"/>
                  Área Restrita
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">Sua saúde em boas mãos</h2>
              <p className="text-lg text-gray-700 mb-8">
                Bem-vindo à JR Drogaria, sua farmácia de confiança em Campos dos Goytacazes.
                Oferecemos medicamentos, produtos de higiene e beleza com os melhores preços e atendimento de qualidade.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    asChild
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6"
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <PhoneCall className="mr-2 h-5 w-5"/>
                    Fale Conosco pelo WhatsApp
                  </a>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                  src={logoImage}
                  alt="JR Drogaria"
                  className="rounded-lg shadow-2xl max-w-full h-auto"
                  style={{maxHeight: '400px'}}
              />
            </div>
          </div>
        </section>

        {/* Features Section - Condensed for mobile */}
        <section className="py-4 px-3 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-xl md:text-2xl font-bold text-center text-green-800 mb-4">Nossos Diferenciais</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-green-50 p-3 rounded-lg shadow-md">
                <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-center mb-1">Qualidade Garantida</h3>
                <p className="text-gray-600 text-center text-xs md:text-sm">
                  Produtos de qualidade e dentro do prazo de validade.
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg shadow-md">
                <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-center mb-1">Melhores Preços</h3>
                <p className="text-gray-600 text-center text-xs md:text-sm">
                  Preços competitivos e promoções especiais.
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg shadow-md">
                <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-center mb-1">Atendimento Personalizado</h3>
                <p className="text-gray-600 text-center text-xs md:text-sm">
                  Equipe pronta para oferecer o melhor atendimento.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4 bg-green-800 text-white">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-bold mb-8">Entre em Contato</h2>
            <p className="text-xl mb-8">Estamos prontos para atender você!</p>
            <Button
                asChild
                size="lg"
                className="bg-white text-green-800 hover:bg-gray-100 font-bold py-3 px-8"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <PhoneCall className="mr-2 h-5 w-5"/>
                Fale Conosco pelo WhatsApp
              </a>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-10 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center">
                  <img src={logoImage} alt="JR Drogaria Logo" className="h-10 w-auto"/>
                  <h3 className="ml-3 text-xl font-bold">JR Drogaria</h3>
                </div>
                <p className="mt-2 text-gray-400">Sua saúde é nossa prioridade</p>
              </div>
              <div className="text-center md:text-right">
                <p>Campos dos Goytacazes, RJ</p>
                <p className="mt-2">
                  <Link to="/login" className="text-green-400 hover:text-green-300">Área Restrita</Link>
                </p>
                <p className="mt-2 text-gray-400">&copy; {new Date().getFullYear()} JR Drogaria. Todos os direitos
                  reservados.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
};

export default LandingPage;
