'use client'

import React, { useState, useEffect } from 'react'
import { User } from 'lucide-react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./ui/select.tsx";
import {storeOptions} from "../lib/utils.ts";
import {useStore} from "../hooks/store.tsx";


const Header: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [title, setTitle] = useState<string>('')
    const store = useStore();
    const [selectStore, setSelectedStore] = useState<string>('1')
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
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

    return (
        <header className="bg-green-900 text-white p-4 flex justify-between items-center">
            <div>
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
            <div className="text-2xl capitalize font-bold">
               Loja: {title} Drograria
            </div>

            <div className="flex justify-end items-center text-sm space-x-2">
                <User className="mr-2"/>
                <span className="mr-4">Usuário Logado</span>
                <div>
                    <div>{formatDate(currentTime)}</div>
                    <div>{formatTime(currentTime)}</div>
                </div>
            </div>
        </header>
    )
}
export default  Header;