import React, {useEffect, useState} from "react"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../components/ui/card"
import {IProductAndStock, IShoppingList, Product, Supplier} from "../../types/types";
import {listProducts} from "../../service/productService";
import {useStore} from "../../hooks/store";
import {toast} from "../../hooks/use-toast";
import AutocompleteFilter from "../../components/ProductFilter";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../components/ui/table";
import {Download, MessageSquare, Trash2, BarChart2, SaveIcon} from "lucide-react";
import {createShoppingList, updateShoppingList} from "../../service/shoppingListService";
import {exportLeadsToCSV} from "../../components/serverExportCsv";
import {listSuppliers} from "../../service/supplierService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import {Input} from "../../components/ui/input";
import {useLocation} from "react-router-dom";
import {useNavigate} from "react-router";

const ShoppingList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [selectedSupplier, setSelectedSupplier] = useState<string>("")
    const [exportDialogOpen, setExportDialogOpen] = useState(false)
    const [idList,setIdList] = useState<number>()
    const [isUpdate, setIsUpdate] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(false)
    const [lowStockProducts, setLowStockProducts] = useState<IProductAndStock[]>([])
    const { store, tenantName } = useStore()
    const location = useLocation()
    const navigate = useNavigate();
    const fetchList = async () => {
        if(location.state) {
            const list = location.state
            setIdList(list.id)
            setLowStockProducts(list.products)
            setIsUpdate(true)
        }
    }
    useEffect(() => {
        fetchList().then()
    }, [store]);
    const fetchProducts = async () => {
            const result = await listProducts()
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
        fetchProducts().then()
        fetchSuppliers().then()
    }, [store]);

    const handleProductSelect = (name_product: string | undefined) => {
        const product = products.find((products) => products.product_name === name_product)
        if(product && !lowStockProducts.some((i) => i.product === product.product_name)) {
            // Add the product and then sort the array alphabetically by product name
            const updatedProducts = [...lowStockProducts, { 
                product: product.product_name, 
                stockJR: 0, 
                stockGS: 0, 
                stockBARAO: 0, 
                stockLB: 0 
            }];
            setLowStockProducts(updatedProducts.sort((a, b) => {
                return (a.product || '').localeCompare(b.product || '');
            }));
        }
    }
    
    const removeItem = (name_product: string | undefined) => {
        setLowStockProducts(lowStockProducts.filter((item) => item.product !== name_product))
    }
    
    const openExportDialog = () => {
        if (lowStockProducts.length === 0) {
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
        const exportData = lowStockProducts.map((product) => ({
            Nome: product.product,
            Fornecedor: supplierName,
            ["Loja"]: tenantName + " Drogaria",
            ["Preço Unitário"]: '',
        }))

        await exportLeadsToCSV(exportData, supplierName)
        setExportDialogOpen(false)
        
        toast({
            title: 'JR Drogaria',
            description: 'Lista exportada com sucesso'
        })
    }
    const sendViaWhatsApp = () => {
        const supplier = suppliers.find(s => s.supplier_name === selectedSupplier);

        if (!supplier || !supplier.whatsAppNumber) {
            toast({
                variant: 'destructive',
                title: 'JR Drogaria',
                description: 'Número de WhatsApp não encontrado para este fornecedor'
            });
            return;
        }

        // Format the message
        const date = new Date().toLocaleDateString('pt-BR');
        const productsList = lowStockProducts.map(p => 
            `- ${p.product}:\n   JR: ${p.stockJR}\n   GS: ${p.stockGS}\n   BARÃO: ${p.stockBARAO}\n   LB: ${p.stockLB}`
        ).join('\n');

        const message = `*Lista de Compras - ${tenantName} Drogaria*\n\n` +
            `*Fornecedor:* ${selectedSupplier}\n` +
            `*Data:* ${date}\n\n` +
            `*Produtos:*\n${productsList}\n\n` +
            `Por favor, envie um orçamento para estes itens. Obrigado!`;

        // Format phone number (remove non-numeric characters)
        const phoneNumber = supplier.whatsAppNumber.replace(/\D/g, '');

        // Create WhatsApp URL
        const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;

        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');

        setExportDialogOpen(false);

        toast({
            title: 'JR Drogaria',
            description: 'Redirecionando para WhatsApp'
        });
    }
    
    const createNewList = async () => {
        const date = new Date()
        const formattedDate = date.toISOString().split("T")[0] // YYYY-MM-DD
        const filename = `LISTA_DE_COMPRAS_${formattedDate}`

        const shoppingList: IShoppingList = {
            id: idList,
            list_name: filename,
            products: lowStockProducts,
        }
        if (store) {

            if (isUpdate) {
                try {
                    setIsLoading(true)
                    const result = await updateShoppingList(shoppingList, store)
                    if (result?.data) {
                        toast({
                            variant: 'default',
                            title: 'JR Drogaria',
                            description: 'Lista atualizada com sucesso'
                        })
                    } else {

                        toast({
                            variant: 'destructive',
                            title: 'JR Drogaria',
                            description: 'Erro ao atualizar lista'
                        })
                    }
                } catch (error) {
                    console.error("Failed to update shopping list:", error)
                } finally {
                    setIsLoading(false)
                }
            } else {
                try {
                    setIsLoading(true)
                    const result = await createShoppingList(shoppingList, store)
                    if (result?.data) {
                        toast({
                            variant: 'default',
                            title: 'JR Drogaria',
                            description: 'Lista criada com sucesso'
                        })
                        setIdList(result?.data?.data?.id)
                        setIsUpdate(true)
                    }
                } catch (error) {
                    console.error("Failed to create shopping list:", error)
                } finally {
                    setIsLoading(false)
                }
            }
        }
    }

    const handleAddProduct = (e: React.ChangeEvent<HTMLInputElement>, product?: string, stockField: keyof Pick<IProductAndStock, 'stockJR' | 'stockGS' | 'stockBARAO' | 'stockLB'> = 'stockJR') => {
        e.preventDefault()
        const stockValue = Number(e.target.value)
        const existingProductIndex = lowStockProducts.findIndex(item => item.product === product);

        if (existingProductIndex !== -1) {
            // Product exists, update its stock
            const updatedProducts = [...lowStockProducts];
            updatedProducts[existingProductIndex] = {
                ...updatedProducts[existingProductIndex],
                [stockField]: stockValue
            };
            setLowStockProducts(updatedProducts);
        } else {
            // Product doesn't exist, add it to the array and sort alphabetically
            const newProduct: IProductAndStock = { 
                product: product, 
                stockJR: 0, 
                stockGS: 0, 
                stockBARAO: 0, 
                stockLB: 0 
            };
            newProduct[stockField] = stockValue;
            
            const updatedProducts = [...lowStockProducts, newProduct];
            setLowStockProducts(updatedProducts.sort((a, b) => {
                return (a.product || '').localeCompare(b.product || '');
            }));
        }
    }

    return (
        <div className="container mx-auto px-2 py-4 max-w-full">
            <h1 className="text-xl md:text-2xl font-bold mb-4">Gerenciador de Listas de Compras</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="text-center text-lg md:text-xl">Selecione os Produtos</CardTitle>
                </CardHeader>
                <CardContent>
                    <AutocompleteFilter onClick={handleProductSelect} items={products}/>
                </CardContent>
            </Card>
            <div className="flex flex-wrap mt-4 gap-2">
                <Button
                    onClick={openExportDialog}
                    disabled={lowStockProducts.length === 0}
                    className="flex cursor-pointer items-center gap-2 w-full sm:w-auto mb-2 sm:mb-0"
                >
                    <Download className="h-5 w-5"/>
                    Exportar
                </Button>
                <Button
                    onClick={() => navigate(`/shopping/price-comparison/${idList}`)}
                    className="flex items-center gap-2 cursor-pointer text-white bg-green-700 hover:bg-green-800 w-full sm:w-auto">
                    <BarChart2 className="h-5 w-5"/>
                    Comparar Preços
                </Button>
            </div>
            {lowStockProducts.length > 0 && (
                <div className="mt-5">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center text-lg md:text-xl">Produtos adicionados a lista de compras</CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            {/* Desktop view - Table */}
                            <div className="hidden md:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Produto</TableHead>
                                            <TableHead>JR</TableHead>
                                            <TableHead>GS</TableHead>
                                            <TableHead>BARÃO</TableHead>
                                            <TableHead>LB</TableHead>
                                            <TableHead>Remover</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lowStockProducts.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>{product.product}</TableCell>
                                                <TableCell>
                                                    <Input 
                                                        placeholder={product?.stockJR?.toString()}
                                                        value={product?.stockJR || ''}
                                                        onChange={(e) => handleAddProduct(e, product.product, 'stockJR')} 
                                                        className="w-16" 
                                                        id="stockJR" 
                                                        type="number"
                                                        inputMode="numeric"
                                                    /> 
                                                </TableCell>
                                                <TableCell>
                                                    <Input 
                                                        placeholder={product?.stockGS?.toString()}
                                                        value={product?.stockGS || ''}
                                                        onChange={(e) => handleAddProduct(e, product.product, 'stockGS')} 
                                                        className="w-16" 
                                                        id="stockGS" 
                                                        type="number"
                                                        inputMode="numeric"
                                                    /> 
                                                </TableCell>
                                                <TableCell>
                                                    <Input 
                                                        placeholder={product?.stockBARAO?.toString()}
                                                        value={product?.stockBARAO || ''}
                                                        onChange={(e) => handleAddProduct(e, product.product, 'stockBARAO')} 
                                                        className="w-16" 
                                                        id="stockBARAO" 
                                                        type="number"
                                                        inputMode="numeric"
                                                    /> 
                                                </TableCell>
                                                <TableCell>
                                                    <Input 
                                                        placeholder={product?.stockLB?.toString()}
                                                        value={product.stockLB || ''}
                                                        onChange={(e) => handleAddProduct(e, product.product, 'stockLB')} 
                                                        className="w-16" 
                                                        id="stockLB" 
                                                        type="number"
                                                        inputMode="numeric"
                                                    /> 
                                                </TableCell>
                                                <TableCell className="cursor-pointer"
                                                        onClick={() => removeItem(product.product)}><Trash2
                                                    className="text-red-700"/></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            
                            {/* Mobile view - Card based layout */}
                            <div className="md:hidden space-y-4">
                                {lowStockProducts.map((product) => (
                                    <Card key={product.id} className="p-3 relative">
                                        <div className="absolute top-2 right-2 cursor-pointer" onClick={() => removeItem(product.product)}>
                                            <Trash2 className="text-red-700 h-5 w-5"/>
                                        </div>
                                        <h3 className="font-medium text-base mb-3 pr-7">{product.product}</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex flex-col">
                                                <Label htmlFor={`mobile-stockJR-${product.id}`} className="mb-1 text-sm">JR</Label>
                                                <Input 
                                                    placeholder={product?.stockJR?.toString()}
                                                    value={product.stockJR || ''}
                                                    onChange={(e) => handleAddProduct(e, product.product, 'stockJR')} 
                                                    className="w-full" 
                                                    id={`mobile-stockJR-${product.id}`} 
                                                    type="number"
                                                    inputMode="numeric"
                                                /> 
                                            </div>
                                            <div className="flex flex-col">
                                                <Label htmlFor={`mobile-stockGS-${product.id}`} className="mb-1 text-sm">GS</Label>
                                                <Input 
                                                    placeholder={product?.stockGS?.toString()}
                                                    value={product.stockGS || ''}
                                                    onChange={(e) => handleAddProduct(e, product.product, 'stockGS')} 
                                                    className="w-full" 
                                                    id={`mobile-stockGS-${product.id}`} 
                                                    type="number"
                                                    inputMode="numeric"
                                                /> 
                                            </div>
                                            <div className="flex flex-col">
                                                <Label htmlFor={`mobile-stockBARAO-${product.id}`} className="mb-1 text-sm">BARÃO</Label>
                                                <Input 
                                                    placeholder={product?.stockBARAO?.toString()}
                                                    value={product.stockBARAO || ''}
                                                    onChange={(e) => handleAddProduct(e, product.product, 'stockBARAO')} 
                                                    className="w-full" 
                                                    id={`mobile-stockBARAO-${product.id}`} 
                                                    type="number"
                                                    inputMode="numeric"
                                                /> 
                                            </div>
                                            <div className="flex flex-col">
                                                <Label htmlFor={`mobile-stockLB-${product.id}`} className="mb-1 text-sm">LB</Label>
                                                <Input 
                                                    placeholder={product?.stockLB?.toString()}
                                                    value={product.stockLB || ''}
                                                    onChange={(e) => handleAddProduct(e, product.product, 'stockLB')} 
                                                    className="w-full" 
                                                    id={`mobile-stockLB-${product.id}`} 
                                                    type="number"
                                                    inputMode="numeric"
                                                /> 
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3">
                            <div>Total de produtos: {lowStockProducts.length}</div>
                            <Button
                                disabled={isLoading}
                                onClick={createNewList}
                                className="flex items-center gap-2 cursor-pointer text-white bg-green-700 hover:bg-green-800 w-full sm:w-auto">
                                <SaveIcon className="h-5 w-5"/>
                                {isUpdate ? 'Atualizar Lista' : 'Salvar Lista'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}
            
            {/* Export Dialog */}
            <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-w-[95vw] rounded-lg">
                    <DialogHeader>
                        <DialogTitle>Exportar Lista de Compras</DialogTitle>
                        <DialogDescription>
                            Selecione o fornecedor para esta lista de compras
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                            <Label htmlFor="supplier" className="sm:text-right text-left">
                                Fornecedor
                            </Label>
                            <Select 
                                value={selectedSupplier} 
                                onValueChange={setSelectedSupplier}
                            >
                                <SelectTrigger className="col-span-1 sm:col-span-3">
                                    <SelectValue placeholder="Selecione um fornecedor" />
                                </SelectTrigger>
                                <SelectContent className="bg-white rounded-lg max-h-[40vh]">
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
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" onClick={() => setExportDialogOpen(false)} className="w-full sm:w-auto">
                            Cancelar
                        </Button>
                        <Button 
                            onClick={exportToCSV}
                            className="flex items-center gap-2 w-full sm:w-auto"
                        >
                            <Download className="h-4 w-4" />
                            Exportar Excel
                        </Button>
                        <Button 
                            onClick={sendViaWhatsApp}
                            variant="outline"
                            className="w-full sm:w-auto"
                        >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Enviar WhatsApp
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ShoppingList;