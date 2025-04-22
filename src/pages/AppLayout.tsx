import React, {useEffect, useState} from "react";
import { Outlet } from "react-router-dom";
import SidebarMenu from "../components/Sidemenu.tsx";
import { Toaster } from "../components/ui/toaster"

const AppLayout: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

    useEffect(() => {
        // Check if device is mobile/tablet
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024); // 1024px is typical tablet breakpoint
        };
        
        // Initial check
        checkMobile();
        
        // Add resize listener
        window.addEventListener('resize', checkMobile);
        
        // Check sidebar collapsed state from localStorage
        const sidebarCollapsed = localStorage.getItem('sidebarCollapsed');
        if (sidebarCollapsed) {
            setIsSidebarCollapsed(sidebarCollapsed === 'true');
        }
        
        // Add event listener for sidebar collapse changes
        const handleStorageChange = () => {
            const collapsed = localStorage.getItem('sidebarCollapsed') === 'true';
            setIsSidebarCollapsed(collapsed);
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <div className="overflow-x-hidden">
            {/* Sidebar or top navbar based on screen size */}
            <SidebarMenu />
            
            {/* Main content */}
            <div className="flex h-screen">
                <div className={`flex-1 ${isMobile ? 'mt-16 ml-0' : isSidebarCollapsed ? 'ml-16' : 'ml-64'} p-4 transition-all duration-300`}>
                    <Outlet/>
                    <Toaster/>
                </div>
            </div>
        </div>
    );
}

export default AppLayout;