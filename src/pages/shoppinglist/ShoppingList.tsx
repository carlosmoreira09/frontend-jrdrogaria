import React, {useEffect, useState} from "react"
import { Button } from "../../components/ui/button.tsx"
import { Label } from "../../components/ui/label.tsx"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../components/ui/card.tsx"
import {IProductAndStock, IShoppingList, Product, Supplier} from "../../types/types.ts";
import {listProducts} from "../../service/productService.ts";
import {useStore} from "../../hooks/store.tsx";
import {toast} from "../../hooks/use-toast.ts";
import AutocompleteFilter from "../../components/ProductFilter.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../components/ui/table.tsx";
import {Download, Trash2, BarChart2, SaveIcon} from "lucide-react";
import {createShoppingList} from "../../service/shoppingListService.ts";
import {exportLeadsToCSV} from "../../components/serverExportCsv.tsx";
import {listSuppliers} from "../../service/supplierService.ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog.tsx"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx"
import Cookies from "js-cookie";
import {Input} from "../../components/ui/input.tsx";


const ShoppingList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [selectedSupplier, setSelectedSupplier] = useState<string>("")
    const [exportDialogOpen, setExportDialogOpen] = useState(false)
    const [lowStockProducts, setLowStockProducts] = useState<IProductAndStock[]>([])
    const { store, tenantName } = useStore()
    
    const fetchProducts = async () => {
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

    const fetchSuppliers = async () => {
        const result = await listSuppliers()
        if(result?.data) {
            setSuppliers(result.data || [])
        } else {
            toast({
                variant: 'destructive',
                title: 'JR Drogaria',
                description: 'Erro ao listar fornecedores'
            })
        }
    }
    useEffect(() => {
        console.log('Trying to load products from cookies for store:', store);
        const savedProducts = Cookies.get(`selectedProducts_${store}`);
        console.log('Retrieved from cookies:', savedProducts);
        
        if (savedProducts) {
            try {
                const parsedProducts = JSON.parse(savedProducts);
                console.log('Successfully parsed products:', parsedProducts);
                setSelectedProducts(parsedProducts);
            } catch (error) {
                console.error('Error parsing saved products:', error);
                Cookies.remove(`selectedProducts_${store}`);
            }
        }
    }, []);
    
    useEffect(() => {
        if (selectedProducts.length > 0) {
            // Set cookie with proper options
            const productData = JSON.stringify(selectedProducts);
            console.log('Saving to cookies:', productData);
            
            // Use proper cookie options
            Cookies.set(`selectedProducts_${store}`, productData, { 
                expires: 7, // 7 days
                path: '/',  // Available across the site
                sameSite: 'strict',
                secure: window.location.protocol === 'https:'
            });
            
            // Verify it was set
            console.log('Verification - Cookie after setting:', Cookies.get(`selectedProducts_${store}`));
        }
    }, [store]);
    
    // Add a function to debug cookies
    const debugCookies = () => {
        console.log('All cookies:', document.cookie);
        console.log('Selected products cookie:', Cookies.get(`selectedProducts_${store}`));
        console.log('Current selectedProducts state:', selectedProducts);
    }
    
    const clearSelection = () => {
        setSelectedProducts([]);
        // Cookie removal happens automatically via the useEffect
        toast({
            title: 'JR Drogaria',
            description: 'Seleção de produtos limpa'
        });
        
        // Debug after clearing
        setTimeout(debugCookies, 100);
    }
    useEffect(() => {
        fetchProducts().then()
        fetchSuppliers().then()
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
    
    const openExportDialog = () => {
        if (selectedProducts.length === 0) {
            toast({
                variant: 'destructive',
                title: 'JR Drogaria',
                description: 'Selecione pelo menos um produto para exportar'
            })
            return
        }
        setExportDialogOpen(true)
    }
    
    const exportToCSV = async () => {
        const supplierName = selectedSupplier || ''
        const exportData = selectedProducts.map((product) => ({
            ID: product.id,
            Nome: product.product_name,
            ["Preço Unitário"]: '',
            Fornecedor: supplierName,
            ["Loja"]: tenantName + " Drogaria"
        }))

        await exportLeadsToCSV(exportData, supplierName)
        setExportDialogOpen(false)
        
        toast({
            title: 'JR Drogaria',
            description: 'Lista exportada com sucesso'
        })
    }
    
    const createNewList = async () => {
        const date = new Date()
        const formattedDate = date.toISOString().split("T")[0] // YYYY-MM-DD
        const filename = `LISTA_DE_COMPRAS_${formattedDate}`

        const shoppingList: IShoppingList = {
            list_name: filename,
            products: lowStockProducts,
        }
        if(store) {
            const result = await createShoppingList(shoppingList, store)
            console.log(result)
        }

    }

    const handleAddProduct = (e: React.ChangeEvent<HTMLInputElement> , product?: string) => {
        e.preventDefault()

        const stock = Number(e.target.value)
        const existingProductIndex = lowStockProducts.findIndex(item => item.product === product);

        if (existingProductIndex !== -1) {
            // Product exists, update its stock
            const updatedProducts = [...lowStockProducts];
            updatedProducts[existingProductIndex] = {
                ...updatedProducts[existingProductIndex],
                stock: stock
            };
            setLowStockProducts(updatedProducts);
        } else {
            // Product doesn't exist, add it to the array
            setLowStockProducts([...lowStockProducts, { product: product, stock: stock }]);
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
                </CardContent>
            </Card>
            <div className="flex mt-4 gap-2">
                <Button
                    onClick={openExportDialog}
                    disabled={selectedProducts.length === 0}
                    className="flex cursor-pointer items-center gap-2"
                >
                    <Download className="h-5 w-5"/>
                    Exportar Excel
                </Button>
                <Button
                    onClick={() => window.location.href = '/shopping/price-comparison'}
                    className="flex items-center gap-2 cursor-pointer text-white bg-green-700 hover:bg-green-800">
                    <BarChart2 className="h-5 w-5"/>
                    Comparar Preços
                </Button>
                <Button
                    onClick={clearSelection}
                    className="flex items-center gap-2 cursor-pointer text-white bg-red-600 hover:bg-red-700">
                    <Trash2 className="h-5 w-5"/>
                    Limpar Seleção
                </Button>
            </div>
            {selectedProducts.length > 0 && (
                <div className="mt-5">
                    <Card>
                        <CardHeader>
                            <CardTitle>Produtos adicionados a lista de compras</CardTitle>
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
                                            <TableCell><Input onChange={(e) => {
                                                handleAddProduct(e, product.product_name)
                                            }} className="w-16" id="stock" /> </TableCell>
                                            <TableCell className="cursor-pointer"
                                                       onClick={() => removeItem(product.id)}><Trash2
                                                className="text-red-700"/></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter className="flex flew-row justify-between">
                            <div>Total de produtos: {selectedProducts.length}</div>
                            <Button
                                onClick={createNewList}
                                className="flex items-center gap-2 cursor-pointer text-white bg-green-700 hover:bg-green-800">
                                <SaveIcon className="h-5 w-5"/>
                                Salvar Lista
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}
            
            {/* Export Dialog */}
            <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Exportar Lista de Compras</DialogTitle>
                        <DialogDescription>
                            Selecione o fornecedor para esta lista de compras
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="supplier" className="text-right">
                                Fornecedor
                            </Label>
                            <Select 
                                value={selectedSupplier} 
                                onValueChange={setSelectedSupplier}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione um fornecedor" />
                                </SelectTrigger>
                                <SelectContent className="bg-white rounded-2xl">
                                    {suppliers.map((supplier) => (
                                        <SelectItem 
                                            key={supplier.id} 
                                            value={supplier.supplier_name}
                                        >
                                            {supplier.supplier_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={exportToCSV}>
                            Exportar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ShoppingList;