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

import PriceComparisonView from "../pages/v2/PriceComparisonView.tsx";
import SupplierQuotationForm from "../pages/public/SupplierQuotationForm";
import AnonymousSupplierForm from "../pages/public/AnonymousSupplierForm";
import SupplierSuccess from "../pages/public/SupplierSuccess";
import OrderList from "../pages/orders/OrderList";
import OrderDetails from "../pages/orders/OrderDetails";
import AppLayoutV2 from "../components/v2/AppLayoutV2";
import HomeV2 from "../pages/v2/HomeV2";
import ProductsV2 from "../pages/v2/ProductsV2";
import QuotationListV2 from "../pages/v2/QuotationListV2";
import CreateQuotationV2 from "../pages/v2/CreateQuotationV2";
import QuotationDetailsV2 from "../pages/v2/QuotationDetailsV2";

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
    {
        path: 'v2',
        element: <AppLayoutV2 />,
        children: [
            { index: true, element: <ProtectedRoute role={ProfileRole.admin}><HomeV2 /></ProtectedRoute> },
            { path: 'products', element: <ProtectedRoute role={ProfileRole.admin}><ProductsV2 /></ProtectedRoute> },
            { path: 'quotation', element: <ProtectedRoute role={ProfileRole.admin}><QuotationListV2 /></ProtectedRoute> },
            { path: 'quotation/create', element: <ProtectedRoute role={ProfileRole.admin}><CreateQuotationV2 /></ProtectedRoute> },
            { path: 'quotation/:id', element: <ProtectedRoute role={ProfileRole.admin}><QuotationDetailsV2 /></ProtectedRoute> },
            {
                path: 'orders',
                children: [
                    { index: true, element: <ProtectedRoute role={ProfileRole.admin}><OrderList /></ProtectedRoute> },
                    { path: ':id', element: <ProtectedRoute role={ProfileRole.admin}><OrderDetails /></ProtectedRoute> },
                ]
            },
            {
                path: 'quotation',
                children: [
                    { index: true, element: <ProtectedRoute role={ProfileRole.admin}><QuotationListV2 /></ProtectedRoute> },
                    { path: 'create', element: <ProtectedRoute role={ProfileRole.admin}><CreateQuotationV2 /></ProtectedRoute> },
                    { path: ':id', element: <ProtectedRoute role={ProfileRole.admin}><QuotationDetailsV2 /></ProtectedRoute> },
                    { path: ':id/comparison', element: <ProtectedRoute role={ProfileRole.admin}><PriceComparisonView /></ProtectedRoute> },
                ]
            },
            {
                path: 'supplier',
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
        ]
    },
    {
        path: 'supplier-quote/:token',
        element: <SupplierQuotationForm />
    },
    {
        path: 'supplier-quote/success',
        element: <SupplierSuccess />
    },
    {
        path: 'quote-open/:id',
        element: <AnonymousSupplierForm />
    },
], {
    future: {
    v7_relativeSplatPath: true,
}});