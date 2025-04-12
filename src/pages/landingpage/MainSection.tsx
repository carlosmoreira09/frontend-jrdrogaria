import React from "react";
import {Button} from "../../components/ui/button.tsx";
import {PhoneCall} from "lucide-react";
import logoImage from "../../assets/logo.jpeg";

export const MainSection:React.FC = () => {

    const whatsappNumber = "5522998987184"; // Format: country code + number
    const whatsappMessage = encodeURIComponent("Olá! Gostaria de fazer um pedido.");
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;


    return (
        <section className="py-16 px-4">
            <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-10 md:mb-0">
                    <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">Sua saúde em boas mãos</h2>
                    <p className="text-lg text-gray-700 mb-8">
                        Bem-vindo à JR Drogaria, sua farmácia de confiança em Campos dos Goytacazes.
                        Oferecemos medicamentos, produtos de higiene e beleza com os melhores preços e atendimento de
                        qualidade.
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
    )
}