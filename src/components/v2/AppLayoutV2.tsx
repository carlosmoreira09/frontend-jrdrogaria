import React from "react";
import { Outlet } from "react-router-dom";
import MobileNav from "./MobileNav";
import { Toaster } from "../ui/toaster";

const AppLayoutV2: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNav />
      
      {/* Main content area */}
      <main className="pt-14 pb-20 md:pb-4 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
      
      <Toaster />
    </div>
  );
};

export default AppLayoutV2;
