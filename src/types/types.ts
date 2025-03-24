import {ProfileRole} from "./ProfileRole.ts";

export interface User {
    id: number
    username: string,
    password: string
}

export interface Product {
    id?: number,
    product_name?: string,
    stock?: number,
    selected?: boolean
    price?: number
    tenants?: Tenant
}
export interface Tenant {
    id: number
    name: string
    domain: string
    whatsAppNumber: string

}

export interface IShoppingList {
    id?: number
    products: Product[]
    product_price?: number
    supplier?: Supplier
    tenants?: Tenant
}
export interface Supplier  {
    id?: number;
    supplier_name: string;
    cnpj: string;
    email: string;
    whatsAppNumber: string;
    payment_mode: string;
    payment_term: string;
}

export interface Login {
    username: string;
    password: string;
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