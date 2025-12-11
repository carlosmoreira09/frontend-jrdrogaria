import React, {useEffect, useRef, useState, useCallback, useMemo} from "react"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import {IProductAndStock, IShoppingList, Product, Supplier} from "../../types/types";
import {listProducts} from "../../service/productService";
import {useStore} from "../../hooks/store";
import {toast} from "../../hooks/use-toast";
import AutocompleteFilter from "../../components/ProductFilter";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../components/ui/table";
import {Download, MessageSquare, Trash2, BarChart2, SaveIcon, AlertCircle, CheckCircle2} from "lucide-react";
import {createShoppingList, updateShoppingList} from "../../service/shoppingListService";
import {exportLeadsToCSV, exportBestPrices} from "../../components/serverExportCsv";
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
import { useAutoSave } from "../../hooks/useAutoSave";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { LoadingSpinner } from "../../components/ui/loading-spinner";
import { ConfirmationDialog } from "../../components/ui/confirmation-dialog";
import { ErrorBoundary } from "react-error-boundary";

interface ShoppingListData {
  id?: number;
  products: IProductAndStock[];
  isUpdate: boolean;
}

const ErrorFallback: React.FC<{error: Error; resetErrorBoundary: () => void}> = ({ 
  resetErrorBoundary 
}) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
    <h2 className="text-xl font-semibold mb-2">Algo deu errado</h2>
    <p className="text-gray-600 mb-4">
      Ocorreu um erro inesperado. Seus dados foram salvos localmente.
    </p>
    <Button onClick={resetErrorBoundary}>Tentar novamente</Button>
  </div>
);

const ShoppingList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [selectedSupplier, setSelectedSupplier] = useState<string>("")
    const [exportDialogOpen, setExportDialogOpen] = useState(false)
    const [confirmationDialog, setConfirmationDialog] = useState<{
        open: boolean;
        title: string;
        description: string;
        onConfirm: () => void;
    }>({ open: false, title: '', description: '', onConfirm: () => {} })
    
    // New state for quantity modal
    const [quantityModal, setQuantityModal] = useState<{
        open: boolean;
        productName?: string;
        quantities: {
            stockJR: number;
            stockGS: number;
            stockBARAO: number;
            stockLB: number;
        }
    }>({ 
        open: false, 
        productName: '',
        quantities: {
            stockJR: 0,
            stockGS: 0,
            stockBARAO: 0,
            stockLB: 0
        }
    })
    
    const [idList, setIdList] = useState<number>()
    const [isUpdate, setIsUpdate] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    
    const { store, tenantName } = useStore()
    const location = useLocation()
    const navigate = useNavigate();
    const hasFetchedListRef = useRef(false)
    const hasFetchedDataRef = useRef(false)

    // Local storage backup for data persistence
    const [localStorageData, setLocalStorageData] = useLocalStorage<ShoppingListData | null>(
        `shopping-list-${store}`, 
        null
    );

    const [lowStockProducts, setLowStockProducts] = useState<IProductAndStock[]>(() => {
        // Initialize from local storage if available
        return localStorageData?.products || [];
    });

    // Memoized shopping list data for auto-save
    const shoppingListData = useMemo(() => ({
        id: idList,
        products: lowStockProducts,
        isUpdate
    }), [idList, lowStockProducts, isUpdate]);

    // Auto-save functionality with debouncing
    const handleAutoSave = useCallback(async (data: ShoppingListData) => {
        if (!data.products.length) return;
        
        try {
            setIsSaving(true);
            
            // Always save to local storage first
            setLocalStorageData(data);
            
            // Save to server
            await saveToServer(data);
            
            setLastSaved(new Date());
            setHasUnsavedChanges(false);
            
        } catch (error) {
            console.error('Auto-save failed:', error);
            toast({
                variant: 'destructive',
                title: 'Erro no salvamento automático',
                description: 'Dados salvos localmente. Tente salvar manualmente.'
            });
        } finally {
            setIsSaving(false);
        }
    }, [setLocalStorageData]);

    useAutoSave({
        data: shoppingListData,
        onSave: handleAutoSave,
        delay: 2000,
        enabled: hasUnsavedChanges && lowStockProducts.length > 0
    });

    // Server save function
    const saveToServer = async (data: ShoppingListData) => {
        const shoppingList: IShoppingList = {
            id: data.id,
            list_name: `Lista_de_${tenantName}__${new Date().toLocaleDateString('pt-BR')}`,
            products: data.products
        };

        if (data.isUpdate && data.id) {
            const result = await updateShoppingList(data.id, shoppingList, store || 0);
            if (!result?.data) {
                throw new Error('Failed to update shopping list');
            }
        } else {
            const result = await createShoppingList(shoppingList, store || 0);
            if (!result?.data) {
                throw new Error('Failed to create shopping list');
            }
            setIdList(result.data.data.id);
            setIsUpdate(true);
        }
    };

    const fetchList = async () => {
        if(location.state) {
            const list = location.state
            setIdList(list.id)
            setLowStockProducts(list.products)
            setIsUpdate(true)
            
            // Clear local storage when loading existing list
            setLocalStorageData(null);
        } else if (localStorageData) {
            // Restore from local storage if no location state
            setLowStockProducts(localStorageData.products);
            setIdList(localStorageData.id);
            setIsUpdate(localStorageData.isUpdate);
            
            toast({
                title: 'Dados restaurados',
                description: 'Seus dados não salvos foram restaurados automaticamente.'
            });
        }
    }

    useEffect(() => {
        // Prevent double fetch in development (React StrictMode)
        if (hasFetchedListRef.current) return;
        
        const controller = new AbortController();
        
        const loadList = async () => {
            try {
                hasFetchedListRef.current = true;
                await fetchList();
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Error loading list:', error);
                }
            }
        };
        
        loadList();
        
        return () => {
            controller.abort();
        };
    }, []); // Remove store dependency

    const fetchProducts = async () => {
        try {
            const result = await listProducts()
            if(result?.data) {
                setProducts(result.data)
            } else {
                throw new Error('Failed to fetch products');
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'JR Drogaria',
                description: 'Erro ao listar produtos. Tente recarregar a página.' + error,
            })
        }
    }

    const fetchSuppliers = async () => {
        try {
            const result = await listSuppliers()
            if(result?.data) {
                setSuppliers(result.data || [])
            } else {
                throw new Error('Failed to fetch suppliers');
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'JR Drogaria',
                description: 'Erro ao listar fornecedores' + error,
            })
        }
    }

    useEffect(() => {
        // Prevent double fetch in development (React StrictMode)
        if (hasFetchedDataRef.current) return;
        
        const controller = new AbortController();
        
        const loadData = async () => {
            try {
                hasFetchedDataRef.current = true;
                await Promise.all([
                    fetchProducts(),
                    fetchSuppliers()
                ]);
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Error fetching data:', error);
                }
            }
        };
        
        loadData();
        
        return () => {
            controller.abort();
        };
    }, []); // Remove store dependency

    const handleProductSelect = useCallback((name_product: string | undefined) => {
        const product = products.find((products) => products.product_name === name_product)
        if(product && !lowStockProducts.some((i) => i.product === product.product_name)) {
            // Open modal instead of adding directly
            setQuantityModal({
                open: true,
                productName: product.product_name,
                quantities: {
                    stockJR: 0,
                    stockGS: 0,
                    stockBARAO: 0,
                    stockLB: 0
                }
            });
        } else if (product && lowStockProducts.some((i) => i.product === product.product_name)) {
            toast({
                variant: 'destructive',
                title: 'Produto já adicionado',
                description: `${product.product_name} já está na lista.`
            });
        }
    }, [products, lowStockProducts]);
    
    const handleConfirmAddProduct = useCallback(() => {
        if (quantityModal.productName) {
            const updatedProducts = [...lowStockProducts, { 
                product: quantityModal.productName, 
                stockJR: quantityModal.quantities.stockJR, 
                stockGS: quantityModal.quantities.stockGS, 
                stockBARAO: quantityModal.quantities.stockBARAO, 
                stockLB: quantityModal.quantities.stockLB 
            }].sort((a, b) => (a.product || '').localeCompare(b.product || ''));
            
            setLowStockProducts(updatedProducts);
            setHasUnsavedChanges(true);
            
            // Close modal and reset
            setQuantityModal({ 
                open: false, 
                productName: '',
                quantities: {
                    stockJR: 0,
                    stockGS: 0,
                    stockBARAO: 0,
                    stockLB: 0
                }
            });
            
            toast({
                title: 'Produto adicionado',
                description: `${quantityModal.productName} foi adicionado à lista.`
            });
        }
    }, [quantityModal, lowStockProducts]);
    
    const handleQuantityChange = (field: 'stockJR' | 'stockGS' | 'stockBARAO' | 'stockLB', value: string) => {
        const numValue = parseInt(value) || 0;
        setQuantityModal(prev => ({
            ...prev,
            quantities: {
                ...prev.quantities,
                [field]: numValue
            }
        }));
    };

    const removeItem = useCallback((productName?: string) => {
        setConfirmationDialog({
            open: true,
            title: 'Remover produto',
            description: `Tem certeza que deseja remover "${productName}" da lista?`,
            onConfirm: () => {
                setLowStockProducts(prev => prev.filter(item => item.product !== productName));
                setHasUnsavedChanges(true);
                toast({
                    title: 'Produto removido',
                    description: `${productName} foi removido da lista.`
                });
            }
        });
    }, []);

    const openExportDialog = () => {
        if (lowStockProducts.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Lista vazia',
                description: 'Adicione produtos à lista antes de exportar.'
            });
            return;
        }
        setExportDialogOpen(true);
    };

    const handleExport = async () => {
        try {
            setIsLoading(true);
            
            // Save before export
            if (hasUnsavedChanges) {
                await saveToServer(shoppingListData);
                setHasUnsavedChanges(false);
                setLastSaved(new Date());
            }

            const supplier = suppliers.find(s => s.id?.toString() === selectedSupplier);
            
            // Export for supplier - includes Preço Unitário column, excludes stock
            await exportLeadsToCSV(lowStockProducts, {
                type: 'supplier',
                supplierName: supplier?.supplier_name || 'A definir',
                tenantName: tenantName
            });
            
            setExportDialogOpen(false);
            setSelectedSupplier(""); // Reset supplier selection
            toast({
                title: 'Exportação concluída',
                description: 'Lista exportada com sucesso! O arquivo inclui a coluna "Preço Unitário" para preencher.'
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro na exportação',
                description: 'Não foi possível exportar a lista.' + error,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleManualSave = async () => {
        if (!lowStockProducts.length) {
            toast({
                variant: 'destructive',
                title: 'Lista vazia',
                description: 'Adicione produtos à lista antes de salvar.'
            });
            return;
        }

        try {
            setIsLoading(true);
            await saveToServer(shoppingListData);
            setHasUnsavedChanges(false);
            setLastSaved(new Date());
            
            toast({
                title: 'Lista salva',
                description: 'Lista salva com sucesso!'
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao salvar',
                description: 'Não foi possível salvar a lista. Dados mantidos localmente.' + error,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleStockChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement>, 
        product?: string, 
        stockField: keyof Pick<IProductAndStock, 'stockJR' | 'stockGS' | 'stockBARAO' | 'stockLB'> = 'stockJR'
    ) => {
        const value = e.target.value;
        const stockValue = value === '' ? 0 : Math.max(0, parseInt(value) || 0);
        
        setLowStockProducts(prev => {
            const existingProductIndex = prev.findIndex(item => item.product === product);
            
            if (existingProductIndex !== -1) {
                const updatedProducts = [...prev];
                updatedProducts[existingProductIndex] = {
                    ...updatedProducts[existingProductIndex],
                    [stockField]: stockValue
                };
                return updatedProducts;
            }
            
            return prev;
        });
        
        setHasUnsavedChanges(true);
    }, []);

    const handleBestPricesExport = async () => {
        if (!lowStockProducts.length) {
            toast({
                variant: 'destructive',
                title: 'Lista vazia',
                description: 'Adicione produtos à lista antes de exportar.'
            });
            return;
        }

        try {
            setIsLoading(true);
            
            // Save before export
            if (hasUnsavedChanges) {
                await saveToServer(shoppingListData);
                setHasUnsavedChanges(false);
                setLastSaved(new Date());
            }

            // Export best prices analysis - includes stock columns, excludes Preço Unitário
            await exportBestPrices(lowStockProducts, tenantName);
            
            toast({
                title: 'Análise exportada',
                description: 'Análise de melhores preços exportada com sucesso! Produtos organizados em ordem alfabética.'
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro na exportação',
                description: 'Não foi possível exportar a análise.' + error,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Save status indicator
    const SaveStatus = () => {
        if (isSaving) {
            return (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                    <LoadingSpinner size="sm" />
                    Salvando...
                </div>
            );
        }
        
        if (hasUnsavedChanges) {
            return (
                <div className="flex items-center gap-2 text-sm text-orange-600">
                    <AlertCircle className="h-4 w-4" />
                    Alterações não salvas
                </div>
            );
        }
        
        if (lastSaved) {
            return (
                <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Salvo às {lastSaved.toLocaleTimeString('pt-BR')}
                </div>
            );
        }
        
        return null;
    };

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
            <div className="container mx-auto px-4 py-4 max-w-full min-h-screen bg-gray-50">
                {/* Header with save status */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Gerenciador de Listas de Compras
                    </h1>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <SaveStatus />
                        <Button
                            onClick={handleManualSave}
                            disabled={isLoading || !lowStockProducts.length}
                            className="flex items-center gap-2 w-full sm:w-auto"
                            size="sm"
                        >
                            {isLoading ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <SaveIcon className="h-4 w-4" />
                            )}
                            Salvar
                        </Button>
                    </div>
                </div>

                {/* Product selection card */}
                <Card className="mb-6 shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg md:text-xl text-center">
                            Selecione os Produtos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AutocompleteFilter 
                            onClick={handleProductSelect} 
                            items={products}
                        />
                    </CardContent>
                </Card>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <Button
                        onClick={openExportDialog}
                        disabled={lowStockProducts.length === 0 || isLoading}
                        className="flex items-center justify-center gap-2 w-full sm:flex-1"
                        variant="outline"
                    >
                        <Download className="h-5 w-5"/>
                        Exportar para Fornecedor
                    </Button>
                    <Button
                        onClick={handleBestPricesExport}
                        disabled={lowStockProducts.length === 0 || isLoading}
                        className="flex items-center justify-center gap-2 w-full sm:flex-1"
                        variant="outline"
                    >
                        <Download className="h-5 w-5"/>
                        Exportar Análise de Estoque
                    </Button>
                    <Button
                        onClick={() => navigate(`/shopping/price-comparison/${idList}`)}
                        disabled={!idList || isLoading}
                        className="flex items-center justify-center gap-2 w-full sm:flex-1 bg-green-700 hover:bg-green-800"
                    >
                        <BarChart2 className="h-5 w-5"/>
                        Comparar Preços
                    </Button>
                </div>

                {/* Products list */}
                {lowStockProducts.length > 0 && (
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg md:text-xl text-center">
                                Produtos na Lista ({lowStockProducts.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* Desktop view - Table */}
                            <div className="hidden lg:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead className="font-semibold">Produto</TableHead>
                                            <TableHead className="font-semibold text-center">JR</TableHead>
                                            <TableHead className="font-semibold text-center">GS</TableHead>
                                            <TableHead className="font-semibold text-center">BARÃO</TableHead>
                                            <TableHead className="font-semibold text-center">LB</TableHead>
                                            <TableHead className="font-semibold text-center">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lowStockProducts.map((product, index) => (
                                            <TableRow key={`${product.product}-${index}`} className="hover:bg-gray-50">
                                                <TableCell className="font-medium max-w-xs">
                                                    <div className="truncate" title={product.product}>
                                                        {product.product}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Input 
                                                        value={product.stockJR || ''}
                                                        onChange={(e) => handleStockChange(e, product.product, 'stockJR')} 
                                                        className="w-20 mx-auto text-center" 
                                                        type="number"
                                                        min="0"
                                                        inputMode="numeric"
                                                        placeholder="0"
                                                    /> 
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Input 
                                                        value={product.stockGS || ''}
                                                        onChange={(e) => handleStockChange(e, product.product, 'stockGS')} 
                                                        className="w-20 mx-auto text-center" 
                                                        type="number"
                                                        min="0"
                                                        inputMode="numeric"
                                                        placeholder="0"
                                                    /> 
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Input 
                                                        value={product.stockBARAO || ''}
                                                        onChange={(e) => handleStockChange(e, product.product, 'stockBARAO')} 
                                                        className="w-20 mx-auto text-center" 
                                                        type="number"
                                                        min="0"
                                                        inputMode="numeric"
                                                        placeholder="0"
                                                    /> 
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Input 
                                                        value={product.stockLB || ''}
                                                        onChange={(e) => handleStockChange(e, product.product, 'stockLB')} 
                                                        className="w-20 mx-auto text-center" 
                                                        type="number"
                                                        min="0"
                                                        inputMode="numeric"
                                                        placeholder="0"
                                                    /> 
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeItem(product.product)}
                                                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4"/>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            
                            {/* Mobile/Tablet view - Card based layout */}
                            <div className="lg:hidden p-4 space-y-4">
                                {lowStockProducts.map((product, index) => (
                                    <Card key={`${product.product}-${index}`} className="relative border border-gray-200 shadow-sm">
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-base font-medium pr-8 leading-tight">
                                                    {product.product}
                                                </CardTitle>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeItem(product.product)}
                                                    className="text-red-600 hover:text-red-800 hover:bg-red-50 -mt-1 -mr-2"
                                                >
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor={`mobile-stockJR-${index}`} className="text-sm font-medium">
                                                        JR
                                                    </Label>
                                                    <Input 
                                                        value={product.stockJR || ''}
                                                        onChange={(e) => handleStockChange(e, product.product, 'stockJR')} 
                                                        className="w-full text-center" 
                                                        id={`mobile-stockJR-${index}`} 
                                                        type="number"
                                                        min="0"
                                                        inputMode="numeric"
                                                        placeholder="0"
                                                    /> 
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor={`mobile-stockGS-${index}`} className="text-sm font-medium">
                                                        GS
                                                    </Label>
                                                    <Input 
                                                        value={product.stockGS || ''}
                                                        onChange={(e) => handleStockChange(e, product.product, 'stockGS')} 
                                                        className="w-full text-center" 
                                                        id={`mobile-stockGS-${index}`} 
                                                        type="number"
                                                        min="0"
                                                        inputMode="numeric"
                                                        placeholder="0"
                                                    /> 
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor={`mobile-stockBARAO-${index}`} className="text-sm font-medium">
                                                        BARÃO
                                                    </Label>
                                                    <Input 
                                                        value={product.stockBARAO || ''}
                                                        onChange={(e) => handleStockChange(e, product.product, 'stockBARAO')} 
                                                        className="w-full text-center" 
                                                        id={`mobile-stockBARAO-${index}`} 
                                                        type="number"
                                                        min="0"
                                                        inputMode="numeric"
                                                        placeholder="0"
                                                    /> 
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor={`mobile-stockLB-${index}`} className="text-sm font-medium">
                                                        LB
                                                    </Label>
                                                    <Input 
                                                        value={product.stockLB || ''}
                                                        onChange={(e) => handleStockChange(e, product.product, 'stockLB')} 
                                                        className="w-full text-center" 
                                                        id={`mobile-stockLB-${index}`} 
                                                        type="number"
                                                        min="0"
                                                        inputMode="numeric"
                                                        placeholder="0"
                                                    /> 
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Empty state */}
                {lowStockProducts.length === 0 && (
                    <Card className="text-center py-12 shadow-sm">
                        <CardContent>
                            <div className="text-gray-500 mb-4">
                                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">Nenhum produto adicionado</p>
                                <p className="text-sm">Use o campo acima para adicionar produtos à sua lista</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Export Dialog */}
                <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Exportar Lista de Compras</DialogTitle>
                            <DialogDescription>
                                Selecione um fornecedor (opcional) para exportar a lista. Se não selecionar, será exportada uma lista genérica.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Label htmlFor="supplier-select" className="text-sm font-medium">
                                Fornecedor (Opcional)
                            </Label>
                            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                                <SelectTrigger className="w-full mt-2">
                                    <SelectValue placeholder="Selecione um fornecedor (opcional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {suppliers.map((supplier) => (
                                        <SelectItem key={supplier.id} value={supplier.id?.toString() || ''}>
                                            {supplier.supplier_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter className="flex-col sm:flex-row gap-2">
                            <Button 
                                variant="outline" 
                                onClick={() => setExportDialogOpen(false)}
                                className="w-full sm:w-auto"
                            >
                                Cancelar
                            </Button>
                            <Button 
                                onClick={handleExport}
                                disabled={isLoading}
                                className="w-full sm:w-auto"
                            >
                                {isLoading ? (
                                    <>
                                        <LoadingSpinner size="sm" className="mr-2" />
                                        Exportando...
                                    </>
                                ) : (
                                    <>
                                        <Download className="h-4 w-4 mr-2" />
                                        Exportar
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Confirmation Dialog */}
                <ConfirmationDialog
                    open={confirmationDialog.open}
                    onOpenChange={(open) => setConfirmationDialog(prev => ({ ...prev, open }))}
                    title={confirmationDialog.title}
                    description={confirmationDialog.description}
                    onConfirm={confirmationDialog.onConfirm}
                    variant="destructive"
                    confirmText="Remover"
                    cancelText="Cancelar"
                />
                
                {/* Quantity Modal */}
                <Dialog open={quantityModal.open} onOpenChange={(open) => {
                    if (!open) {
                        // Reset modal when closing
                        setQuantityModal({ 
                            open: false, 
                            productName: '',
                            quantities: {
                                stockJR: 0,
                                stockGS: 0,
                                stockBARAO: 0,
                                stockLB: 0
                            }
                        });
                    }
                }}>
                    <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-lg md:text-xl">Adicionar Quantidades</DialogTitle>
                            <DialogDescription>
                                <span className="font-semibold text-sm md:text-base text-gray-800 break-words">{quantityModal.productName}</span>
                                <br className="hidden sm:block" />
                                <span className="text-xs md:text-sm">Informe as quantidades para cada loja:</span>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="modal-stockJR" className="text-sm font-medium flex items-center justify-between">
                                    JR
                                    <span className="text-xs text-gray-500 font-normal sm:hidden">Quantidade</span>
                                </Label>
                                <Input 
                                    value={quantityModal.quantities.stockJR || ''}
                                    onChange={(e) => handleQuantityChange('stockJR', e.target.value)} 
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleConfirmAddProduct();
                                        }
                                    }}
                                    className="w-full text-center text-lg sm:text-base h-12 sm:h-10" 
                                    id="modal-stockJR" 
                                    type="number"
                                    min="0"
                                    inputMode="numeric"
                                    placeholder="0"
                                    autoFocus
                                /> 
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="modal-stockGS" className="text-sm font-medium flex items-center justify-between">
                                    GS
                                    <span className="text-xs text-gray-500 font-normal sm:hidden">Quantidade</span>
                                </Label>
                                <Input 
                                    value={quantityModal.quantities.stockGS || ''}
                                    onChange={(e) => handleQuantityChange('stockGS', e.target.value)} 
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleConfirmAddProduct();
                                        }
                                    }}
                                    className="w-full text-center text-lg sm:text-base h-12 sm:h-10" 
                                    id="modal-stockGS" 
                                    type="number"
                                    min="0"
                                    inputMode="numeric"
                                    placeholder="0"
                                /> 
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="modal-stockBARAO" className="text-sm font-medium flex items-center justify-between">
                                    BARÃO
                                    <span className="text-xs text-gray-500 font-normal sm:hidden">Quantidade</span>
                                </Label>
                                <Input 
                                    value={quantityModal.quantities.stockBARAO || ''}
                                    onChange={(e) => handleQuantityChange('stockBARAO', e.target.value)} 
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleConfirmAddProduct();
                                        }
                                    }}
                                    className="w-full text-center text-lg sm:text-base h-12 sm:h-10" 
                                    id="modal-stockBARAO" 
                                    type="number"
                                    min="0"
                                    inputMode="numeric"
                                    placeholder="0"
                                /> 
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="modal-stockLB" className="text-sm font-medium flex items-center justify-between">
                                    LB
                                    <span className="text-xs text-gray-500 font-normal sm:hidden">Quantidade</span>
                                </Label>
                                <Input 
                                    value={quantityModal.quantities.stockLB || ''}
                                    onChange={(e) => handleQuantityChange('stockLB', e.target.value)} 
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleConfirmAddProduct();
                                        }
                                    }}
                                    className="w-full text-center text-lg sm:text-base h-12 sm:h-10" 
                                    id="modal-stockLB" 
                                    type="number"
                                    min="0"
                                    inputMode="numeric"
                                    placeholder="0"
                                /> 
                            </div>
                        </div>
                        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
                            <Button 
                                variant="outline" 
                                onClick={() => setQuantityModal({ 
                                    open: false, 
                                    productName: '',
                                    quantities: {
                                        stockJR: 0,
                                        stockGS: 0,
                                        stockBARAO: 0,
                                        stockLB: 0
                                    }
                                })}
                                className="w-full sm:w-auto h-11 sm:h-10"
                            >
                                Cancelar
                            </Button>
                            <Button 
                                variant="outline"
                                onClick={() => {
                                    // Add product with zero quantities
                                    setQuantityModal(prev => ({
                                        ...prev,
                                        quantities: {
                                            stockJR: 0,
                                            stockGS: 0,
                                            stockBARAO: 0,
                                            stockLB: 0
                                        }
                                    }));
                                    handleConfirmAddProduct();
                                }}
                                className="w-full sm:w-auto h-11 sm:h-10"
                            >
                                <span className="hidden sm:inline">Adicionar sem Qtd</span>
                                <span className="sm:hidden">Sem Quantidade</span>
                            </Button>
                            <Button 
                                onClick={handleConfirmAddProduct}
                                className="w-full sm:w-auto bg-green-700 hover:bg-green-800 h-11 sm:h-10"
                            >
                                Adicionar Produto
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </ErrorBoundary>
    )
};

export default ShoppingList;