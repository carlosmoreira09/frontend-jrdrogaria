import React, { useState, useEffect } from 'react'
import { LogOut } from 'lucide-react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./ui/select.tsx";
import {storeOptions} from "../lib/utils.ts";
import {useStore} from "../hooks/store.tsx";
import { Button } from './ui/button.tsx';
import Cookies from 'js-cookie';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu.tsx";

const Header: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [title, setTitle] = useState<string>('')
    const store = useStore();
    const [selectStore, setSelectedStore] = useState<string>('1')
    const [username, setUsername] = useState<string>('Usuário')
    
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        // Get username from cookies or localStorage
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        if(selectStore) {
           const result = storeOptions.find((store) => store.id == parseInt(selectStore))
            if(result){
                store.setStore(result.id)
                store.setTenantName(result.name)
                setTitle(result.name)
            }
        }
    }, [selectStore]);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    }
    
    const handleLogout = () => {
        // Clear cookies and localStorage
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        localStorage.removeItem('username');
        localStorage.removeItem('user');
        
        // Redirect to login page
        window.location.href = '/login';
    }
    
    // Get initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <header className="bg-green-900 text-white p-3 flex justify-between items-center">
            <div className="flex items-center">
                <div className="flex flex-row">
                    <label htmlFor="store" className="min-w-max p-2 my-auto text-sm text-white font-medium">
                        Selecione a farmácia
                    </label>
                    <Select value={selectStore} onValueChange={setSelectedStore}>
                        <SelectTrigger
                            className="min-w-max p-5 rounded-full text-oxfordBlue placeholder:text-xs placeholder-gray-200 border-oxfordBlue"
                            id="store">
                            <SelectValue placeholder="Selecione a farmácia"/>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-200">
                            {storeOptions.map((store) => (
                                <SelectItem key={store.id} value={store.id.toString()}>
                                    {store.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="text-lg md:text-xl capitalize font-bold hidden md:block">
               Loja: {title} Drograria
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
                                        {title} Drograria
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Sair</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
export default Header;