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
import QuotationList from "../pages/quotation/QuotationList";
import CreateQuotation from "../pages/quotation/CreateQuotation";
import QuotationDetails from "../pages/quotation/QuotationDetails";
import PriceComparisonView from "../pages/quotation/PriceComparisonView";
import SupplierQuotationForm from "../pages/public/SupplierQuotationForm";
import SupplierSuccess from "../pages/public/SupplierSuccess";
import OrderList from "../pages/orders/OrderList";
import OrderDetails from "../pages/orders/OrderDetails";
import AppLayoutV2 from "../components/v2/AppLayoutV2";
import HomeV2 from "../pages/v2/HomeV2";

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
        path: 'quotation',
        element: <AppLayout />,
        children: [
            { index: true, element: <ProtectedRoute role={ProfileRole.admin}><QuotationList /></ProtectedRoute> },
            { path: 'create', element: <ProtectedRoute role={ProfileRole.admin}><CreateQuotation /></ProtectedRoute> },
            { path: ':id', element: <ProtectedRoute role={ProfileRole.admin}><QuotationDetails /></ProtectedRoute> },
            { path: ':id/comparison', element: <ProtectedRoute role={ProfileRole.admin}><PriceComparisonView /></ProtectedRoute> },
        ]
    },
    {
        path: 'orders',
        element: <AppLayout />,
        children: [
            { index: true, element: <ProtectedRoute role={ProfileRole.admin}><OrderList /></ProtectedRoute> },
            { path: ':id', element: <ProtectedRoute role={ProfileRole.admin}><OrderDetails /></ProtectedRoute> },
        ]
    },
    {
        path: 'v2',
        element: <AppLayoutV2 />,
        children: [
            { index: true, element: <ProtectedRoute role={ProfileRole.admin}><HomeV2 /></ProtectedRoute> },
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
], {
    future: {
    v7_relativeSplatPath: true,
}});