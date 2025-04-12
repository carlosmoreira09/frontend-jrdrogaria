import React from "react";
import {Product, Supplier} from "../../types/types.ts";

export interface ShoppingList {
    id: number
    products: Product[]
    supplier: Supplier
    product_price: number
}

const AddSupplierPrice:React.FC = () => {

    return (
        <div>
            <h1>
                Em Construção...
            </h1>
        </div>

        // <div className="mt-5">
        //     <Card>
        //         <CardHeader>
        //             <CardTitle>Adicione os Preços</CardTitle>
        //         </CardHeader>
        //         <CardContent>
        //             {newList.products.map((product) => (
        //                 <div key={product.id} className="mb-4">
        //                     <Label htmlFor={`price-${product.id}`}>{product.product_name}</Label>
        //                     <Input
        //                         id={`price-${product.id}`}
        //                         type="number"
        //                         placeholder="Preço"
        //                         onChange={(e) => handlePriceChange(product.id, e.target.value)}
        //                     />
        //                 </div>
        //             ))}
        //             <Button onClick={saveList} className="mt-4">
        //                 Salvar Lista
        //             </Button>
        //         </CardContent>
        //     </Card>
        // </div>
    )
}

export default AddSupplierPrice;