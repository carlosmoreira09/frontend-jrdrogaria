import React, { createContext, useState } from "react";
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
    const login = async () => {
        return ''
        }

    return (
        <StoreContext.Provider value={{ store, setStore, login}}>
            { children }
        </StoreContext.Provider>
    )
}

export default StoreProvider;