import {createBrowserRouter, Navigate} from "react-router-dom";
import Login from "../pages/Login.tsx";
import Home from "../pages/Home.tsx";
import AddSupplier from "../pages/AddSupplier.tsx";
import SupplierList from "../pages/SupplierList.tsx";
import AppLayout from "../pages/AppLayout.tsx";
import ShoppingList from "../pages/SupplierList.tsx";
import ProductsPage from "../pages/Products.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" />
    },
    {
        path: 'login',
        element: <Login />
    },
    {
        path: 'home',
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <Home />
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
                element: <ProductsPage />
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
                element: <SupplierList />
            },
            {
                path: 'add-supplier',
                element: <AddSupplier />
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
                element: <ShoppingList />
            },
        ]
    },
], {
    future: {
    v7_relativeSplatPath: true,
}});