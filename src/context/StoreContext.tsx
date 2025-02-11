import React, { createContext, useState } from "react";
import {loginUser} from "../database/auth/authQuery.tsx";
import Database from "@tauri-apps/plugin-sql";




export type StoreContext = {
    store: Database | null,
    setStore: (store: Database) => void,
    login: (conn: Database,username: string, password: string) => Promise<any>

}
export type Props = {
    children?: React.ReactNode;
};

export const StoreContext = createContext<StoreContext>({} as StoreContext);

const StoreProvider = ({ children }: Props) => {

    const [store, setStore] = useState<Database | null>(null)
    const login = async (conn: Database, username: string, password: string) => {

       const result = await loginUser(conn,username, password)
        if(result.loggedIn) {
            setStore(conn)
        }
       return result
        }

    return (
        <StoreContext.Provider value={{ store, setStore, login}}>
            { children }
        </StoreContext.Provider>
    )
}

export default StoreProvider;