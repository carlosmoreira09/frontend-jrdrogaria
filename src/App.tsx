import {RouterProvider} from "react-router";
import React from "react";
import {router} from "./routes";
import StoreProvider from "./context/StoreContext";
import {ToastProvider} from "./components/ui/toast";

const App: React.FC = () => {
    return (
        <div className="">
            <main className="flex-1">
                <StoreProvider>
                    <ToastProvider>
                    <RouterProvider future={{
                        v7_startTransition: true,
                    }} router={router}/>
                    </ToastProvider>
                </StoreProvider>
            </main>
        </div>
    )
};

export default App;