import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table.tsx"
import React from "react";
import {IShoppingList} from "../types/types.ts";


type ShoppingListTableProps = {
    items: IShoppingList[]
}

const ShoppingListTable:React.FC<ShoppingListTableProps> = ({ items }: ShoppingListTableProps) => {

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Preço Unitário</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.products.toString()}</TableCell>
                            <TableCell>{item.product_price}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={3} className="font-bold">
                            Total Geral
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}

export default ShoppingListTable