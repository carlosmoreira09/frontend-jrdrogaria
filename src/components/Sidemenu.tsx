import { useState, useRef, useEffect } from "react"
import {
  ChevronRight,
  ShoppingCart,
  Pill,
  Truck,
  Settings,
  Home,
  LogOut,
  PlusCircle,
  List,
  BarChart2,
  Menu as MenuIcon,
  X,
  PanelLeftClose,
  PanelLeft
} from "lucide-react"
import type React from "react"
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";
import {useStore} from "../hooks/store.tsx";
import appLogo from '../assets/app-logo.jpeg';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./ui/select.tsx";
import {storeOptions} from "../lib/utils.ts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar.tsx";

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
    ]
    // {{
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
    // ... }}]

const SidebarMenu: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [currentTime, setCurrentTime] = useState(new Date())
    const [selectStore, setSelectedStore] = useState<string>('1')
    const [username, setUsername] = useState<string>('Usuário')
    const [title, setTitle] = useState<string>('')
    
    const navigate = useNavigate();
    const store = useStore()
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        store.logOut()
        navigate("/")
    }

    // Toggle sidebar collapse state
    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
        // Store preference in localStorage
        localStorage.setItem('sidebarCollapsed', (!isSidebarCollapsed).toString());
    }

    useEffect(() => {
        // Timer for current time
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        
        // Get username from localStorage
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }

        // Get sidebar collapsed preference
        const sidebarCollapsed = localStorage.getItem('sidebarCollapsed');
        if (sidebarCollapsed) {
            setIsSidebarCollapsed(sidebarCollapsed === 'true');
        }
        
        return () => clearInterval(timer)
    }, []);

    useEffect(() => {
        if(selectStore) {
           const result = storeOptions.find((store) => store.id == parseInt(selectStore))
            if(result){
                store.setStore(result.id)
                store.setTenantName(result.name)
                setTitle(result.name)
            }
        }
    }, [selectStore]);

    useEffect(() => {
        // Check if device is mobile/tablet
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024); // 1024px is typical tablet breakpoint
        };
        
        // Initial check
        checkMobile();
        
        // Add resize listener
        window.addEventListener('resize', checkMobile);
        
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenu(null);
                if (isMobile) {
                    setIsMobileMenuOpen(false);
                }
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isMobile]);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    }

    // Get initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Render mobile top navbar
    const renderMobileNav = () => {
        return (
            <div className="fixed top-0 left-0 w-full bg-green-900 shadow-lg z-50">
                {/* Mobile top bar */}
                <div className="flex justify-between items-center p-3">
                    <div className="flex items-center">
                        <img src={appLogo} alt="JR Drogaria Logo" className="rounded-full h-8 w-auto mr-2" />
                        <span className="text-white text-lg font-bold">JR Drogaria</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        {/* Store selector */}
                        <div className="hidden sm:block">
                            <Select value={selectStore} onValueChange={setSelectedStore}>
                                <SelectTrigger 
                                    className="min-w-max p-1 h-8 rounded-full text-white bg-green-800 border-green-700"
                                    id="store">
                                    <SelectValue placeholder="Loja"/>
                                </SelectTrigger>
                                <SelectContent className="bg-gray-200">
                                    {storeOptions.map((store) => (
                                        <SelectItem key={store.id} value={store.id.toString()}>
                                            {store.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {/* Time display */}
                        <div className="hidden sm:block text-white text-xs">
                            <div>{formatTime(currentTime)}</div>
                        </div>
                        
                        {/* Avatar */}
                        <div className="mr-2">
                            <Avatar className="h-8 w-8 cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                <AvatarImage src="/avatars/01.png" alt={username} />
                                <AvatarFallback className="bg-green-700">{getInitials(username)}</AvatarFallback>
                            </Avatar>
                        </div>
                        
                        {/* Menu toggle */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-1 rounded-lg text-white hover:bg-green-700 focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
                
                {/* Store selector for extra small screens */}
                <div className="sm:hidden px-3 pb-2">
                    <Select value={selectStore} onValueChange={setSelectedStore}>
                        <SelectTrigger 
                            className="w-full p-1 h-8 rounded-full text-white bg-green-800 border-green-700"
                            id="mobile-store">
                            <SelectValue placeholder="Selecione a loja"/>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-200">
                            {storeOptions.map((store) => (
                                <SelectItem key={store.id} value={store.id.toString()}>
                                    {store.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                {/* Mobile expanded menu */}
                {isMobileMenuOpen && (
                    <div className="bg-green-800 text-white p-2 max-h-[80vh] overflow-y-auto">
                        {/* User info at top of menu */}
                        <div className="p-3 mb-2 bg-green-700 rounded-lg">
                            <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-3">
                                    <AvatarImage src="/avatars/01.png" alt={username} />
                                    <AvatarFallback className="bg-green-600">{getInitials(username)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">{username}</div>
                                    <div className="text-sm text-green-200">{title} Drogaria</div>
                                </div>
                            </div>
                        </div>
                        
                        <ul>
                            <li className="px-2 py-1">
                                <Link to='/home'
                                    onClick={() => {
                                        setActiveMenu(null);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center w-full px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-green-700 hover:shadow-md focus:outline-none"
                                >
                                    <Home className="text-green-200" />
                                    <span className="ml-3">Home</span>
                                </Link>
                            </li>
                            {menuItems.map((item) => (
                                <li key={item.id} className="px-2 py-1">
                                    <button
                                        onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                                        className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-green-700 hover:shadow-md focus:outline-none ${activeMenu === item.id ? "bg-green-700 shadow-md" : ""}`}
                                    >
                                        <span className="text-green-200">{item.icon}</span>
                                        <span className="ml-3">{item.title}</span>
                                        <ChevronRight
                                            className={`w-5 h-5 ml-auto transition-transform duration-200 text-green-200 ${activeMenu === item.id ? "rotate-90" : ""}`}
                                        />
                                    </button>
                                    
                                    {/* Submenu items */}
                                    {activeMenu === item.id && (
                                        <ul className="pl-8 mt-1 space-y-1">
                                            {item.subItems.map((subItem, index) => (
                                                <li key={index}>
                                                    <Link 
                                                        to={subItem.linkTo}
                                                        onClick={() => {
                                                            setActiveMenu(null);
                                                            setIsMobileMenuOpen(false);
                                                        }}
                                                        className="flex items-center w-full px-4 py-2 rounded-lg transition-all duration-200 hover:bg-green-600 hover:shadow-md"
                                                    >
                                                        <span className="text-green-200 mr-2">{subItem.icon}</span>
                                                        {subItem.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                            <li className="px-2 py-1">
                                <button 
                                    className="flex items-center w-full px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-red-700 focus:outline-none" 
                                    onClick={handleLogout}
                                >
                                    <LogOut className="text-red-200" size={20}/>
                                    <span className="ml-3">Sair</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    // Render collapsed sidebar for desktop
    const renderCollapsedSidebar = () => {
        return (
            <div className="fixed h-screen bg-green-900 shadow-lg z-40 w-16">
                <nav className="bg-green-900 text-white shadow-lg flex flex-col h-full">
                    {/* Logo section */}
                    <div className="p-3 border-b border-green-800 flex items-center justify-center">
                        <img src={appLogo} alt="JR Drogaria Logo" className="rounded-full h-10 w-10" />
                    </div>
                    
                    {/* Toggle button */}
                    <button 
                        onClick={toggleSidebar}
                        className="p-3 text-green-200 hover:bg-green-800 focus:outline-none flex justify-center"
                        title="Expand sidebar"
                    >
                        <PanelLeft className="w-6 h-6" />
                    </button>
                    
                    {/* Menu items - icons only */}
                    <div className="flex-grow overflow-y-auto py-2">
                        <ul>
                            <li className="py-2">
                                <Link to='/home'
                                    title="Home"
                                    className="flex justify-center w-full p-2 rounded-lg transition-all duration-200 hover:bg-green-700 hover:shadow-md focus:outline-none"
                                >
                                    <Home className="text-green-200 w-6 h-6" />
                                </Link>
                            </li>
                            {menuItems.map((item) => (
                                <li key={item.id} className="py-2">
                                    <Link 
                                        to={item.subItems[0]?.linkTo || '#'}
                                        title={item.title}
                                        className="flex justify-center w-full p-2 rounded-lg transition-all duration-200 hover:bg-green-700 hover:shadow-md focus:outline-none"
                                    >
                                        <span className="text-green-200">{item.icon}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Logout button */}
                    <div className="p-3 border-t border-green-800">
                        <button 
                            className="flex justify-center w-full p-2 rounded-lg transition-all duration-200 hover:bg-red-700 focus:outline-none" 
                            onClick={handleLogout}
                            title="Sair"
                        >
                            <LogOut className="text-red-200" size={20}/>
                        </button>
                    </div>
                </nav>
            </div>
        );
    };

    // Render desktop sidebar
    const renderDesktopSidebar = () => {
        if (isSidebarCollapsed) {
            return renderCollapsedSidebar();
        }
        
        return (
            <div ref={menuRef} className="flex h-screen bg-green-900 fixed z-40">
                <nav className="w-64 bg-green-900 text-white shadow-lg flex flex-col">
                    {/* Logo section */}
                    <div className="p-4 border-b border-green-800 flex items-center justify-between">
                        <Link to="/home" className="flex items-center transform hover:scale-105 transition-transform duration-200">
                            <img src={appLogo} alt="JR Drogaria Logo" className="rounded-full h-10 w-auto mr-2" />
                            <span className="text-xl font-bold">JR Drogaria</span>
                        </Link>
                        
                        {/* Toggle button */}
                        <button 
                            onClick={toggleSidebar}
                            className="p-1 text-green-200 hover:bg-green-800 rounded-lg focus:outline-none"
                            title="Collapse sidebar"
                        >
                            <PanelLeftClose className="w-5 h-5" />
                        </button>
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
        );
    };

    return isMobile ? renderMobileNav() : renderDesktopSidebar();
}

export default SidebarMenu;
