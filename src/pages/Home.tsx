import type React from "react"
import Cards from "../components/Cards.tsx";
import ShoppingListTable, {ShoppingItem} from "./ShoppingListTable.tsx";
import {Pill, ShoppingBag, Truck} from "lucide-react"; // Added import for React

const mockList: ShoppingItem[] = [
    {
        id: 1,
        name: 'Dipirona',
        quantity: 3,
        price: 20.00
    },
    {
        id: 1,
        name: 'Dipirona',
        quantity: 3,
        price: 20.00
    },
    {
        id: 1,
        name: 'Dipirona',
        quantity: 3,
        price: 20.00
    }
]

const Home: React.FC = () => {

    return (

        <div className="flex flex-col">
            <div className="flex flex-col justify-center md:flex-row gap-3 mb-6">
                <Cards name="Total Fornecedores" content={10} icon={<Truck className="h-5 w-36" />} />
                <Cards name="Total de Listas" content={10} icon={<ShoppingBag className="w-36 h-5" />} />
                <Cards name="Total de Remedios" content={10} icon={<Pill className="w-36 h-5" />} />
            </div>
            <div>
                <hr />
                <div className="flex flex-col mt-10">
                    <div className="mt-2 flex justify-center">
                        <h1 className="text-green-950 capitalize font-bold text-2xl"> Ultimas Listas de Compras</h1>
                    </div>
                    <div className="mt-2 p-2 ">
                        <ShoppingListTable items={mockList}/>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Home;

