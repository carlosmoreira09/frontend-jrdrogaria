import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table.tsx"
import React, { useState } from "react";
import {IShoppingList} from "../../types/types.ts";
import {format} from "date-fns";
import {ptBR} from "date-fns/locale";
import {useNavigate} from "react-router";
import {BadgeX} from "lucide-react";
import { deleteShoppingList } from "../../service/shoppingListService";
import { useStore } from "../../hooks/store";
import { toast } from "../../hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";


type ShoppingListTableProps = {
    items: IShoppingList[],
    onDelete?: () => void
}

const ShoppingListTable:React.FC<ShoppingListTableProps> = ({ items, onDelete }: ShoppingListTableProps) => {
    const navigate = useNavigate()
    const { store } = useStore()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [listToDelete, setListToDelete] = useState<IShoppingList | null>(null);

    const handleRowClick = (list: IShoppingList) => {
        navigate(`/shopping/home/`, { state: list})
    }

    const openDeleteDialog = (e: React.MouseEvent, list: IShoppingList) => {
        e.stopPropagation() // Prevent row click event
        setListToDelete(list);
        setDeleteDialogOpen(true);
    }

    const handleDelete = async () => {        
        try {
            if (store && listToDelete) {
                await deleteShoppingList(listToDelete, store)
                toast({
                    variant: 'default',
                    title: 'JR Drogaria',
                    description: 'Lista deletada com sucesso'
                })
                // Refresh the list after deletion
                if (onDelete) {
                    onDelete()
                }
            }
        } catch (error) {
            console.error("Failed to delete shopping list:", error)
            toast({
                variant: 'destructive',
                title: 'JR Drogaria',
                description: 'Erro ao deletar lista'
            })
        } finally {
            setDeleteDialogOpen(false);
            setListToDelete(null);
        }
    }

    return (
        <>
            <div className="w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data da Lista</TableHead>
                            <TableHead>Quantidade de Produtos</TableHead>
                            <TableHead>Deletar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow onClick={() => handleRowClick(item)} className="cursor-pointer hover:bg-muted"  key={item.id}>
                                <TableCell>{format(item.list_name.split('_')[3], "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                                <TableCell>{item.products.length}</TableCell>
                                <TableCell>
                                    <BadgeX 
                                        className='w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer' 
                                        onClick={(e) => openDeleteDialog(e, item)}
                                    />
                                </TableCell>
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

            {/* Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir esta lista de compras? Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            Excluir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ShoppingListTable