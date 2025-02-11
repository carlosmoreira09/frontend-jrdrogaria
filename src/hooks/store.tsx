import {useContext} from "react";
import {StoreContext} from "../context/StoreContext.tsx";

export const useStore = () => {
    return useContext(StoreContext);
};