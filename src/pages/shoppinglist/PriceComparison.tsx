

import React, { useEffect, useRef, useState} from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Upload, FileDown } from "lucide-react";
import * as XLSX from 'xlsx';
import { toast } from "../../hooks/use-toast";
import { useParams} from "react-router-dom";
import {IProductAndStock} from "../../types/types.ts";
import {findOneShoppingList} from "../../services/shoppingListService.ts";
import {useStore} from "../../hooks/store.tsx";

interface SupplierPrice {
  productName: string;
  price: number;
  supplier: string;
  stockJR?: number;
  stockGS?: number;
  stockBARAO?: number;
  stockLB?: number;
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

export const PriceComparison: React.FC = () => {
  const [supplierPrices, setSupplierPrices] = useState<SupplierPrice[]>([]);
  const [comparisons, setComparisons] = useState<ProductComparison[]>([]);
  const [products,setProducts] = useState<IProductAndStock[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [bestPricesList, setBestPricesList] = useState<{productName: string, price: number, supplier: string, stockJR?: number, stockGS?: number, stockBARAO?: number, stockLB?: number}[]>([]);
  const { store } = useStore()
  const { id } = useParams();
  const hasFetchedRef = useRef(false);

  const fetchList = async () => {
    if(id) {
      const response = await findOneShoppingList(Number(id), Number(store));
      if(response && response.data) {
      setProducts(response.data.products)
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'JR DROGARIA',
        description: 'Erro ao Carregar ID da lista, volte na HOME'
      });
    }
  }
  useEffect(() => {
    // Prevent double fetch in development (React StrictMode)
    if (hasFetchedRef.current) return;
    
    const controller = new AbortController();
    
    const loadList = async () => {
      try {
        hasFetchedRef.current = true;
        await fetchList();
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error fetching list:', error);
        }
      }
    };
    
    loadList();
    
    return () => {
      controller.abort();
    };
  }, []); // No dependencies to prevent re-fetching

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
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true, header: 1, defval: '' });

        // Check if we have enough data
        if (!jsonData || jsonData.length < 4) {
          toast({
            variant: 'destructive',
            title: 'Arquivo incompleto',
            description: 'O arquivo não contém dados suficientes'
          });
          return;
        }

        // Check if the required columns exist in the header row (now at index 0)
        const headerRow = jsonData[4] as Record<string, any>;
        if (!headerRow) {
          toast({
            variant: 'destructive',
            title: 'Erro no formato do arquivo',
            description: 'Não foi possível encontrar o cabeçalho na primeira linha'
          });
          return;
        }

        // Helper function to check if a property with a specific value exists in the object
        const hasPropertyWithValue = (obj: Record<string, any>, value: string): boolean => {
          return Object.values(obj).some(val =>
              typeof val === 'string' && val.includes(value)
          );
        };

        // Check for required columns in the values rather than keys
        const hasPriceColumn = hasPropertyWithValue(headerRow, 'Preço Unitário');
        const hasProductColumn = hasPropertyWithValue(headerRow, 'Produto');

        // We no longer check for supplier column in the header row since it's now fixed in cell B3
        if (!hasPriceColumn || !hasProductColumn) {
          toast({
            variant: 'destructive',
            title: 'Erro no formato do arquivo',
            description: 'O arquivo deve conter as colunas  "Produto(A)" e "Preço Unitário(C)"'
          });
          return;
        }

        // Helper function to find the key for a specific column value
        const findKeyForValue = (obj: Record<string, any>, value: string): string | null => {
          for (const key in obj) {
            if (typeof obj[key] === 'string' && obj[key].includes(value)) {
              return key;
            }
          }
          return null;
        };

        // Find the keys for our required columns
        const priceKey = findKeyForValue(headerRow, 'Preço Unitário');
        const productKey = findKeyForValue(headerRow, 'Produto');

        // Get supplier from cell B2 (index 1 in the jsonData array, and index 1 for the B column)
        const supplierRow = jsonData[1] as Record<string, any>;
        const supplierKey = '0';
          const supplierKey2 = '1';
        const supplierName = supplierRow[supplierKey]
          const supplierName2 = supplierRow[supplierKey2]
        if (!priceKey || !productKey) {
          toast({
            variant: 'destructive',
            title: 'Erro interno',
            description: 'Não foi possível determinar as colunas corretamente'
          });
          return;
        }

        // Extract the data starting from row 6 (index 5), since we now have 5 header rows for supplier format
        const extractedData: SupplierPrice[] = [];

        for (let i = 5; i < jsonData.length; i++) {
          const row = jsonData[i] as Record<string, any>;

          // Skip rows without required data
          if (!row[priceKey] || !row[productKey]) continue;

          // Convert price string to number (handling comma as decimal separator)
          const priceStr = String(row[priceKey]).replace(',', '.');
          const price = parseFloat(priceStr);


          if (!isNaN(price) && price > 0) {
            extractedData.push({
              productName: row[productKey],
              price: price,
              supplier: supplierName.trim().split(':')[1] || supplierName2, // Use the supplier from cell B2
            });
          }
        }

        if (extractedData.length === 0) {
          toast({
            variant: 'destructive',
            title: 'Nenhum dado válido',
            description: 'Não foi possível extrair dados válidos do arquivo'
          });
          return;
        }

        // Sort extracted data alphabetically before adding
        const sortedExtractedData = extractedData.sort((a, b) => 
          a.productName.toLowerCase().localeCompare(b.productName.toLowerCase(), 'pt-BR')
        );

        // Add to existing data and sort the combined list
        const newSupplierPrices = [...supplierPrices, ...sortedExtractedData].sort((a, b) => 
          a.productName.toLowerCase().localeCompare(b.productName.toLowerCase(), 'pt-BR')
        );
        
        setSupplierPrices(newSupplierPrices);
        setUploadedFiles(prev => [...prev, file.name]);

        // Update comparisons with sorted data
        updateComparisons(newSupplierPrices);

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
    const bestPrices: {productName: string, price: number, supplier: string, stockJR?: number, stockGS?: number, stockBARAO?: number, stockLB?: number}[] = [];

    // Sort product names alphabetically
    const sortedProductNames = Array.from(productMap.keys()).sort((a, b) => 
      a.toLowerCase().localeCompare(b.toLowerCase(), 'pt-BR')
    );

    sortedProductNames.forEach(productName => {
      const prices = productMap.get(productName)!;
      
      // Find the best price
      let bestPrice = Infinity;
      let bestSupplier = '';

      // Sort suppliers alphabetically for consistent display
      const suppliers = prices
        .map(price => {
          if (price.price < bestPrice) {
            bestPrice = price.price;
            bestSupplier = price.supplier;
          }
          return {
            supplier: price.supplier,
            price: price.price
          };
        })
        .sort((a, b) => a.supplier.toLowerCase().localeCompare(b.supplier.toLowerCase(), 'pt-BR'));

      newComparisons.push({
        productName,
        suppliers,
        bestSupplier,
        bestPrice
      });

      bestPrices.push({
        productName,
        price: bestPrice,
        supplier: bestSupplier,
      });
    });

    // Sort final lists alphabetically by product name
    const sortedComparisons = newComparisons.sort((a, b) => 
      a.productName.toLowerCase().localeCompare(b.productName.toLowerCase(), 'pt-BR')
    );
    
    const sortedBestPrices = bestPrices.sort((a, b) => 
      a.productName.toLowerCase().localeCompare(b.productName.toLowerCase(), 'pt-BR')
    );

    setComparisons(sortedComparisons);
    setBestPricesList(sortedBestPrices);
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

    // Validate alphabetical order before export
    const isOrderValid = validateListsOrder();
    if (!isOrderValid) {
      console.warn('⚠️ Algumas listas não estão em ordem alfabética, mas a exportação continuará com ordenação automática');
    }

    // Group products by supplier
    const supplierMap = new Map<string, {productName: string, price: number, stockJR?: number, stockGS?: number, stockBARAO?: number, stockLB?: number}[]>();
    bestPricesList.forEach(item => {
      // Only add the product to the supplier that offers the best price
      if (!supplierMap.has(item.supplier)) {
        supplierMap.set(item.supplier, []);
      }
      supplierMap.get(item.supplier)?.push({
        productName: item.productName,
        price: item.price,
        stockJR: products.find((product) => (product.product === item.productName))?.stockJR,
        stockGS: products.find((product) => (product.product === item.productName))?.stockGS,
        stockBARAO: products.find((product) => (product.product === item.productName))?.stockBARAO,
        stockLB: products.find((product) => (product.product === item.productName))?.stockLB
      });
    });

    // Create a workbook with a sheet for each supplier
    const workbook = XLSX.utils.book_new();

    // Helper function to sanitize sheet names
    const sanitizeSheetName = (name: string): string => {
      // Replace invalid characters with underscores
      const sanitized = name.replace(/[:/?*[\]]/g, '_');
      // Limit length to 30 characters
      return sanitized.substring(0, 30);
    };

    // Sort suppliers alphabetically and create a sheet for each supplier
    const sortedSuppliers = Array.from(supplierMap.keys()).sort((a, b) => 
      a.toLowerCase().localeCompare(b.toLowerCase(), 'pt-BR')
    );

    sortedSuppliers.forEach(supplier => {
      const products = supplierMap.get(supplier)!;
      // Sort products alphabetically by name before creating the worksheet
      const sortedProducts = products.sort((a, b) => 
        a.productName.toLowerCase().localeCompare(b.productName.toLowerCase(), 'pt-BR')
      );

      // Prepare data for the worksheet
      const data = sortedProducts.map(product => ({
        'Nome do Produto': product.productName,
        'Preço Unitário': product.price.toString().replace('.', ','), // Convert decimal point to comma
        'Fornecedor': supplier,
        'JR': product.stockJR || 0,
        'GS': product.stockGS || 0,
        'BARÃO': product.stockBARAO || 0,
        'LB': product.stockLB || 0,
        'Quantidade': 0,
        'Total': { formula: 'PRODUCT(B{row},H{row})' }
      }));

      // Add total row
      data.push({
        'Nome do Produto': 'TOTAL GERAL',
        'Preço Unitário': '',
        'Fornecedor': '',
        'JR': Number(''),
        'GS': Number(''),
        'BARÃO': Number(''),
        'LB': Number(''),
        'Quantidade': 1,
        'Total': { formula: `SUM(I2:I${data.length})` }
      });

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet([]);

      // Add headers
      const headers = Object.keys(data[0]);
      XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' });

      // Process each row with formulas
      let rowIndex = 1; // Start after headers
      data.forEach(row => {
        headers.forEach((header, colIdx) => {
          const cellRef = XLSX.utils.encode_cell({r: rowIndex, c: colIdx});

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const value = row[header];

          // Handle formula objects
          if (value && typeof value === 'object' && value.formula) {
            let formula = value.formula;
            // Replace {row} with actual row number
            formula = formula.replace(/{row}/g, (rowIndex + 1).toString());
            ws[cellRef] = { t: 'n', f: formula };
          } else if (header === 'Preço Unitário' && value !== '') {
            // Ensure price is treated as a number
            ws[cellRef] = { t: 'n', v: parseFloat(value.replace(',', '.')) };
          } else {
            // Regular value
            ws[cellRef] = { v: value };
          }
        });
        rowIndex++;
      });

      // Set column widths
      ws['!cols'] = [
        { wch: 40 }, // Nome do Produto
        { wch: 15 }, // Preço Unitário
        { wch: 20 }, // Fornecedor
        { wch: 10 }, // JR
        { wch: 10 }, // GS
        { wch: 10 }, // BARÃO
        { wch: 10 }, // LB
        { wch: 15 }, // Quantidade
        { wch: 15 }  // Total
      ];

      // Set the range of cells
      ws['!ref'] = XLSX.utils.encode_range({
        s: { c: 0, r: 0 },
        e: { c: headers.length - 1, r: rowIndex - 1 }
      });

      XLSX.utils.book_append_sheet(workbook, ws, sanitizeSheetName(supplier));
    });

    // Create summary sheet with all best prices
    // Sort bestPricesList alphabetically before creating summary
    const sortedBestPricesList = [...bestPricesList].sort((a, b) => 
      a.productName.toLowerCase().localeCompare(b.productName.toLowerCase(), 'pt-BR')
    );

    const summaryData = sortedBestPricesList.map(item => ({
      'Nome do Produto': item.productName,
      'Preço Unitário': item.price.toString().replace('.', ','), // Convert decimal point to comma
      'Fornecedor': item.supplier,
      'JR': item.stockJR || 0,
      'GS': item.stockGS || 0,
      'BARÃO': item.stockBARAO || 0,
      'LB': item.stockLB || 0,
      'Quantidade': 1,
      'Total': { formula: 'PRODUCT(B{row},H{row})' }
    }));

    // Add total row to summary
    summaryData.push({
      'Nome do Produto': 'TOTAL GERAL',
      'Preço Unitário': '',
      'Fornecedor': '',
      'JR': Number(''),
      'GS': Number(''),
      'BARÃO': Number(''),
      'LB': Number(''),
      'Quantidade': 1,
      'Total': { formula: `SUM(I2:I${summaryData.length})` }
    });

    // Create summary worksheet
    const summaryWs = XLSX.utils.json_to_sheet([]);

    // Add headers
    const summaryHeaders = Object.keys(summaryData[0]);
    XLSX.utils.sheet_add_aoa(summaryWs, [summaryHeaders], { origin: 'A1' });

    // Process each row with formulas
    let summaryRowIndex = 1; // Start after headers
    summaryData.forEach(row => {
      summaryHeaders.forEach((header, colIdx) => {
        const cellRef = XLSX.utils.encode_cell({r: summaryRowIndex, c: colIdx});
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const value = row[header];

        // Handle formula objects
        if (value && typeof value === 'object' && value.formula) {
          let formula = value.formula;
          // Replace {row} with actual row number
          formula = formula.replace(/{row}/g, (summaryRowIndex + 1).toString());
          summaryWs[cellRef] = { t: 'n', f: formula };
        } else if (header === 'Preço Unitário' && value !== '') {
          // Ensure price is treated as a number
          summaryWs[cellRef] = { t: 'n', v: parseFloat(value.replace(',', '.')) };
        } else {
          // Regular value
          summaryWs[cellRef] = { v: value };
        }
      });
      summaryRowIndex++;
    });

    // Set column widths
    summaryWs['!cols'] = [
      { wch: 40 }, // Nome do Produto
      { wch: 15 }, // Preço Unitário
      { wch: 20 }, // Fornecedor
      { wch: 10 }, // JR
      { wch: 10 }, // GS
      { wch: 10 }, // BARÃO
      { wch: 10 }, // LB
      { wch: 15 }, // Quantidade
      { wch: 15 }  // Total
    ];

    // Set the range of cells
    summaryWs['!ref'] = XLSX.utils.encode_range({
      s: { c: 0, r: 0 },
      e: { c: summaryHeaders.length - 1, r: summaryRowIndex - 1 }
    });

    XLSX.utils.book_append_sheet(workbook, summaryWs, 'Resumo Melhores Preços');

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `Lista_Melhores_Preços_${new Date().toISOString().split('T')[0]}.xlsx`);

    // Final validation log
    console.log('📊 Exportação do Excel concluída com as seguintes organizações:');
    console.log(`📋 Fornecedores ordenados alfabeticamente: ${sortedSuppliers.length} fornecedores`);
    console.log(`📦 Produtos ordenados alfabeticamente em cada aba`);
    console.log(`📈 Aba resumo com ${sortedBestPricesList.length} produtos em ordem alfabética`);
    console.log('✅ Todas as listas foram exportadas em ordem alfabética crescente');

    toast({
      title: 'Lista gerada com sucesso',
      description: 'A lista com os melhores preços foi gerada e está sendo baixada (produtos organizados em ordem alfabética)'
    });
  };

  // Utility function to validate if a list is sorted alphabetically
  const validateAlphabeticalOrder = (list: any[], propertyName: string): boolean => {
    if (list.length <= 1) return true;
    
    for (let i = 1; i < list.length; i++) {
      const current = list[i][propertyName]?.toLowerCase() || '';
      const previous = list[i - 1][propertyName]?.toLowerCase() || '';
      
      if (current.localeCompare(previous, 'pt-BR') < 0) {
        console.warn(`Lista não está em ordem alfabética: "${previous}" vem antes de "${current}"`);
        return false;
      }
    }
    return true;
  };

  // Function to validate all lists before Excel export
  const validateListsOrder = (): boolean => {
    console.log('🔍 Validando ordem alfabética das listas...');
    
    const validations = [
      {
        name: 'Preços dos Fornecedores',
        list: supplierPrices,
        property: 'productName',
        isValid: validateAlphabeticalOrder(supplierPrices, 'productName')
      },
      {
        name: 'Comparações',
        list: comparisons,
        property: 'productName',
        isValid: validateAlphabeticalOrder(comparisons, 'productName')
      },
      {
        name: 'Melhores Preços',
        list: bestPricesList,
        property: 'productName',
        isValid: validateAlphabeticalOrder(bestPricesList, 'productName')
      }
    ];

    let allValid = true;
    validations.forEach(validation => {
      if (validation.isValid) {
        console.log(`✅ ${validation.name}: Lista organizada em ordem alfabética (${validation.list.length} itens)`);
      } else {
        console.error(`❌ ${validation.name}: Lista NÃO está em ordem alfabética`);
        allValid = false;
      }
    });

    return allValid;
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
