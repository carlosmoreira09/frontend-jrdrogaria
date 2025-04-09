import React, {useEffect, useState} from "react"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { Checkbox } from "../components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import {IShoppingList, Product} from "../types/types.ts";
import {listProducts} from "../service/productService.ts";
import {useStore} from "../hooks/store.tsx";
import {toast} from "../hooks/use-toast.ts";
import AutocompleteFilter from "../components/ProductFilter.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../components/ui/table.tsx";
import {Download, Trash2} from "lucide-react";
import {createShoppingList} from "../service/shoppingListService.ts";
import {convertToCSV, downloadCSV} from "../lib/csv-export.ts";


const ShoppingList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
    const { store, tenantName,  } = useStore()
    const fetchProducts = async () => {
        console.log(tenantName)
        if (store) {
            const result = await listProducts(store)
            if(result?.data) {
                setProducts(result.data)
            } else {
                toast({
                    variant: 'destructive',
                    title: 'JR Drogaria',
                    description: 'Erro ao listar produtos'
                })
            }
        }
    }
    useEffect(() => {
        fetchProducts().then()
        setSelectedProducts([])
    }, [store]);

    const handleProductSelect = (id: number | undefined) => {
        const product = products.find((products) => products.id === id)
        if(product && selectedProducts.some((i) => i.id === product.id)) {
                removeItem(product.id)
        }
        if(product && !selectedProducts.some((i) => i.id === product.id)) {
            setSelectedProducts([...selectedProducts, product])
        }
    }
    const removeItem = (id: number | undefined) => {
        setSelectedProducts(selectedProducts.filter((item) => item.id !== id))
    }
    const exportToCSV = () => {

        const exportData = selectedProducts.map((product) => ({
            ID: product.id,
            Nome: product.product_name,
            ["Preço Unitário"]: '',
            Fornecedor: '',
            ["Loja"]: tenantName + "Drograria"
        }))

        const csvData = convertToCSV(exportData)

        const date = new Date()
        const formattedDate = date.toISOString().split("T")[0] // YYYY-MM-DD
        const filename = `Lista_de_Compras_${formattedDate}.csv`

        downloadCSV(csvData, filename)
    }
    const createNewList = async () => {
        if(store) {
            const newList: IShoppingList = {
                products: selectedProducts

            }
            await createShoppingList(newList,store).then(
                (result) => {
                    if(result?.data) {
                        toast({
                            title: 'JR Drogaria',
                            description: 'Lista de compras criada'

                        })
                    }
                }
            )
        }

    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gerenciador de Listas de Compras</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-center">Selecione os Produtos</CardTitle>
                </CardHeader>
                <CardContent>
                    <AutocompleteFilter onClick={handleProductSelect} items={products}/>
                    <div className="mt-10">
                        <h2>Produtos com estoque zerado</h2>
                        <div className="mt-2">
                            <Card className="grid col-auto row-auto p-2">
                                {products.map((product) =>
                                    (
                                        product.stock == 0 ?
                                            (<div key={product.id} className="flex items-center space-x-2 mb-2">
                                                <Checkbox
                                                    id={`product-${product.id}`}
                                                    checked={product.selected}
                                                    onCheckedChange={() => handleProductSelect(product.id)}
                                                />

                                                <Label htmlFor={`product-${product.id}`}>{product.product_name}</Label>
                                            </div>) : <></>
                                    )
                                )}
                            </Card>

                        </div>

                    </div>
                    <Button onClick={createNewList} className="mt-4">
                        Criar Nova Lista
                    </Button>
                </CardContent>
            </Card>
            <div className="flex mt-4">
                <Button onClick={exportToCSV} disabled={selectedProducts.length === 0}
                        className="flex items-center gap-2">
                    <Download className="h-5 w-5"/>
                    Exportar CSV
                </Button>
            </div>
            {selectedProducts.length > 0 && (
                <div className="mt-5">
                    <Card>
                        <CardHeader>
                            <CardTitle>Produtos adicionados a lista os Preços</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Produto</TableHead>
                                        <TableHead>Estoque</TableHead>
                                        <TableHead>Remover</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>{product.product_name}</TableCell>
                                            <TableCell>{product.stock}</TableCell>
                                            <TableCell className="cursor-pointer"
                                                       onClick={() => removeItem(product.id)}><Trash2
                                                className="text-red-700"/></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default ShoppingList;