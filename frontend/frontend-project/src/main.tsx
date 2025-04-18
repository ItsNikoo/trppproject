import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
<<<<<<< HEAD
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <App/>
        </QueryClientProvider>
=======

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App/>
>>>>>>> b63f5ce7b48603637a510e2e78b66d25a3954c60
    </StrictMode>,
)
