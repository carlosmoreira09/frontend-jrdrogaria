import {ProfileRole} from "./ProfileRole.ts";


export interface Product {
    id?: number,
    product_name?: string,
    sku: string;
    category: string;
    unit: string;
    is_active: boolean;
}

export interface IProductAndStock {
    id?: number
    product?: string
    stockJR?: number
    stockGS?: number
    stockBARAO?: number
    stockLB?: number
}

export interface IShoppingList {
    id?: number
    list_name: string
    products: IProductAndStock[]
    created_at?: string;
}

export interface Supplier  {
    id?: number;
    supplier_name: string;
    whatsAppNumber: string;
    payment_term: string;
    cnpj?: string;
    contactName?: string;
    contactPhone?: string;
    status?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface GeneralResponse {
    message: string;
    token?: string;
    data?: any[];
}

export interface ITokenPayload {
    userId: number;
    tenantId?: number;
    role: ProfileRole;
    exp: number;
    iat: number;
    tenantName?: string;
}