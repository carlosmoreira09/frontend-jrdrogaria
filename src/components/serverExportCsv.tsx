import * as XLSX from "xlsx"

/**
 * Função de servidor para exportar dados para CSV
 * Útil para conjuntos de dados grandes que podem ser melhor processados no servidor
 */
export async function exportLeadsToCSV(data: any[], supplierName: string = '') {
    try {
            const workbook = XLSX.utils.book_new()
        const headerRows = [
            [`Fornecedor: ${supplierName || "Não especificado"}`],
            ["Data: " + new Date().toLocaleDateString('pt-BR')],
            [""] // Empty row for spacing
        ];
        // Convert your data to array of arrays if needed
        const headers = Object.keys(data[0] || {});

        const dataArray = data.map(item => headers.map(header => item[header]));
        headerRows.push(headers);

        // Combine header and data
        const allRows = [...headerRows, ...dataArray];

        // Create worksheet from the combined array
        const worksheet = XLSX.utils.aoa_to_sheet(allRows);
        // Style the supplier and date rows
        worksheet["A1"].s = {
            font: { bold: true, color: { rgb: "FF0000" } }, // Red, bold text
            fill: { fgColor: { rgb: "FFFF00" } }           // Yellow background
        };
        worksheet["A1"] = { t: "s", v: `Fornecedor: ${supplierName || "Não especificado"}`, s: { font: { bold: true } } };
        worksheet["A2"] = { t: "s", v: "Data: " + new Date().toLocaleDateString('pt-BR'), s: { font: { bold: true } } };
        for (let i = 0; i < headers.length; i++) {
            const cellRef = XLSX.utils.encode_cell({ r: 3, c: i });
            if (worksheet[cellRef]) {
                worksheet[cellRef].s = { font: { bold: true }, fill: { fgColor: { rgb: "E2EFDA" } } };
            }
        }

        // Or set column widths:
        worksheet['!cols'] = [
            { wch: 20 }, // Width of column A in characters
            { wch: 30 }  // Width of column B
        ];
        XLSX.utils.book_append_sheet(workbook, worksheet, "Products")

        const date = new Date()
        const formattedDate = date.toISOString().split("T")[0] // YYYY-MM-DD
        const supplierText = supplierName ? `_${supplierName.replace(/\s+/g, '_')}` : ''
        const filename = `LISTA_DE_COMPRAS_${supplierText}_${formattedDate}.xlsx`

        // Caminho para salvar o arquivo (ajuste conforme necessário)

        // Salvar o arquivo
        XLSX.writeFile(workbook, filename)

        // Retornar o caminho relativo para download
        return `/exports/${filename}`
        // Retornar o caminho relativo para download
    } catch (error) {
        console.error("Erro ao exportar XLSX no servidor:", error)
        throw new Error("Falha ao exportar dados para XLSX")
    }
}
