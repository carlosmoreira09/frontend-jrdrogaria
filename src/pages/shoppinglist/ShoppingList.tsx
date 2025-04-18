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

const ShoppingList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [selectedSupplier, setSelectedSupplier] = useState<string>("")
    const [exportDialogOpen, setExportDialogOpen] = useState(false)
    const [idList,setIdList] = useState<number>()
    const [isUpdate, setIsUpdate] = useState<boolean>(false)
    const [lowStockProducts, setLowStockProducts] = useState<IProductAndStock[]>([])
    const { store, tenantName } = useStore()
    const location = useLocation()
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const fetchList = async () => {
        if(location.state) {
            const list = location.state
            setIdList(list.id)
            setLowStockProducts(list.products)
            setIsUpdate(true)
            setIsEdit(true)
        }
    }
    useEffect(() => {
        fetchList().then()
    }, [store]);
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
    const clearSelection = () => {
        setLowStockProducts([]);
        // Cookie removal happens automatically via the useEffect
        toast({
            title: 'JR Drogaria',
            description: 'Seleção de produtos limpa'
        });
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    useEffect(() => {
        fetchProducts().then()
        fetchSuppliers().then()
    }, [store]);

    const handleProductSelect = (name_product: string | undefined) => {
        const product = products.find((products) => products.product_name === name_product)
        if(product && lowStockProducts.some((i) => i.product === product.product_name)) {
                removeItem(product.product_name)
        }
        if(product && !lowStockProducts.some((i) => i.product === product.product_name)) {
            setLowStockProducts([...lowStockProducts, { product: product.product_name, stock: 0 }])
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
            ID: product.id,
            Nome: product.product,
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
        const productsList = lowStockProducts.map(p => `- ${p.product}: `).join('\n');

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
                const result = await updateShoppingList(shoppingList, store)
                if(result) {
                    toast({
                        variant: 'default',
                        title: 'JR Drogaria',
                        description: 'Lista atualizada com sucesso'
                    })
                }
            } else {
                const result = await createShoppingList(shoppingList, store)
                if(result) {
                    toast({
                        variant: 'default',
                        title: 'JR Drogaria',
                        description: 'Lista criada com sucesso'
                    })
                }
            }
        }
    }

    const handleAddProduct = (e: React.ChangeEvent<HTMLInputElement>, product?: string) => {
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
                    disabled={lowStockProducts.length === 0}
                    className="flex cursor-pointer items-center gap-2"
                >
                    <Download className="h-5 w-5"/>
                    Exportar
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
                <div className="flex items-center ml-auto">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="edit-mode"
                            checked={isEdit}
                            onChange={() => setIsEdit(!isEdit)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <Label htmlFor="edit-mode" className="text-sm font-medium text-gray-700">
                            Modo de Edição
                        </Label>
                    </div>
                </div>
            </div>
            {lowStockProducts.length > 0 && (
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
                                    {lowStockProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>{product.product}</TableCell>
                                            <TableCell><Input disabled={isEdit} placeholder={product.stock.toString()}
                                                onChange={(e) => {
                                                handleAddProduct(e, product.product)
                                            }} className="w-16" id="stock" /> </TableCell>
                                            <TableCell className="cursor-pointer"
                                                       onClick={() => removeItem(product.product)}><Trash2
                                                className="text-red-700"/></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter className="flex flew-row justify-between">
                            <div>Total de produtos: {lowStockProducts.length}</div>
                            <Button
                                onClick={createNewList}
                                className="flex items-center gap-2 cursor-pointer text-white bg-green-700 hover:bg-green-800">
                                <SaveIcon className="h-5 w-5"/>
                                {isUpdate ? 'Atualizar Lista' : 'Salvar Lista'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}
            
            {/* Export Dialog */}
            <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
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
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button 
                            onClick={exportToCSV}
                            className="flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Exportar Excel
                        </Button>
                        <Button 
                            onClick={sendViaWhatsApp}
                            variant="outline"
                        >
                            <MessageSquare className="h-4 w-4" />
                            Enviar WhatsApp
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ShoppingList;