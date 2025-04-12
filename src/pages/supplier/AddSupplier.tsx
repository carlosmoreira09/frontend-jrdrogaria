import React, { useState } from "react"
import { Button } from "../../components/ui/button.tsx"
import { Input } from "../../components/ui/input.tsx"
import { Label } from "../../components/ui/label.tsx"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card.tsx"
import {useStore} from "../../hooks/store.tsx";
import {toast} from "../../hooks/use-toast.ts";
import {useNavigate} from "react-router";
import {Supplier} from "../../types/types.ts";
import {createSupplier} from "../../service/supplierService.ts";

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
        setIsPending(true)
        try {
            if(store) {

                await createSupplier(newSupplier,store).then(
                    (result) => {
                        if(result?.data) {
                            toast({
                                variant: 'default',
                                title: 'JR Drogaria',
                                description: 'Produto adicionado'
                            })
                          navigate('/supplier/home')
                        } else {
                            toast({
                                variant: 'destructive',
                                title: 'JR Drogaria',
                                description: 'Erro ao cadastrar produto'
                            })
                        }
                    }).finally(
                    () =>  setIsPending(false)
                )
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
                            <Input id="supplier_name" name="supplier_name" value={newSupplier.supplier_name}
                                   onChange={handleInputChange} required/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="whatsAppNumber">WhatsApp</Label>
                            <Input id="whatsapp" name="whatsAppNumber" value={newSupplier.whatsAppNumber}
                                   onChange={handleInputChange} required/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="payment_term">Prazo de Pagamento</Label>
                            <Input id="payment_term" name="payment_term" value={newSupplier.payment_term}
                                   onChange={handleInputChange} required/>
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