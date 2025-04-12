import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table.tsx"
import {Button} from "../../components/ui/button.tsx";
import {Trash2} from "lucide-react";
import {Supplier} from "../../types/types.ts";

type ProductTableProps = {
    supplier: Supplier[]
    deleteProduct: (id: number | undefined) => void
}
const SupplierTable: React.FC<ProductTableProps> = ({supplier,deleteProduct}) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Whatsapp</TableHead>
                    <TableHead>Prazo para pagamento</TableHead>
                    <TableHead>Ação</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {supplier.map((supplier) => (
                    <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.supplier_name}</TableCell>
                        <TableCell className="font-medium">{supplier.whatsAppNumber}</TableCell>
                        <TableCell className="font-medium">{supplier.payment_term}</TableCell>
                        <TableCell>
                            <Button onClick={() => deleteProduct(supplier.id)} className="w-36">
                                <Trash2 className="mr-1 h-4 w-4" />
                                <span className="text-sm">Remover</span>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default SupplierTable;