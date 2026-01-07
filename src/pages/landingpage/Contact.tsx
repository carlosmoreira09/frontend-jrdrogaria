import React from "react";
import {Button} from "../../components/ui/button.tsx";
import {PhoneCall} from "lucide-react";

export const Contact:React.FC = () => {
    const whatsappNumber = "5522999799945"; // Format: country code + number
    const whatsappMessage = encodeURIComponent("Olá! Gostaria de fazer um pedido.");
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;


    return (
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
)
}