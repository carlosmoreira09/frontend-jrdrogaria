/**
 * Mobile Nav v3 - Multi-tenant
 * Navegação mobile com suporte a tenant/store
 */

import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Package,
  Menu,
  X,
  ChevronRight,
  BarChart3,
  Users,
  ShoppingCart,
  LogOut,
  Store,
} from "lucide-react";
import { useTenantStore } from "../../context/TenantStoreContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  { path: "/v3", label: "Início", icon: <Home className="h-5 w-5" /> },
  { path: "/v3/quotations", label: "Cotações", icon: <FileText className="h-5 w-5" /> },
  { path: "/v3/products", label: "Produtos", icon: <Package className="h-5 w-5" /> },
  { path: "/v3/suppliers", label: "Fornecedores", icon: <Users className="h-5 w-5" /> },
  { path: "/v3/orders", label: "Pedidos", icon: <ShoppingCart className="h-5 w-5" /> },
];

const MobileNavV3: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { tenantName, stores, currentStore, setCurrentStore, logout } = useTenantStore();

  const isActive = (path: string) => {
    if (path === "/v3") return location.pathname === "/v3";
    return location.pathname.startsWith(path);
  };

  const handleStoreChange = (storeId: string) => {
    const store = stores.find((s) => s.id === Number(storeId));
    if (store) {
      setCurrentStore(store);
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg fixed top-0 left-0 right-0 z-40">
        <div className="flex justify-between items-center max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-emerald-700 active:bg-emerald-800 transition-colors"
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <h1 className="text-lg font-bold">{tenantName || 'Sistema'}</h1>
              <p className="text-emerald-100 text-xs">Sistema de Cotações</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-emerald-200" />
            <Select
              value={currentStore?.id?.toString() || ''}
              onValueChange={handleStoreChange}
            >
              <SelectTrigger className="w-[100px] h-8 bg-emerald-700 border-emerald-500 text-white text-xs">
                <SelectValue placeholder="Loja" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id.toString()}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 bg-emerald-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">{tenantName || 'Sistema'}</p>
              <p className="text-xs text-emerald-100">{currentStore?.name || 'Selecione uma loja'}</p>
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

        <div className="py-2 overflow-y-auto h-[calc(100%-140px)]">
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
              <ChevronRight className={`h-4 w-4 ${isActive(item.path) ? "text-emerald-400" : "text-gray-300"}`} />
            </NavLink>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sair</span>
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Sistema de Cotação v3.0
          </p>
        </div>
      </nav>

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 md:hidden">
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

export default MobileNavV3;
