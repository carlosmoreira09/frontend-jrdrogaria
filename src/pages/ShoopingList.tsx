import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table.tsx"
import React from "react";

export type ShoppingItem = {
    id: number
    name: string
    quantity: number
    price: number
}

type ShoppingListTableProps = {
    items: ShoppingItem[]
}

const ShoppingListTable:React.FC<ShoppingListTableProps> = ({ items }: ShoppingListTableProps) => {
    const calculateTotal = (item: ShoppingItem) => {
        return (item.quantity * item.price).toFixed(2)
    }

    const overallTotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Preço Unitário</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>R$ {item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">R$ {calculateTotal(item)}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={3} className="font-bold">
                            Total Geral
                        </TableCell>
                        <TableCell className="text-right font-bold">R$ {overallTotal}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}

export default ShoppingListTable