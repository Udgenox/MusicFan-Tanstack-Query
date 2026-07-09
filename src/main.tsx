import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {createRoot} from 'react-dom/client'
import './index.css'
import App from "./App";
// import App from './App.tsx'

const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: Infinity,
                refetchOnWindowFocus: false,
                refetchOnReconnect: false,
                refetchOnMount: false,
                gcTime: 5 * 1000
            }
        }
    }) //создание экземпляра клиента React
// Query - управляет кэшем, контролирует настройки, синхронизирует данные

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>,
)
