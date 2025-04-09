import React from "react";
import { Outlet } from "react-router-dom";
import SidebarMenu from "../components/Sidemenu.tsx";
import Header from "../components/Header.tsx";
import { Toaster } from "../components/ui/toaster"

const AppLayout: React.FC = () => {
    
    return (
            <div className="overscroll-none overflow-x-hidden overscroll-x-none">
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