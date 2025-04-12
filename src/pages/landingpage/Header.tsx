import React from "react";
import logoImage from "../../assets/logo.jpeg";
import {Button} from "../../components/ui/button.tsx";
import {LogIn, PhoneCall} from "lucide-react";
import {Link} from "react-router-dom";

export const Header:React.FC = () => {

    const whatsappNumber = "5522998987184"; // Format: country code + number
    const whatsappMessage = encodeURIComponent("Olá! Gostaria de fazer um pedido.");
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;


    return (
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
    )
}