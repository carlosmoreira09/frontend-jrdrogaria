import React, {useState} from "react";
import {useStore} from "../hooks/store.tsx";
import {useToast} from "../hooks/use-toast.ts";
import * as XLSX from "xlsx"
import {Product} from "../types/types.ts";
import {createMultipleProducts} from "../service/productService.ts";
import {Button} from "./ui/button.tsx";
import {Upload} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog.tsx";


interface ProductExcelUploadProps {
    onUploadComplete: () => void;
}

const ProductExcelUpload: React.FC<ProductExcelUploadProps> = ({ onUploadComplete }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [validProducts, setValidProducts] = useState<Product[]>([]);
    const { store } = useStore();
    const { toast } = useToast();

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !store) return;

        setIsUploading(true);

        try {
            // Read the Excel file
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const data = event.target?.result;
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);

                    // Log the entire 5th row (index 4) to see all available columns
                    console.log('Row at index 4:', jsonData[4]);
                    
                    // Log all column headers to see the actual keys
                    if (jsonData[4]) {
                        console.log('All columns in row 4:', Object.keys(jsonData[4]));
                    }

                    // Extract products from the Excel data using the correct column key
                    const products: Product[] = jsonData.map((row: any) => ({
                        product_name: row['__EMPTY_3'] // Using the actual key from the Excel file
                    }));

                    console.log(products);
                    
                    // Filter out any undefined product names
                    const productsToAdd = products.filter(p => p.product_name);

                    if (productsToAdd.length === 0) {
                        toast({
                            variant: 'destructive',
                            title: 'JR Drogaria',
                            description: 'Nenhum produto válido encontrado na planilha. Verifique se a coluna "__EMPTY_3" existe.'
                        });
                        setIsUploading(false);
                        return;
                    }

                    // Store valid products and open confirmation dialog
                    setValidProducts(productsToAdd);
                    setConfirmDialogOpen(true);
                    setIsUploading(false);
                    
                } catch (error) {
                    console.error('Error processing Excel file:', error);
                    toast({
                        variant: 'destructive',
                        title: 'JR Drogaria',
                        description: 'Erro ao processar o arquivo Excel'
                    });
                    setIsUploading(false);
                }
            };

            reader.readAsBinaryString(file);
        } catch (error) {
            console.error('Error uploading file:', error);
            toast({
                variant: 'destructive',
                title: 'JR Drogaria',
                description: 'Erro ao fazer upload do arquivo'
            });
            setIsUploading(false);
        }
    };

    const handleConfirmUpload = async () => {
        if (validProducts.length === 0 || !store) return;
        
        setIsUploading(true);
        try {
            const result = await createMultipleProducts(validProducts);
            
            if (result?.message) {
                toast({
                    variant: 'default',
                    title: 'JR Drogaria',
                    description: `${validProducts.length} produtos importados com sucesso`
                });
                onUploadComplete();
            } else {
                toast({
                    variant: 'destructive',
                    title: 'JR Drogaria',
                    description: 'Erro ao importar produtos'
                });
            }
        } catch (error) {
            console.error('Error uploading products:', error);
            toast({
                variant: 'destructive',
                title: 'JR Drogaria',
                description: 'Erro ao importar produtos'
            });
        } finally {
            setIsUploading(false);
            setConfirmDialogOpen(false);
            setValidProducts([]);
        }
    };

    return (
        <>
            <div className="flex items-center">
                <input
                    type="file"
                    id="excel-upload"
                    accept=".xlsx, .xls"
                    className="hidden"
                    onChange={handleFileUpload}
                />
                <label htmlFor="excel-upload">
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 cursor-pointer"
                        disabled={isUploading}
                        asChild
                    >
                        <span>
                            <Upload className="h-5 w-5" />
                            {isUploading ? 'Processando...' : 'Importar Excel'}
                        </span>
                    </Button>
                </label>
            </div>

            <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar Importação</DialogTitle>
                        <DialogDescription>
                            Você está prestes a importar {validProducts.length} produtos.
                            Deseja continuar?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[200px] overflow-y-auto mt-4">
                        <ul className="list-disc pl-5 space-y-1">
                            {validProducts.slice(0, 10).map((product, index) => (
                                <li key={index} className="text-sm">{product.product_name}</li>
                            ))}
                            {validProducts.length > 10 && (
                                <li className="text-sm font-semibold">...e mais {validProducts.length - 10} produtos</li>
                            )}
                        </ul>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmDialogOpen(false)}
                            disabled={isUploading}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleConfirmUpload}
                            disabled={isUploading}
                        >
                            {isUploading ? 'Importando...' : 'Confirmar Importação'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ProductExcelUpload;