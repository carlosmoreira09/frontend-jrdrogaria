import React, {createContext, useEffect, useState} from "react";
import Cookies from 'js-cookie';
import {GeneralResponse, ITokenPayload} from "../types/types";
import { loginService } from "../service/authService";
import {jwtDecode} from "jwt-decode";
import {ProfileRole} from "../types/ProfileRole.ts";


export type StoreContext = {
    store: number | undefined;
    setStore: (store: number) => void;
    login: (username: string, password: string, store: number) => Promise<GeneralResponse>
    logOut: () => void;
    isAuthenticated: boolean;
    userId?: number;
    role: ProfileRole;
    token: string;
    tenantName?: string
}
export type Props = {
    children?: React.ReactNode;
};

export const StoreContext = createContext<StoreContext>({} as StoreContext);

const saveStorage = (user: ITokenPayload, token: string) => {
    Cookies.set('token', token);
    Cookies.set('user', JSON.stringify(user));
};

const StoreProvider = ({ children }: Props) => {

    useEffect(() => {
        const checkToken = async () => {
            try {
                const tokenFromStorage = Cookies.get('token');
                const user = Cookies.get('user');

                if (tokenFromStorage && user) {
                    const decoded: ITokenPayload = jwtDecode(tokenFromStorage);
                    if (decoded.exp * 1000 < Date.now()) {
                        logOut();
                    } else {
                        setStore(decoded.tenantId)
                        setRole(decoded.role)
                        setIsAuthenticated(true)
                    }
                }
            } catch (error) {
                console.error("Erro ao decodificar token:", error);
                logOut();
            }
        };

        checkToken().then();
    }, []);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState<ProfileRole>(ProfileRole.admin);
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState<number>();
    const [tenantName, setTenantName] = useState<string>();
    const [store, setStore] = useState<number | undefined>(undefined)
    const login = async (username: string, password: string, store: number) => {
        const result = await loginService(username,password)

        if(result  && result?.token) {
            const decoded: ITokenPayload = jwtDecode(result.token)
            saveStorage(decoded,result.token)
            setStore(store)
            setRole(decoded.role)
            setIsAuthenticated(true)
            setUserId(decoded.userId)
            setToken(result.token)
            setTenantName(decoded.tenantName)
        } else {
            throw new Error('Erro ao realizar login')
        }
        return result
    }
    const logOut = () => {
        Cookies.remove("token");
        Cookies.remove("user");
        setStore(undefined)
    };

    return (
        <StoreContext.Provider value={{
            store,
            setStore,
            login,
            isAuthenticated,
            role,
            token,
            logOut,
            userId,
            tenantName}}>
            { children }
        </StoreContext.Provider>
    )
}

export default StoreProvider;