import {ProfileRole} from "./ProfileRole.ts";

export type User = {
    id: number
    username: string,
    password: string
}

export type Product = {
    id?: number,
    product_name: string,
    stock: number,
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
export type Supplier = {
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