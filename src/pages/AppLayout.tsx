import React from "react";
import { Outlet } from "react-router-dom";
import SidebarMenu from "../components/Sidemenu.tsx";
import Header from "../components/Header.tsx";


const AppLayout: React.FC = () => {


    return (
            <div className="overscroll-none overflow-x-hidden overscroll-x-none">
            <div className="top-0 w-full">
                <Header/>
            </div>
            <div className="flex h-screen">
                <div>
                    <SidebarMenu/>
                </div>
                <div className="flex-1 p-4">
                    <Outlet/>
                </div>
            </div>
            </div>
)
    ;
}

export default AppLayout;