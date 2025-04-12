import React, {useEffect, useState} from "react"
import Cards from "../components/Cards.tsx";
import ShoppingListTable from "./supplier/ShoppingListTable.tsx";
import {Pill, ShoppingBag, Truck} from "lucide-react";
import {IShoppingList} from "../types/types.ts";
import {useStore} from "../hooks/store.tsx";
import {listShoppingLists} from "../service/shoppingListService.ts";
import {getTotalAmount} from "../service/generalService.ts";

interface Totals {
    totalSupplier: number
    totalProducts: number
    totalShoopingList: number
}

const Home: React.FC = () => {
    const [shoppingList, setShoppingList] = useState<IShoppingList[]>([])
    const { store } = useStore()
    const [totals,setTotals] = useState<Totals>()

    useEffect(() => {
        const fetchShoppingList = async () => {
            if(store) {
                const result = await listShoppingLists(store)
                if(result?.data) {
                    setShoppingList(result.data)
                }
            }
        }
        fetchShoppingList().then()

    }, []);
    useEffect(() => {
        const fetchTotal = async () => {
            if(store) {
                const result = await getTotalAmount(store)
                if(result?.data) {
                    setTotals(result.data)
                }
            }
        }
        fetchTotal().then()

    }, [store]);
    return (

        <div className="flex flex-col">
            <div className="flex flex-col justify-center md:flex-row gap-3 mb-6">
                <Cards name="Total Fornecedores" content={totals?.totalSupplier} icon={<Truck className="h-5 w-36" />} />
                <Cards name="Total de Listas" content={totals?.totalShoopingList} icon={<ShoppingBag className="w-36 h-5" />} />
                <Cards name="Total de Remedios" content={totals?.totalProducts} icon={<Pill className="w-36 h-5" />} />
            </div>
            <div>
                <hr />
                <div className="flex flex-col mt-10">
                    <div className="mt-2 flex justify-center">
                        <h1 className="text-green-950 capitalize font-bold text-2xl"> Ultimas Listas de Compras</h1>
                    </div>
                    <div className="mt-2 p-2 ">
                        <ShoppingListTable items={shoppingList}/>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Home;

