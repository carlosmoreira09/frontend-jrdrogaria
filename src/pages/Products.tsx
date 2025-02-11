import ProductTable from "./ProductTable.tsx";
import ProductStats from "./ProductStats.tsx";
import React, {useEffect, useState} from "react";
import {useStore} from "../hooks/store.tsx";
import AddProduct from "./AddProduct.tsx";
import {
    createProductsTable,
    deleteProduct,
    listProducts,
    Product,
    saveProduct
} from "../database/products/productsQuery.tsx";
import { useToast } from "../hooks/use-toast.ts";


const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [product, setProduct] = useState<string>("")
    const [stock, setStock] = useState<number>(0)
    const totalProducts = products.length
    const lowStockProducts = products.filter((p) => p.stock <= 10).length
    const { store} = useStore()
    const { toast } = useToast()

    const fetchProducts = async () => {
        if (store) {
            await createProductsTable(store)
            const result = await listProducts(store)
            if (result) {
                setProducts(result)
            }
        }
    }
    useEffect(() => {
        fetchProducts().then()
    }, [store]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (store) {
            try {

                await saveProduct(store, {product: product, stock: stock}).then(
                    (result) => {
                        console.log(result)
                        if (result.rowsAffected !== 0) {
                            toast({
                                title: "JR DROGARIA - Shopping List",
                                description: "Produto Adicionado com Sucesso",
                            })
                        }
                    }
                ).catch(
                    () => {
                        toast({
                            variant: 'destructive',
                            title: "JR DROGARIA - Shopping List",
                            description: "Erro ao Adicionar Produto",
                        })
                    }
                ).finally(() => {
                    fetchProducts()
                    setProduct('')
                    setStock(0)
                })
            } catch (error) {
                console.log(error)
            }
        }
    }
    const handleDelete = async (id: number | undefined) => {
        if(store) {
            await deleteProduct(store, id).then(() => {
                toast({
                    variant: 'destructive',
                    title: "JR DROGARIA - Shopping List",
                    description: "Erro ao Adicionar Produto",
                })
            }). finally(() => {
                fetchProducts()
            }
            )

        }
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Gerenciamento de Produtos</h1>
            <ProductStats title="Total de Produtos" totalProducts={totalProducts} lowStockProducts={lowStockProducts} />
            <div className="flex flex-col p-4 mt-5 gap-4">
                <div>
                    <AddProduct submitProduct={handleSubmit} setProduct={setProduct} setStock={setStock} product={product} stock={stock} />
                </div>
                <div>
                    <ProductTable deleteProduct={handleDelete} products={products} />
                </div>

            </div>
        </div>
    )
}

export  default ProductsPage;