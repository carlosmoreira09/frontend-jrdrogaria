import { useState } from "react"
import {ChevronRight, ShoppingCart, Pill, Truck, Settings, HomeIcon, LogOut} from "lucide-react"
import type React from "react"
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";
import {useStore} from "../hooks/store.tsx";

type MenuItem = {
    id: string
    title: string
    icon: React.ReactNode
    subItems: SubItem[]
}
type SubItem = {
    title: string,
    linkTo: string
}

const menuItems: MenuItem[] = [
    {
        id: "fornecedores",
        title: "Fornecedores",
        icon: <Truck className="w-5 h-5" />,
        subItems: [
            {
                title: "Listar Fornecedores",
                linkTo: '/supplier/home'
            },
            {
                title: "Adicionar Fornecedores",
                linkTo: '/supplier/add-supplier'
            }
        ],
    },
    {
        id: "remedios",
        title: "Produtos",
        icon: <Pill className="w-5 h-5" />,
        subItems: [
            {
                title: "Gerenciar Produtos",
                linkTo: '/product/home'
            },
        ],
    },
    {
        id: "compras",
        title: "Lista de Compras",
        icon: <ShoppingCart className="w-5 h-5" />,
        subItems: [
            {
                title: "Criar Lista Compras",
                linkTo: '/shopping/home'
            },
            {
                title: "Listas de Compras Criadas",
                linkTo: '/shopping/add-shopping'
            }
        ],
    },
    {
        id: "gerenciar",
        title: "Gerenciar",
        icon: <Settings className="w-5 h-5" />,
        subItems: [
            {
                title: "Criar usuário",
                linkTo: '/add-user'
            },
            {
                title: "Gerenciar Usuários",
                linkTo: '/manage-users'
            },
            {
                title: "Gerenciar Lojas",
                linkTo: '/lojas'
            }
        ],
    },
]

const SidebarMenu: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null)
    const navigate = useNavigate();
    const store = useStore()

    const handleLogout = () => {
        store.logOut()
        navigate("/")
    }

    return (
        <div className="flex h-screen bg-green-800">
            <nav className="w-64 mt-10 bg-green-800 text-white shadow-lg">
                <ul>
                    <li>
                        <Link to='/home'
                              onClick={() => setActiveMenu(null)}
                              className={`flex items-center w-full px-4 py-3 text-left hover:bg-gray-100 focus:outline-none`}
                        >
                            <HomeIcon/>
                            <span className="ml-3">Home</span>
                        </Link>
                    </li>
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                                className={`flex items-center w-full px-4 py-3 text-left hover:text-green-800 hover:bg-gray-100 focus:outline-none ${
                                    activeMenu === item.id ? "bg-gray-200" : ""
                                }`}
                            >
                                {item.icon}
                                <span className="ml-3">{item.title}</span>
                                <ChevronRight
                                    className={`w-5 h-5 ml-auto transition-transform ${activeMenu === item.id ? "rotate-90" : ""}`}
                                />
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between">
                    <button className="flex items-center text-white hover:text-gray-300" onClick={handleLogout}>
                        <LogOut className="mr-2" size={24}/>
                        <span>Sair</span>
                    </button>
                </div>
            </nav>

            {/* Submenu */}
            {activeMenu && (
                <div className="w-64 bg-green-800 text-white shadow-lg">
                    <h2 className="px-4 py-3 font-semibold bg-gray-200">
                        {menuItems.find((item) => item.id === activeMenu)?.title}
                    </h2>
                    <ul>
                        {menuItems
                            .find((item) => item.id === activeMenu)
                            ?.subItems.map((subItem, index) => (
                                <li key={index}
                                    onClick={() => setActiveMenu(null)}>
                                    <Link to={subItem.linkTo}
                                          className="block px-4 py-2 hover:text-green-800 hover:bg-gray-100">
                                        {subItem.title}
                                    </Link>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default SidebarMenu;

