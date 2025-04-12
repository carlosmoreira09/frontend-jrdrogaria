import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table.tsx"
import React from "react";
import {IShoppingList} from "../../types/types.ts";
import {format} from "date-fns";
import {ptBR} from "date-fns/locale";
import {useNavigate} from "react-router";


type ShoppingListTableProps = {
    items: IShoppingList[]
}

const ShoppingListTable:React.FC<ShoppingListTableProps> = ({ items }: ShoppingListTableProps) => {
    const navigate = useNavigate()

    const handleRowClick = (list: IShoppingList) => {
        navigate(`/shopping/home/`, { state: list})
    }

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Data da Lista</TableHead>
                        <TableHead>Quantidade de Produtos</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow onClick={() => handleRowClick(item)} className="cursor-pointer hover:bg-muted"  key={item.id}>
                            <TableCell>{format(item.list_name.split('_')[3], "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                            <TableCell>{item.products.length}</TableCell>
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