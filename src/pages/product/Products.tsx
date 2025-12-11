import ProductTable from "./ProductTable.tsx";
import ProductStats from "./ProductStats.tsx";
import React, {useEffect, useRef, useState} from "react";
import AddProduct from "./AddProduct.tsx";
import { useToast } from "../../hooks/use-toast.ts"
import { Product } from "../../types/types.ts";
import {createProduct, deleteProduct, listProducts} from "../../service/productService.ts";
import ProductExcelUpload from "../../components/ProductExcelUpload.tsx";


const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [product, setProduct] = useState<string>("")
    const totalProducts = products.length
    const { toast } = useToast()
    const hasFetchedRef = useRef(false)

    const fetchProducts = async () => {
        const result = await listProducts()
        if(result?.data) {
            setProducts(result.data)
        } else {
            toast({
                variant: 'destructive',
                title: 'JR Drogaria',
                description: 'Erro ao listar produtos'
            })
        }
    }
    
    useEffect(() => {
        // Prevent double fetch in development (React StrictMode)
        if (hasFetchedRef.current) return;
        
        const controller = new AbortController();
        
        const loadProducts = async () => {
            try {
                hasFetchedRef.current = true;
                await fetchProducts();
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Error fetching products:', error);
                }
            }
        };
        
        loadProducts();
        
        return () => {
            controller.abort();
        };
    }, []); // Remove store dependency to prevent re-fetching

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
            try {
                await createProduct({ product_name: product})
                    .then(
                        (result) => {
                            if(result?.data) {
                                fetchProducts()
                                toast({
                                    variant: 'default',
                                    title: 'JR Drogaria',
                                    description: 'Produto adicionado'
                                })
                                setProduct('')
                            } else {
                                toast({
                                    variant: 'destructive',
                                    title: 'JR Drogaria',
                                    description: 'Erro ao cadastrar produto'
                                })
                            }
                        })

            } catch (error) {
                console.log(error)
            }
    }
    const handleDelete = async (id: number | undefined) => {
            await deleteProduct(id).then(
                (result) => {
                    if(result?.message.includes('deletado')) {
                        toast({
                            variant: 'destructive',
                            title: 'JR Drogaria',
                            description: 'Produto removido'
                        })
                    }
                }
            ).finally(
                () => {
                    fetchProducts()
                }
            )
        }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Lista de Produtos</h1>
            <ProductStats title="Total de Produtos" totalProducts={totalProducts}/>
            <div className="flex flex-col p-4 mt-5 gap-4">
                <div className="flex justify-between items-center">
                    <AddProduct submitProduct={handleSubmit} setProduct={setProduct} product={product} />
                    <ProductExcelUpload onUploadComplete={fetchProducts} />
                </div>
                <div>
                    <ProductTable deleteProduct={handleDelete} products={products} />
                </div>
            </div>
        </div>
    )
}

export default ProductsPage;