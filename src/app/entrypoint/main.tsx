import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {createRouter, RouterProvider} from "@tanstack/react-router";
import {createRoot} from 'react-dom/client'
import '../styles/reset.css'
import '../styles/index.css'
import {routeTree} from "../routes/routeTree.gen";
// import PlaylistsPage from './playlists-page.tsx'

const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5000,
                refetchOnWindowFocus: false,
                refetchOnReconnect: false,
                refetchOnMount: false,
                gcTime: 20 * 1000
            }
        }
    }) //создание экземпляра клиента React
// Query - управляет кэшем, контролирует настройки, синхронизирует данные

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router
    }
}

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>,
)
