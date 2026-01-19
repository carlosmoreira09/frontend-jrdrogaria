import {RouterProvider} from "react-router";
import React from "react";
import {router} from "./routes";
import StoreProvider from "./context/StoreContext";
import {ToastProvider} from "./components/ui/toast";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

const App: React.FC = () => {
    return (
        <div className="">
            <main className="flex-1">
                <QueryClientProvider client={queryClient}>
                    <StoreProvider>
                        <ToastProvider>
                        <RouterProvider future={{
                            v7_startTransition: true,
                        }} router={router}/>
                        </ToastProvider>
                    </StoreProvider>
                </QueryClientProvider>
            </main>
        </div>
    )
};

export default App;