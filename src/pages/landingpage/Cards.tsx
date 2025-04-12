import React from "react";

export const Cards:React.FC = () => {
    return (
        <section className="py-4 px-3 bg-white">
            <div className="container mx-auto max-w-6xl">
                <h2 className="text-xl md:text-2xl font-bold text-center text-green-800 mb-4">Nossos Diferenciais</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-green-50 p-3 rounded-lg shadow-md">
                        <div
                            className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center mb-2 mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                            </svg>
                        </div>
                        <h3 className="text-base font-semibold text-center mb-1">Qualidade Garantida</h3>
                        <p className="text-gray-600 text-center text-xs md:text-sm">
                            Produtos de qualidade e dentro do prazo de validade.
                        </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg shadow-md">
                        <div
                            className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center mb-2 mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <h3 className="text-base font-semibold text-center mb-1">Melhores Preços</h3>
                        <p className="text-gray-600 text-center text-xs md:text-sm">
                            Preços competitivos e promoções especiais.
                        </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg shadow-md">
                        <div
                            className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center mb-2 mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
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
    )
}