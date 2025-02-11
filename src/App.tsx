import {RouterProvider} from "react-router";
import React from "react";
import {router} from "./routes";
import StoreProvider from "./context/StoreContext.tsx";
import {ToastProvider} from "./components/ui/toast.tsx";

const App: React.FC = () => {
    return (
        <div className="">
            <main className="flex-1">
                <StoreProvider>
                    <ToastProvider>
                    <RouterProvider router={router}/>
                    </ToastProvider>
                </StoreProvider>
            </main>
        </div>
    )
};

export default App;