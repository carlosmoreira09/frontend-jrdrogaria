import {createBrowserRouter, Navigate} from "react-router-dom";
import Home from "../pages/Home";
import AddSupplier from "../pages/supplier/AddSupplier";
import SupplierList from "../pages/supplier/SupplierList";
import AppLayout from "../pages/AppLayout";
import ProductsPage from "../pages/product/Products";
import ShoppingList from "../pages/shoppinglist/ShoppingList";
import LandingPageLegacy from "../pages/landingpage/LandingPageLegacy";
import CotaRodarLanding from "../pages/landingpage/CotaRodarLanding";
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

import AppLayoutV3 from "../components/v3/AppLayoutV3";
import HomeV3 from "../pages/v3/HomeV3";
import ProductsV3 from "../pages/v3/ProductsV3";
import SuppliersV3 from "../pages/v3/SuppliersV3";
import QuotationsV3 from "../pages/v3/QuotationsV3";
import OrdersV3 from "../pages/v3/OrdersV3";
import SubscriptionPage from "../pages/v3/SubscriptionPage";
import TenantLogin from "../pages/v3/TenantLogin";

import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminTenants from "../pages/admin/AdminTenants";
import AdminTenantDetail from "../pages/admin/AdminTenantDetail";
import AdminAuditLogs from "../pages/admin/AdminAuditLogs";
import AdminLoginPage from "../pages/admin/AdminLogin";
import AdminCreateTenant from "../pages/admin/AdminCreateTenant";
import { AdminAuthProvider } from "../context/AdminAuthContext";
import AdminLoginLegacy from "../pages/AdminLogin";
import Error401 from "../pages/Error401";

export const router = createBrowserRouter([
    // =============================================
    // LEGACY Routes (JR Drogaria) - Mantido para produção atual
    // =============================================
    {
        path: "/",
        element: <LandingPageLegacy />
    },
    {
        path: 'login',
        element: <AdminLoginLegacy />
    },
    {
        path: 'error-401',
        element: <Error401 />
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
        path: 'quote-open/:token',
        element: <AnonymousSupplierForm />
    },
    // =============================================
    // CotaRodar v3 Routes - Nova plataforma SaaS
    // =============================================
    {
        path: 'v3',
        element: <CotaRodarLanding />
    },
    {
        path: 'v3/login',
        element: <TenantLogin />
    },
    {
        path: 'v3/app',
        element: <AppLayoutV3 />,
        children: [
            { index: true, element: <HomeV3 /> },
            { path: 'products', element: <ProductsV3 /> },
            { path: 'suppliers', element: <SuppliersV3 /> },
            { path: 'quotations', element: <QuotationsV3 /> },
            { path: 'orders', element: <OrdersV3 /> },
            { path: 'subscription', element: <SubscriptionPage /> },
        ]
    },
    {
        path: 'admin/login',
        element: <AdminAuthProvider><AdminLoginPage /></AdminAuthProvider>
    },
    {
        path: 'admin',
        element: <AdminAuthProvider><AdminLayout /></AdminAuthProvider>,
        children: [
            { index: true, element: <AdminDashboard /> },
            { path: 'tenants', element: <AdminTenants /> },
            { path: 'tenants/new', element: <AdminCreateTenant /> },
            { path: 'tenants/:id', element: <AdminTenantDetail /> },
            { path: 'audit-logs', element: <AdminAuditLogs /> },
        ]
    },
], {
    future: {
    v7_relativeSplatPath: true,
}});