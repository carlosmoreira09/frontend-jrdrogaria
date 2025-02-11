import React, { createContext, useState } from "react";
import Database from "@tauri-apps/plugin-sql";
import Cookies from 'js-cookie';
import { LoginResponse } from "../types/types";
import { loginService } from "../service/authService";



export type StoreContext = {
    store: Database | null,
    setStore: (store: Database) => void,
    login: (conn: Database,username: string, password: string) => Promise<any>

}
export type Props = {
    children?: React.ReactNode;
};

export const StoreContext = createContext<StoreContext>({} as StoreContext);

const saveStorage = (user: LoginResponse, token: string) => {
    Cookies.set('token', token);
    Cookies.set('user', JSON.stringify(user));
};

const StoreProvider = ({ children }: Props) => {

    const [store, setStore] = useState<Database | null>(null)
    const login = async (username: string, password: string) => {
        await loginService(username,password)
        return ''
        }

    return (
        <StoreContext.Provider value={{ store, setStore, login}}>
            { children }
        </StoreContext.Provider>
    )
}

export default StoreProvider;