import React, {useEffect, useState} from "react"
import Cards from "../components/Cards.tsx";
import ShoppingListTable from "./shoppinglist/ShoppingListTable.tsx";
import {BarChart3, Pill, ShoppingBag, Truck, Activity, Package} from "lucide-react";
import {IShoppingList, Product} from "../types/types.ts";
import {useStore} from "../hooks/store.tsx";
import {listShoppingLists} from "../service/shoppingListService.ts";
import {getTotalAmount} from "../service/generalService.ts";
import {listProducts} from "../service/productService.ts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card.tsx";
import { Button } from "../components/ui/button.tsx";

interface Totals {
    totalSupplier: number
    totalProducts: number
    totalShoopingList: number
}

const Home: React.FC = () => {
    const [shoppingList, setShoppingList] = useState<IShoppingList[]>([])
    const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
    const { store, tenantName } = useStore()
    const [totals, setTotals] = useState<Totals>()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchShoppingList = async () => {
            if(store) {
                const result = await listShoppingLists(store)
                if(result?.data) {
                    setShoppingList(result.data)
                }
            }
        }
        fetchShoppingList().then()

    }, [store]);
    
    useEffect(() => {
        const fetchTotal = async () => {
            if(store) {
                setIsLoading(true)
                const result = await getTotalAmount(store)
                if(result?.data) {
                    setTotals(result.data)
                }
                setIsLoading(false)
            }
        }
        fetchTotal().then()

    }, [store]);
    
    useEffect(() => {
        const fetchProducts = async () => {
            if(store) {
                const result = await listProducts(store)
                if(result?.data) {
                    // Filter products with low stock (less than 5)
                    const lowStock = result.data.filter(product => 
                        product.stock !== undefined && product.stock < 5 && product.stock > 0
                    )
                    setLowStockProducts(lowStock)
                }
            }
        }
        fetchProducts().then()
    }, [store]);

    return (
        <div className="flex flex-col space-y-8 p-4">
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
                            onClick={() => window.location.href = '/shopping/home'} 
                            className="bg-green-700 text-white hover:bg-green-800"
                        >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Nova Lista de Compras
                        </Button>
                        <Button 
                            onClick={() => window.location.href = '/shopping/price-comparison'} 
                            className="bg-green-700 text-white hover:bg-green-800"
                        >
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Comparar Preços
                        </Button>
                        <Button 
                            onClick={() => window.location.href = '/product/home'} 
                            variant="outline"
                            className="border-green-700 text-green-700 hover:bg-green-700 hover:text-white"
                        >
                            <Package className="mr-2 h-4 w-4" />
                            Gerenciar Produtos
                        </Button>
                        <Button 
                            onClick={() => window.location.href = '/supplier/home'} 
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Latest Shopping Lists */}
                <Card className="border-green-200">
                    <CardHeader>
                        <CardTitle className="text-green-800 flex items-center">
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            Últimas Listas de Compras
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ShoppingListTable items={shoppingList.slice(0, 5)}/>
                        {shoppingList.length > 5 && (
                            <div className="mt-4 text-center">
                                <Button 
                                    variant="link" 
                                    onClick={() => window.location.href = '/shopping/home'}
                                    className="text-green-700"
                                >
                                    Ver todas as listas
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
                
                {/* Low Stock Products */}
                <Card className="border-amber-200">
                    <CardHeader>
                        <CardTitle className="text-amber-800 flex items-center">
                            <Activity className="mr-2 h-5 w-5" />
                            Produtos com Estoque Baixo
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {lowStockProducts.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-2">Produto</th>
                                            <th className="text-center py-2 px-2">Estoque</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lowStockProducts.slice(0, 8).map((product) => (
                                            <tr key={product.id} className="border-b border-gray-100">
                                                <td className="py-2 px-2">{product.product_name}</td>
                                                <td className="text-center py-2 px-2">
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                                        product.stock === 0 ? 'bg-red-100 text-red-800' : 
                                                        product.stock && product.stock < 3 ? 'bg-amber-100 text-amber-800' : 
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {product.stock}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {lowStockProducts.length > 8 && (
                                    <div className="mt-4 text-center">
                                        <Button 
                                            variant="link" 
                                            onClick={() => window.location.href = '/product/home'}
                                            className="text-amber-700"
                                        >
                                            Ver todos os produtos com estoque baixo
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                Não há produtos com estoque baixo no momento
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Home;
