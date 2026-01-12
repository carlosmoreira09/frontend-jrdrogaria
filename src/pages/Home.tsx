import React, {useEffect, useRef, useState} from "react"
import Cards from "../components/Cards.tsx";
import { Pill, ShoppingBag, Truck, Package, Sparkles } from "lucide-react";
import {useStore} from "../hooks/store.tsx";
import {getTotalAmount} from "../service/generalService.ts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card.tsx";
import { Button } from "../components/ui/button.tsx";
import {IShoppingList} from "../types/types.ts";
import {listShoppingLists} from "../service/shoppingListService.ts";
import ShoppingListTable from "./shoppinglist/ShoppingListTable.tsx";
import {useNavigate} from "react-router";

interface Totals {
    totalSupplier: number
    totalProducts: number
    totalShoopingList: number
}

const Home: React.FC = () => {
    const { store, tenantName } = useStore()
    const [totals, setTotals] = useState<Totals>()
    const [isLoading, setIsLoading] = useState(true)
    const [shoppingList, setShoppingList] = useState<IShoppingList[]>([])
    const navigate = useNavigate()
    const hasFetchedRef = useRef(false)
    const prevStoreRef = useRef<number | undefined>(undefined)
    
    const fetchTotals = async () => {
        if(store) {
            const result = await getTotalAmount(store)
            if(result?.data) {
                setTotals(result.data)
            }
        }
    }
    
    const fetchShoppingList = async () => {
        if(store) {
            const result = await listShoppingLists(store)
            if(result?.data) {
                setShoppingList(result.data)
            }
        }
    }
    
    useEffect(() => {
        // Prevent double fetch in development (React StrictMode),
        // but refetch whenever the selected store changes.
        if (!store) return;

        const storeChanged = prevStoreRef.current !== store;
        if (!storeChanged && hasFetchedRef.current) return;

        const controller = new AbortController();

        const fetchData = async () => {
            setIsLoading(true);
            try {
                hasFetchedRef.current = true;
                prevStoreRef.current = store;
                await Promise.all([
                    fetchTotals(),
                    fetchShoppingList()
                ]);
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Error fetching data:', error);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        return () => {
            controller.abort();
            // Reset flag on cleanup to allow refetch if component remounts
            if (process.env.NODE_ENV !== 'development') {
                hasFetchedRef.current = false;
            }
        };
    }, [store]); // Keep store dependency but allow refetch on store change

    // Handler to refresh data after list deletion
    const handleListDeleted = () => {
        fetchShoppingList().then()
        fetchTotals().then() // Also refresh totals as the number of lists has changed
    }

    return (
        <div className="flex flex-col space-y-8 p-4">
            {/* Banner V2 */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-4 shadow-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-white">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">Nova Interface Mobile v2</h2>
                            <p className="text-emerald-100 text-sm">Experimente o novo sistema otimizado para celular!</p>
                        </div>
                    </div>
                    <Button 
                        onClick={() => navigate('/v2')}
                        className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold shadow-md"
                    >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Testar Agora
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-green-800">Dashboard JR Drogaria</h1>
                <div className="text-sm text-gray-500">
                    {tenantName && <span>Loja: {tenantName}</span>}
                </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Cards 
                    name="Total Fornecedores" 
                    content={isLoading ? '...' : totals?.totalSupplier} 
                    icon={<Truck className="h-5 w-5" />} 
                    className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
                />
                <Cards 
                    name="Total de Listas" 
                    content={isLoading ? '...' : totals?.totalShoopingList} 
                    icon={<ShoppingBag className="h-5 w-5" />} 
                    className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
                />
                <Cards 
                    name="Total de Produtos" 
                    content={isLoading ? '...' : totals?.totalProducts} 
                    icon={<Pill className="h-5 w-5" />} 
                    className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
                />
            </div>
            
            {/* Quick Actions */}
            <Card className="border-green-200">
                <CardHeader>
                    <CardTitle className="text-green-800">Ações Rápidas</CardTitle>
                    <CardDescription>Acesse rapidamente as principais funcionalidades</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        <Button 
                            onClick={() => navigate('/shopping/home')}
                            className="bg-green-700 text-white hover:bg-green-800"
                        >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Nova Lista de Compras
                        </Button>
                        <Button 
                            onClick={() => navigate('/product/home')}
                            variant="outline"
                            className="border-green-700 text-green-700 hover:bg-green-700 hover:text-white"
                        >
                            <Package className="mr-2 h-4 w-4" />
                            Gerenciar Produtos
                        </Button>
                        <Button 
                            onClick={() => navigate('/supplier/home')}
                            variant="outline"
                            className="border-green-700 text-green-700 hover:bg-green-700 hover:text-white"
                        >
                            <Truck className="mr-2 h-4 w-4" />
                            Gerenciar Fornecedores
                        </Button>
                    </div>
                </CardContent>
            </Card>
            
            {/* Two column layout for latest lists and low stock */}
            <div className="grid grid-cols-1 gap-6">
                <Card className="border-green-200">
                    <CardHeader>
                        <CardTitle className="text-green-800 flex items-center">
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            Últimas Listas de Compras
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ShoppingListTable items={shoppingList} onDelete={handleListDeleted}/>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}

export default Home;
