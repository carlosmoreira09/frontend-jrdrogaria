import {createBrowserRouter, Navigate} from "react-router-dom";
import Home from "../pages/Home.tsx";
import AddSupplier from "../pages/supplier/AddSupplier.tsx";
import SupplierList from "../pages/supplier/SupplierList.tsx";
import AppLayout from "../pages/AppLayout.tsx";
import ProductsPage from "../pages/product/Products.tsx";
import ShoppingList from "../pages/shoppinglist/ShoppingList.tsx";
import PriceComparison from "../pages/shoppinglist/PriceComparison.tsx";
import LandingPage from "../pages/LandingPage.tsx";
import AdminLogin from "../pages/AdminLogin.tsx";
import {ProtectedRoute} from "./ProtectedRoute/ProtectedRoute.tsx";
import {ProfileRole} from "../types/ProfileRole.ts";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />
    },
    {
        path: 'login',
        element: <AdminLogin />
    },
    {
        path: 'home',
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <ProtectedRoute role={ProfileRole.admin}><Home /></ProtectedRoute>
            }]
    },
    {
        path: 'product',
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <Navigate to={'home'} />
            },
            {
                path: 'home',
                element: <ProtectedRoute role={ProfileRole.admin}><ProductsPage /></ProtectedRoute>
            },

            ]
    },
    {
        path: 'supplier',
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <Navigate to={'home'} />
            },
            {
                path: 'home',
                element: <ProtectedRoute role={ProfileRole.admin}><SupplierList /></ProtectedRoute>
            },
            {
                path: 'add-supplier',
                element: <ProtectedRoute role={ProfileRole.admin}><AddSupplier /></ProtectedRoute>
            }
        ]
    },
    {
        path: 'shopping',
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <Navigate to={'home'} />
            },
            {
                path: 'home',
                element:<ProtectedRoute role={ProfileRole.admin}><ShoppingList /></ProtectedRoute>
            },
            {
                path: 'price-comparison',
                element:<ProtectedRoute role={ProfileRole.admin}><PriceComparison /></ProtectedRoute>
            },
        ]
    },
], {
    future: {
    v7_relativeSplatPath: true,
}});