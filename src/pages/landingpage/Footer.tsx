import React from "react";
import logoImage from "../../assets/logo.jpeg";
import {Link} from "react-router-dom";

export const Footer:React.FC = () => {
    return (
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
                        <p className="mt-2 text-gray-400">&copy; {new Date().getFullYear()} JR Drogaria. Todos os
                            direitos
                            reservados.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}