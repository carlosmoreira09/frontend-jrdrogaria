import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  ShoppingCart,
  Package,
  Truck,
  Menu,
  X,
  ChevronRight,
  BarChart3,
  ClipboardList,
} from "lucide-react";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  { path: "/v2", label: "Início", icon: <Home className="h-5 w-5" /> },
  { path: "/quotation", label: "Cotações", icon: <FileText className="h-5 w-5" /> },
  { path: "/orders", label: "Pedidos", icon: <ShoppingCart className="h-5 w-5" /> },
  { path: "/product/home", label: "Produtos", icon: <Package className="h-5 w-5" /> },
  { path: "/supplier/home", label: "Fornecedores", icon: <Truck className="h-5 w-5" /> },
  { path: "/shopping/home", label: "Listas", icon: <ClipboardList className="h-5 w-5" /> },
];

const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/v2") return location.pathname === "/v2";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-emerald-600 text-white safe-area-top">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-emerald-700 active:bg-emerald-800 transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <h1 className="text-lg font-semibold">Sistema de Cotação</h1>
          
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Menu */}
      <nav
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white transform transition-transform duration-300 ease-out safe-area-left ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 bg-emerald-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Cotação v2</p>
              <p className="text-xs text-emerald-100">Mobile First</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-emerald-700 active:bg-emerald-800 transition-colors"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="py-2 overflow-y-auto h-[calc(100%-80px)]">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between px-4 py-3 mx-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive(item.path) ? "text-emerald-600" : "text-gray-500"}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                  {item.badge}
                </span>
              )}
              <ChevronRight className={`h-4 w-4 ${isActive(item.path) ? "text-emerald-400" : "text-gray-300"}`} />
            </NavLink>
          ))}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50 safe-area-bottom">
          <p className="text-xs text-gray-500 text-center">
            Sistema de Cotação v2.0
          </p>
        </div>
      </nav>

      {/* Bottom Navigation Bar (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 safe-area-bottom md:hidden">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full px-1 transition-colors ${
                isActive(item.path)
                  ? "text-emerald-600"
                  : "text-gray-500 active:text-emerald-600"
              }`}
            >
              {item.icon}
              <span className="text-[10px] mt-1 font-medium truncate max-w-full">
                {item.label}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default MobileNav;
