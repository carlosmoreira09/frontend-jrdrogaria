import {ProfileRole} from "./ProfileRole.ts";

export interface User {
    id: number
    username: string,
    password: string
}

export interface Product {
    id?: number,
    product_name?: string,
    tenants?: Tenant
}
export interface Tenant {
    id: number
    name: string
    domain: string
    whatsAppNumber: string

}

export interface IProductAndStock {
    product?: string
    stock: number
}

export interface IShoppingList {
    id?: number
    list_name: string
    products: IProductAndStock[]
}
export interface Supplier  {
    id?: number;
    supplier_name: string;
    whatsAppNumber: string;
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