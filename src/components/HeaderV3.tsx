/**
 * Header v3 - Multi-tenant
 * Usa TenantStoreContext para gerenciar tenant e store
 */

import React, { useState, useEffect } from 'react';
import { LogOut, Store } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useTenantStore } from '../context/TenantStoreContext';
import { Button } from './ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const HeaderV3: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { 
    stores, 
    currentStore, 
    setCurrentStore, 
    tenantName, 
    logout,
    isAuthenticated 
  } = useTenantStore();

  const [username, setUsername] = useState<string>('Usuário');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleStoreChange = (storeId: string) => {
    const store = stores.find((s) => s.id === Number(storeId));
    if (store) {
      setCurrentStore(store);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="bg-green-900 text-white p-3 flex justify-between items-center">
      <div className="flex items-center">
        <div className="flex flex-row items-center gap-2">
          <Store className="h-5 w-5 text-white/80" />
          <label htmlFor="store" className="min-w-max text-sm text-white font-medium hidden sm:block">
            Loja:
          </label>
          <Select 
            value={currentStore?.id?.toString() || ''} 
            onValueChange={handleStoreChange}
          >
            <SelectTrigger
              className="min-w-[120px] p-5 rounded-full text-oxfordBlue placeholder:text-xs placeholder-gray-200 border-oxfordBlue"
              id="store"
            >
              <SelectValue placeholder="Selecione a loja" />
            </SelectTrigger>
            <SelectContent className="bg-gray-200">
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id.toString()}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="text-lg md:text-xl capitalize font-bold hidden md:block">
        {tenantName || 'Sistema'}
      </div>

      <div className="flex justify-end items-center text-sm space-x-2">
        <div className="hidden md:flex space-x-2 md:flex-row mr-10">
          <div>{formatDate(currentTime)}</div>
          <div>{formatTime(currentTime)}</div>
        </div>
        <div className="mr-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/01.png" alt={username} />
                  <AvatarFallback className="bg-green-700">{getInitials(username)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{username}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentStore?.name || 'Sem loja selecionada'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default HeaderV3;
