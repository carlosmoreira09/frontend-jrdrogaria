import React, {useEffect, useState} from "react";
import ProductStats from "./ProductStats.tsx";
import {useStore} from "../hooks/store.tsx";
import SupplierTable from "./SupplierTable.tsx";
import {useToast} from "../hooks/use-toast.ts";
import {Button} from "../components/ui/button.tsx";
import {useNavigate} from "react-router";
import {Supplier} from "../types/types.ts";

const ShoppingList: React.FC = () => {

    const { store } = useStore()
    const { toast } = useToast()
    const navigate = useNavigate()
    const [suppliers,setSuppliers] = useState<Supplier[]>([])
    const totalProducts = suppliers.length
    const fetchSuppliers = async () => {
        if (store) {
            
        }
    }
    useEffect(() => {
        fetchSuppliers().then()
    }, [store]);

    const handleDelete = async (id: number | undefined) => {
        if(store) {

        }
    }
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Gerenciamento de Produtos</h1>
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