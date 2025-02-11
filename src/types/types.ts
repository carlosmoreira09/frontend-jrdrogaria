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