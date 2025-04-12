import React, {useEffect, useState} from "react";
import ProductStats from "../product/ProductStats.tsx";
import {useStore} from "../../hooks/store.tsx";
import SupplierTable from "./SupplierTable.tsx";
import {useToast} from "../../hooks/use-toast.ts";
import {Button} from "../../components/ui/button.tsx";
import {useNavigate} from "react-router";
import {Supplier} from "../../types/types.ts";
import {deleteSupplier, listSuppliers} from "../../service/supplierService.ts";

const ShoppingList: React.FC = () => {

    const { store } = useStore()
    const { toast } = useToast()
    const navigate = useNavigate()
    const [suppliers,setSuppliers] = useState<Supplier[]>([])
    const totalProducts = suppliers.length
    const fetchSuppliers = async () => {
        if (store) {
           const result = await listSuppliers()
            if(result?.data) {
                setSuppliers(result.data)
            }
        }
    }
    useEffect(() => {
        fetchSuppliers().then()
    }, [store]);

    const handleDelete = async (id: number | undefined) => {
        if(store) {
            await deleteSupplier(id,store).then(
                (result) => {
                    if(result?.message.includes('deletado')) {
                        toast({
                            variant: 'destructive',
                            title: 'JR Drogaria',
                            description: 'Produto removido'
                        })
                    }
                }).finally(() => fetchSuppliers())
        }
    }
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Gerenciamento de Fornecedores</h1>
            <ProductStats title="Total de Fornecedores" totalProducts={totalProducts}/>
            <div className="flex flex-col p-4 mt-5 gap-4">
                <Button className="bg-green-900 text-white hover:bg-green-500" onClick={() => navigate('/supplier/add-supplier')}>Adicionar Fornecedor </Button>
                <div>
                    <SupplierTable deleteProduct={handleDelete} supplier={suppliers}/>
                </div>

            </div>
        </div>
    )
}

export default ShoppingList;