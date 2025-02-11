import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

type ProductStatsProps = {
    title: string
    totalProducts: number
    lowStockProducts?: number

}

const ProductStats: React.FC<ProductStatsProps> = ({title, totalProducts, lowStockProducts}) => {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalProducts}</div>
                </CardContent>
            </Card>
            {
                lowStockProducts ? (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Produtos com Estoque Baixo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{lowStockProducts}</div>
                        </CardContent>
                    </Card>
                ) : <></>
            }

        </div>
    )
}

export default ProductStats;