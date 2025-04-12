import React, { useState } from "react";
import { Button } from "../../components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table.tsx";
import { Upload, FileDown } from "lucide-react";
import * as XLSX from 'xlsx';
import { toast } from "../../hooks/use-toast.ts";

interface SupplierPrice {
  productName: string;
  price: number;
  supplier: string;
}

interface ProductComparison {
  productName: string;
  suppliers: {
    supplier: string;
    price: number;
  }[];
  bestSupplier: string;
  bestPrice: number;
}

const PriceComparison: React.FC = () => {
  const [supplierPrices, setSupplierPrices] = useState<SupplierPrice[]>([]);
  const [comparisons, setComparisons] = useState<ProductComparison[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [bestPricesList, setBestPricesList] = useState<{productName: string, price: number, supplier: string}[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Check if the required columns exist
        const firstRow = jsonData[0] as Record<string, any>;
        if (!firstRow || !('Preço Unitário' in firstRow) || !('Fornecedor' in firstRow) || !('Nome' in firstRow)) {
          toast({
            variant: 'destructive',
            title: 'Erro no formato do arquivo',
            description: 'O arquivo deve conter as colunas "Preço Unitário", "Fornecedor" e "Nome"'
          });
          return;
        }

        // Extract the data we need
        const extractedData: SupplierPrice[] = jsonData.map((row: any) => {
          // Convert price string to number (handling comma as decimal separator)
          const priceStr = String(row['Preço Unitário']).replace(',', '.');
          const price = parseFloat(priceStr);
          
          return {
            productName: row['Nome'],
            price: isNaN(price) ? 0 : price,
            supplier: row['Fornecedor'] || 'Desconhecido'
          };
        }).filter(item => item.price > 0 && item.productName);

        // Add to existing data
        setSupplierPrices(prev => [...prev, ...extractedData]);
        setUploadedFiles(prev => [...prev, file.name]);
        
        // Update comparisons
        updateComparisons([...supplierPrices, ...extractedData]);
        
        toast({
          title: 'Arquivo processado',
          description: `${file.name} foi processado com sucesso`
        });
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao processar arquivo',
          description: 'Ocorreu um erro ao processar o arquivo Excel'
        });
      }
    };

    reader.onerror = () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao ler arquivo',
        description: 'Não foi possível ler o arquivo'
      });
    };

    reader.readAsBinaryString(file);
  };

  const updateComparisons = (prices: SupplierPrice[]) => {
    // Group by product name
    const productMap = new Map<string, SupplierPrice[]>();
    
    prices.forEach(price => {
      if (!productMap.has(price.productName)) {
        productMap.set(price.productName, []);
      }
      productMap.get(price.productName)?.push(price);
    });
    
    // Create comparisons
    const newComparisons: ProductComparison[] = [];
    const bestPrices: {productName: string, price: number, supplier: string}[] = [];
    
    productMap.forEach((prices, productName) => {
      // Find the best price
      let bestPrice = Infinity;
      let bestSupplier = '';
      
      const suppliers = prices.map(price => {
        if (price.price < bestPrice) {
          bestPrice = price.price;
          bestSupplier = price.supplier;
        }
        
        return {
          supplier: price.supplier,
          price: price.price
        };
      });
      
      newComparisons.push({
        productName,
        suppliers,
        bestSupplier,
        bestPrice
      });
      
      bestPrices.push({
        productName,
        price: bestPrice,
        supplier: bestSupplier
      });
    });
    
    setComparisons(newComparisons);
    setBestPricesList(bestPrices);
  };

  const generateBestPricesList = () => {
    if (bestPricesList.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Nenhum dado disponível',
        description: 'Faça o upload de arquivos Excel para gerar a lista'
      });
      return;
    }
    
    // Group products by supplier
    const supplierMap = new Map<string, {productName: string, price: number}[]>();
    
    bestPricesList.forEach(item => {
      if (!supplierMap.has(item.supplier)) {
        supplierMap.set(item.supplier, []);
      }
      supplierMap.get(item.supplier)?.push({
        productName: item.productName,
        price: item.price
      });
    });
    
    // Create a workbook with a sheet for each supplier
    const workbook = XLSX.utils.book_new();
    
    supplierMap.forEach((products, supplier) => {
      // Create worksheet data
      const wsData = products.map(product => ({
        'Nome do Produto': product.productName,
        'Preço Unitário': product.price,
        'Fornecedor': supplier
      }));
      
      // Create worksheet and add to workbook
      const ws = XLSX.utils.json_to_sheet(wsData);
      XLSX.utils.book_append_sheet(workbook, ws, supplier.substring(0, 30)); // Limit sheet name length
    });
    
    // Create a summary sheet with all best prices
    const summaryData = bestPricesList.map(item => ({
      'Nome do Produto': item.productName,
      'Preço Unitário': item.price,
      'Fornecedor': item.supplier
    }));
    
    const summaryWs = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWs, 'Resumo Melhores Preços');
    
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `Lista_Melhores_Preços_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast({
      title: 'Lista gerada com sucesso',
      description: 'A lista com os melhores preços foi gerada e está sendo baixada'
    });
  };

  const clearData = () => {
    setSupplierPrices([]);
    setComparisons([]);
    setUploadedFiles([]);
    setBestPricesList([]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Comparação de Preços entre Fornecedores</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-center">Upload de Arquivos Excel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 border-2 border-dashed border-gray-300 p-4 rounded-md hover:bg-gray-50">
                <Upload className="h-5 w-5" />
                <span>Selecionar arquivo Excel</span>
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            
            {uploadedFiles.length > 0 && (
              <div className="w-full">
                <h3 className="font-semibold mb-2">Arquivos processados:</h3>
                <ul className="list-disc pl-5">
                  {uploadedFiles.map((fileName, index) => (
                    <li key={index}>{fileName}</li>
                  ))}
                </ul>
                <Button 
                  variant="destructive" 
                  className="mt-4"
                  onClick={clearData}
                >
                  Limpar dados
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {comparisons.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Comparação de Preços</span>
              <Button 
                onClick={generateBestPricesList}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <FileDown className="h-5 w-5" />
                Gerar Lista de Melhores Preços
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Melhor Fornecedor</TableHead>
                  <TableHead>Melhor Preço</TableHead>
                  <TableHead>Todos os Fornecedores</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisons.map((comparison, index) => (
                  <TableRow key={index}>
                    <TableCell>{comparison.productName}</TableCell>
                    <TableCell className="font-medium">{comparison.bestSupplier}</TableCell>
                    <TableCell className="font-medium">R$ {comparison.bestPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <ul className="list-disc pl-5">
                        {comparison.suppliers.map((supplier, idx) => (
                          <li key={idx} className={supplier.price === comparison.bestPrice ? "text-green-600 font-semibold" : ""}>
                            {supplier.supplier}: R$ {supplier.price.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PriceComparison;
