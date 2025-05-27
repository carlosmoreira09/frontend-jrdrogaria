import * as XLSX from "xlsx"

/**
 * Função de servidor para exportar dados para CSV
 * Útil para conjuntos de dados grandes que podem ser melhor processados no servidor
 */
export async function exportLeadsToCSV(data: any[], supplierName: string = '') {
    try {
        const workbook = XLSX.utils.book_new()
        
        // Convert your data to array of arrays if needed
        const headers = Object.keys(data[0] || {});

        // Create worksheet with empty cells
        const ws_data = [headers];
        const worksheet = XLSX.utils.aoa_to_sheet(ws_data);
        
        // Add header information
        XLSX.utils.sheet_add_aoa(worksheet, [
            [`Nome: Lista de Compras`],
            [`Fornecedor: ${supplierName || "Não especificado"}`],
            ["Data: " + new Date().toLocaleDateString('pt-BR')]
        ], { origin: "A1" });
        
        // Process and add each row of data
        let rowIndex = 4; // Start after headers
        
        data.forEach((row) => {
            // For each column in the row
            headers.forEach((header, colIdx) => {
                const cellRef = XLSX.utils.encode_cell({r: rowIndex, c: colIdx});
                const value = row[header];
                
                // Check if the value is a formula object
                if (value && typeof value === 'object' && value.f) {
                    let formula = value.f;
                    
                    // Replace {row} placeholder with actual row number
                    formula = formula.replace(/\{row}/g, (rowIndex + 1).toString());
                    
                    worksheet[cellRef] = { t: 'n', f: formula };
                } else {
                    // Regular value
                    worksheet[cellRef] = { v: value };
                }
            });
            
            rowIndex++;
        });
        
        // Set column widths
        worksheet['!cols'] = [
            { wch: 40 }, // Nome
            { wch: 20 }, // Fornecedor
            { wch: 20 }, // Loja
            { wch: 10 }, // JR
            { wch: 10 }, // GS
            { wch: 10 }, // BARÃO
            { wch: 10 }, // LB
            { wch: 15 }, // Preço Unitário
            { wch: 15 }, // Quantidade
            { wch: 15 }, // Total
        ];
        
        // Style the total row
        const lastRowIdx = rowIndex - 1;
        const totalCellRef = XLSX.utils.encode_cell({r: lastRowIdx, c: 0});
        worksheet[totalCellRef] = { 
            v: "TOTAL GERAL", 
            s: { font: { bold: true, color: { rgb: "000000" } } } 
        };
        
        // Style the total formula cell
        const totalFormulaCellRef = XLSX.utils.encode_cell({r: lastRowIdx, c: headers.length - 1});
        if (worksheet[totalFormulaCellRef]) {
            worksheet[totalFormulaCellRef].s = { 
                font: { bold: true, color: { rgb: "000000" } },
                fill: { fgColor: { rgb: "FFFF00" } } // Yellow background
            };
        }
        
        // Set the range of cells in the worksheet
        worksheet['!ref'] = XLSX.utils.encode_range({
            s: { c: 0, r: 0 },
            e: { c: headers.length - 1, r: rowIndex - 1 }
        });
        
        XLSX.utils.book_append_sheet(workbook, worksheet, "Products")

        const date = new Date()
        const formattedDate = date.toISOString().split("T")[0] // YYYY-MM-DD
        const supplierText = supplierName ? `_${supplierName.replace(/\s+/g, '_')}` : ''
        const filename = `LISTA_DE_COMPRAS_${supplierText}_${formattedDate}.xlsx`

        // Salvar o arquivo
        XLSX.writeFile(workbook, filename)

        // Retornar o caminho relativo para download
        return `/exports/${filename}`
    } catch (error) {
        console.error("Erro ao exportar XLSX no servidor:", error)
        throw new Error("Falha ao exportar dados para XLSX")
    }
}
