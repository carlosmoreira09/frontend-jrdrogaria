import * as XLSX from "xlsx"
import { IProductAndStock } from "../types/types"

export type ExportType = 'supplier' | 'best-prices';

interface ExportOptions {
    type: ExportType;
    supplierName?: string;
    tenantName?: string;
}

/**
 * Função para exportar dados para Excel com diferentes formatos
 * - supplier: Para enviar aos fornecedores (com Preço Unitário, sem estoque)
 * - best-prices: Para análise interna (com estoque, sem Preço Unitário)
 */
export async function exportLeadsToCSV(
    data: IProductAndStock[], 
    options: ExportOptions
) {
    try {
        const workbook = XLSX.utils.book_new()
        
        let exportData: any[] = [];
        let headers: string[] = [];
        
        // Sort data alphabetically by product name for both export types
        const sortedData = [...data].sort((a, b) => 
            (a.product || '').localeCompare(b.product || '', 'pt-BR')
        );
        
        if (options.type === 'supplier') {
            // Export format for suppliers - include Preço Unitário column, exclude stock
            headers = ['Produto', 'Fornecedor', 'Loja', 'Preço Unitário'];
            
            exportData = sortedData.map((product) => ({
                'Produto': product.product || '',
                'Fornecedor': options.supplierName || '',
                'Loja': options.tenantName ? `${options.tenantName} Drogaria` : 'Drogaria',
                'Preço Unitário': '' // Empty for supplier to fill
            }));
        } else if (options.type === 'best-prices') {
            // Export format for best prices analysis - include stock, exclude Preço Unitário
            headers = ['Produto', 'JR', 'GS', 'BARÃO', 'LB', 'Total'];
            
            exportData = sortedData.map((product) => ({
                'Produto': product.product || '',
                'JR': product.stockJR || 0,
                'GS': product.stockGS || 0,
                'BARÃO': product.stockBARAO || 0,
                'LB': product.stockLB || 0,
                'Total': (product.stockJR || 0) + (product.stockGS || 0) + (product.stockBARAO || 0) + (product.stockLB || 0)
            }));
        }

        // Create worksheet with headers
        const worksheet = XLSX.utils.aoa_to_sheet([]);
        
        // Add header information in the format expected by PriceComparison
        if (options.type === 'supplier') {
            // Format compatible with PriceComparison component
            XLSX.utils.sheet_add_aoa(worksheet, [
                [`Lista de Compras - ${options.tenantName || 'Drogaria'}`], // Row 1: Title
                [`Fornecedor: ${options.supplierName || "A definir"}`],      // Row 2: Supplier info
                [`Data: ${new Date().toLocaleDateString('pt-BR')}`],         // Row 3: Date
                [''],                                                        // Row 4: Empty row
                headers                                                      // Row 5: Column headers
            ], { origin: "A1" });
            
            // Add the actual data starting from row 6
            exportData.forEach((row, index) => {
                const rowData = headers.map(header => row[header]);
                XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: `A${6 + index}` });
            });
        } else {
            // Best prices format
            XLSX.utils.sheet_add_aoa(worksheet, [
                [`Análise de Melhores Preços - ${options.tenantName || 'Drogaria'}`],
                [`Data: ${new Date().toLocaleDateString('pt-BR')}`],
                [''],
                headers
            ], { origin: "A1" });
            
            // Add the actual data starting from row 5
            exportData.forEach((row, index) => {
                const rowData = headers.map(header => row[header]);
                XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: `A${5 + index}` });
            });
        }
        
        // Set column widths based on export type
        if (options.type === 'supplier') {
            worksheet['!cols'] = [
                { wch: 50 }, // Produto
                { wch: 25 }, // Fornecedor
                { wch: 20 }, // Loja
                { wch: 20 }, // Preço Unitário
            ];
        } else {
            worksheet['!cols'] = [
                { wch: 50 }, // Produto
                { wch: 12 }, // JR
                { wch: 12 }, // GS
                { wch: 12 }, // BARÃO
                { wch: 12 }, // LB
                { wch: 12 }, // Total
            ];
        }
        
        // Set the range of cells in the worksheet
        const totalRows = options.type === 'supplier' ? 5 + exportData.length : 4 + exportData.length;
        worksheet['!ref'] = XLSX.utils.encode_range({
            s: { c: 0, r: 0 },
            e: { c: headers.length - 1, r: totalRows }
        });
        
        XLSX.utils.book_append_sheet(workbook, worksheet, "Lista de Compras")

        const date = new Date()
        const formattedDate = date.toISOString().split("T")[0] // YYYY-MM-DD
        
        let filename: string;
        if (options.type === 'supplier') {
            const supplierText = options.supplierName ? `_${options.supplierName.replace(/\s+/g, '_')}` : ''
            filename = `LISTA_COMPRAS_FORNECEDOR${supplierText}_${formattedDate}.xlsx`
        } else {
            filename = `ANALISE_MELHORES_PRECOS_${formattedDate}.xlsx`
        }

        // Save the file
        XLSX.writeFile(workbook, filename)

        return filename
    } catch (error) {
        console.error("Erro ao exportar Excel:", error)
        throw new Error("Falha ao exportar dados para Excel")
    }
}

// Legacy function for backward compatibility - defaults to supplier export
export async function exportToSupplier(data: IProductAndStock[], supplierName: string, tenantName?: string) {
    return exportLeadsToCSV(data, {
        type: 'supplier',
        supplierName,
        tenantName
    });
}

// Function for best prices export
export async function exportBestPrices(data: IProductAndStock[], tenantName?: string) {
    return exportLeadsToCSV(data, {
        type: 'best-prices',
        tenantName
    });
}
