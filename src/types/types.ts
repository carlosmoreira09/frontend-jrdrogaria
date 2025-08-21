import {ProfileRole} from "./ProfileRole.ts";


export interface Product {
    id?: number,
    product_name?: string,
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