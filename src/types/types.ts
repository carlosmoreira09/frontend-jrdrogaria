import {ProfileRole} from "./ProfileRole.ts";

export type User = {
    id: number
    username: string,
    password: string
}

export type Product = {
    id?: number,
    product: string,
    stock: number,
}
export type Supplier = {
    id?: number,
    supplier_name: string,
    cnpj: string,
    whatsapp: string,
    payment_mode: string,
    payment_term: string,
}

export interface Login {
    username: string;
    password: string;
}
export interface GeneralResponse {
    message: string;
    token?: string;
    data?: string;
}

export interface ITokenPayload {
    userId: number;
    tenantId?: number;
    role: ProfileRole;
    exp: number;
    iat: number;
    tenantName?: string;
}