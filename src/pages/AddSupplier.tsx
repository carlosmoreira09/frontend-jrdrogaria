import React, { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card"
import {useStore} from "../hooks/store.tsx";
import {toast} from "../hooks/use-toast.ts";
import {useNavigate} from "react-router";
import {Supplier} from "../types/types.ts";

const AddSupplier: React.FC = () => {

    const [isPending, setIsPending] = useState(false)
    const [newSupplier, setNewSupplier] = useState<Supplier>({} as Supplier)
    const { store } = useStore();
    const navigate = useNavigate()
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewSupplier(prev => ({ ...prev, [name]: value }))
    }
    const handleSubmit = async (e: React.FormEvent) => {
       e.preventDefault()
        console.log(newSupplier)
        setIsPending(true)

        try {
            if(store) {


            }

        } catch (error) {
            console.error("Failed to add supplier:", error)
            setIsPending(false)
            return            toast({
                title: "JR DROGARIA - Shopping List",
                description: "Erro ao Adicionar Fornecedor",
            })
        }

    }

    return (
        <div className="relative top-20">
        <Card className="w-3/4 h-3/4 mx-auto">
            <CardHeader>
                <CardTitle>Adicionar Fornecedor</CardTitle>
                <CardDescription>Preencha os detalhes do fornecedor abaixo.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="supplier_name">Nome do Fornecedor</Label>
                            <Input id="supplier_name" name="supplier_name" value={newSupplier.supplier_name} onChange={handleInputChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cnpj">CNPJ</Label>
                            <Input id="cnpj" name="cnpj" value={newSupplier.cnpj} onChange={handleInputChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="whatsapp">WhatsApp</Label>
                            <Input id="whatsapp" name="whatsapp" value={newSupplier.whatsapp} onChange={handleInputChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="payment_mode">Modo de Pagamento</Label>
                            <Input id="payment_mode" name="payment_mode" value={newSupplier.payment_mode} onChange={handleInputChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="payment_term">Prazo de Pagamento</Label>
                            <Input id="payment_term" name="payment_term" value={newSupplier.payment_term} onChange={handleInputChange} required />
                        </div>
                    </div>
                    <CardFooter className="flex justify-between mt-4 p-0">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Adicionando..." : "Adicionar Fornecedor"}
                        </Button>
                    </CardFooter>
                </form>
            </CardContent>

        </Card>
        </div>
    )
}

export default AddSupplier;