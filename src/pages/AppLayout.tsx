import React, {useEffect} from "react";
import { Outlet } from "react-router-dom";
import SidebarMenu from "../components/Sidemenu.tsx";
import Header from "../components/Header.tsx";
import { Toaster } from "../components/ui/toaster"

const AppLayout: React.FC = () => {
    useEffect(() => {
        // Função para prevenir o comportamento de pull-to-refresh
        const preventPullToRefresh = (e: TouchEvent) => {
            // Previne o comportamento padrão em todos os casos
            e.preventDefault();
        }

        // Adiciona event listeners para diferentes eventos de toque
        document.addEventListener("touchstart", preventPullToRefresh, { passive: false });
        document.addEventListener("touchmove", preventPullToRefresh, { passive: false });

        // Aplica estilos CSS para prevenir overscroll
        document.body.style.overscrollBehavior = "none";
        
        // Remove os event listeners e estilos quando o componente é desmontado
        return () => {
            document.removeEventListener("touchstart", preventPullToRefresh);
            document.removeEventListener("touchmove", preventPullToRefresh);
            document.body.style.overscrollBehavior = "";
        }
    }, [])
    return (
            <div className="overflow-x-hidden">
            <div className="fixed top-0 w-full z-40">
                <Header/>
            </div>
            <div className="flex h-screen">
                <div className="fixed mt-16">
                    <SidebarMenu/>
                </div>
                <div className="flex-1 ml-64 mt-18 p-4">
                    <Outlet/>
                    <Toaster/>
                </div>
            </div>
            </div>
)
    ;
}

export default AppLayout;