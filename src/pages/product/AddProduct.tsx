import React from "react"
import { Input } from "../../components/ui/input.tsx"
import { Label } from "../../components/ui/label.tsx"
import { Button } from "../../components/ui/button.tsx"

type AddProductProps = {
    submitProduct: (e: React.FormEvent<HTMLFormElement>) => void
    setProduct: (product: string) => void
    product: string
}

const AddProduct: React.FC<AddProductProps> = ({submitProduct, setProduct,product}) => {

    return (
        <form onSubmit={submitProduct} className="flex flex-row space-x-2 justify-items-start">
            <div>
                <Label htmlFor="product">Produto</Label>
                <Input className="w-80" id="product" value={product} onChange={(e) => setProduct(e.target.value)} required />
            </div>

            <div className="flex mt-6 space-x-2">
                <Button className="bg-green-900 text-white hover:bg-green-500" type="submit">Adicionar Produto</Button>
            </div>
        </form>
    )
}
export default AddProduct;