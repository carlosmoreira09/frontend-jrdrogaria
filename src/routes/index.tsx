import {createBrowserRouter, Navigate} from "react-router-dom";
import Home from "../pages/Home";
import AddSupplier from "../pages/supplier/AddSupplier";
import SupplierList from "../pages/supplier/SupplierList";
import AppLayout from "../pages/AppLayout";
import ProductsPage from "../pages/product/Products";
import ShoppingList from "../pages/shoppinglist/ShoppingList";
import LandingPage from "../pages/LandingPage";
import AdminLogin from "../pages/AdminLogin";
import {ProtectedRoute} from "./ProtectedRoute/ProtectedRoute";
import {ProfileRole} from "../types/ProfileRole";
import {PriceComparison} from "../pages/shoppinglist/PriceComparison";

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
                path: 'price-comparison/:id',
                element:<ProtectedRoute role={ProfileRole.admin}><PriceComparison /></ProtectedRoute>
            },
        ]
    },
], {
    future: {
    v7_relativeSplatPath: true,
}});