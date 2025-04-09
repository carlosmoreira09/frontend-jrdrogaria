import { useState, useEffect } from "react"
import {Product} from "../types/types.ts";


interface AutocompleteFilterProps {
    items?: Product[]
    onClick: (id: number | undefined) => void
}

export default function AutocompleteFilter({ items = [],onClick }: AutocompleteFilterProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredItems, setFilteredItems] = useState<Product[]>([])

    useEffect(() => {
        if (items && items.length > 0) {
            const results = items.filter((item) => item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()))
            setFilteredItems(results)
        } else {
            setFilteredItems([])
        }
    }, [searchTerm, items])

    return (
        <div className="w-full max-w-md mx-auto">
            <input
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
                <ul className="mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredItems.map((item) => (
                        <li onClick={() => onClick(item.id)} key={item.id} className="px-4 py-2 hover:bg-gray-100">
                            <div className="font-semibold">{item.product_name}</div>
                            <div className="text-sm text-gray-600">ID: {item.id}</div>
                            <div className="text-sm text-gray-600">Estoque: {item.stock}</div>
                        </li>
                    ))}
                    {filteredItems.length === 0 && <li className="px-4 py-2 text-gray-500">Nenhum resultado encontrado</li>}
                </ul>
            )}
        </div>
    )
}

