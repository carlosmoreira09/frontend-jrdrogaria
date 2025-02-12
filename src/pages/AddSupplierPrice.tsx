import React, {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "../components/ui/card.tsx";
import {Label} from "../components/ui/label.tsx";
import {Input} from "../components/ui/input.tsx";
import {Button} from "../components/ui/button.tsx";
import {Product, Supplier} from "../types/types.ts";

export interface ShoppingList {
    id: number
    products: Product[]
    supplier: Supplier
    product_price: number
}

const AddSupplierPrice:React.FC = () => {
    const [newList, setList ] = useState<ShoppingList>({} as ShoppingList)

    return (
        <div className="mt-5">
            <Card>
                <CardHeader>
                    <CardTitle>Adicione os Preços</CardTitle>
                </CardHeader>
                <CardContent>
                    {newList.products.map((product) => (
                        <div key={product.id} className="mb-4">
                            <Label htmlFor={`price-${product.id}`}>{product.product_name}</Label>
                            <Input
                                id={`price-${product.id}`}
                                type="number"
                                placeholder="Preço"
                                onChange={(e) => handlePriceChange(product.id, e.target.value)}
                            />
                        </div>
                    ))}
                    <Button onClick={saveList} className="mt-4">
                        Salvar Lista
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddSupplierPrice;