import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table.tsx"
import {Button} from "../../components/ui/button.tsx";
import {Trash2} from "lucide-react";
import { Product } from "../../types/types.ts";

type ProductTableProps = {
    products: Product[]
    deleteProduct: (id: number | undefined) => void
}
const ProductTable: React.FC<ProductTableProps> = ({products,deleteProduct}) => {

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Ação</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.product_name}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                            <Button onClick={() => deleteProduct(product.id)} className="w-36">
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

export default ProductTable;