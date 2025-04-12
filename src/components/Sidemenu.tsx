import { useState } from "react"
import {
  ChevronRight,
  ShoppingCart,
  Pill,
  Truck,
  Settings,
  Home,
  LogOut,
  Users,
  Building,
  PlusCircle,
  List,
  ShoppingBag,
  BarChart2
} from "lucide-react"
import type React from "react"
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";
import {useStore} from "../hooks/store.tsx";
import appLogo from '../assets/app-logo.jpeg';

type MenuItem = {
    id: string
    title: string
    icon: React.ReactNode
    subItems: SubItem[]
}
type SubItem = {
    title: string,
    linkTo: string,
    icon: React.ReactNode
}

const menuItems: MenuItem[] = [
    {
        id: "fornecedores",
        title: "Fornecedores",
        icon: <Truck className="w-5 h-5" />,
        subItems: [
            {
                title: "Listar Fornecedores",
                linkTo: '/supplier/home',
                icon: <List className="w-4 h-4" />
            },
            {
                title: "Adicionar Fornecedor",
                linkTo: '/supplier/add-supplier',
                icon: <PlusCircle className="w-4 h-4" />
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
                linkTo: '/product/home',
                icon: <Settings className="w-4 h-4" />
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
                linkTo: '/shopping/home',
                icon: <PlusCircle className="w-4 h-4" />
            },
            {
                title: "Comparar Preços",
                linkTo: '/shopping/price-comparison',
                icon: <BarChart2 className="w-4 h-4" />
            }
        ],
    },
    // {
    //     id: "gerenciar",
    //     title: "Gerenciar",
    //     icon: <Settings className="w-5 h-5" />,
    //     subItems: [
    //         {
    //             title: "Criar usuário",
    //             linkTo: '/add-user',
    //             icon: <PlusCircle className="w-4 h-4" />
    //         },
    //         {
    //             title: "Gerenciar Usuários",
    //             linkTo: '/manage-users',
    //             icon: <Users className="w-4 h-4" />
    //         },
    //         {
    //             title: "Gerenciar Lojas",
    //             linkTo: '/lojas',
    //             icon: <Building className="w-4 h-4" />
    //         }
    //     ],
    // },
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
        <div className="flex h-screen bg-green-900">
            <nav className="w-64 bg-green-900 text-white shadow-lg flex flex-col">
                {/* Logo section */}
                <div className="p-4 border-b border-green-800 flex items-center justify-center">
                    <Link to="/home" className="flex items-center transform hover:scale-105 transition-transform duration-200">
                        <img src={appLogo} alt="JR Drogaria Logo" className="rounded-full h-10 w-auto mr-2" />
                        <span className="text-xl font-bold">JR Drogaria</span>
                    </Link>
                </div>
                
                {/* Menu items */}
                <div className="flex-grow overflow-y-auto py-2">
                    <ul>
                        <li className="px-2 py-1">
                            <Link to='/home'
                                  onClick={() => setActiveMenu(null)}
                                  className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-green-700 hover:shadow-md focus:outline-none`}
                            >
                                <Home className="text-green-200" />
                                <span className="ml-3">Home</span>
                            </Link>
                        </li>
                        {menuItems.map((item) => (
                            <li key={item.id} className="px-2 py-1">
                                <button
                                    onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                                    className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-green-700 hover:shadow-md focus:outline-none ${activeMenu === item.id ? "bg-green-800 shadow-md" : ""}`}
                                >
                                    <span className="text-green-200">{item.icon}</span>
                                    <span className="ml-3">{item.title}</span>
                                    <ChevronRight
                                        className={`w-5 h-5 ml-auto transition-transform duration-200 text-green-200 ${activeMenu === item.id ? "rotate-90" : ""}`}
                                    />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                
                {/* Logout button */}
                <div className="p-4 border-t border-green-800">
                    <button 
                        className="flex items-center w-full px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-red-700 focus:outline-none" 
                        onClick={handleLogout}
                    >
                        <LogOut className="text-red-200" size={20}/>
                        <span className="ml-3">Sair</span>
                    </button>
                </div>
            </nav>

            {/* Submenu */}
            {activeMenu && (
                <div className="w-64 bg-green-800 text-white shadow-lg flex flex-col">
                    <h2 className="px-4 py-3 font-semibold bg-green-700 border-b border-green-600">
                        {menuItems.find((item) => item.id === activeMenu)?.title}
                    </h2>
                    <ul className="p-2">
                        {menuItems
                            .find((item) => item.id === activeMenu)
                            ?.subItems.map((subItem, index) => (
                                <li key={index} className="px-2 py-1">
                                    <Link 
                                        to={subItem.linkTo}
                                        onClick={() => setActiveMenu(null)}
                                        className="flex items-center w-full px-4 py-2 rounded-lg transition-all duration-200 hover:bg-green-600 hover:shadow-md"
                                    >
                                        <span className="text-green-200 mr-2">{subItem.icon}</span>
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
