import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AppRouter } from './router/AppRouter.jsx'
import { ToastContainer } from './components/common/Toast/ToastContainer.jsx'
import { GlobalLoader } from './components/common/GlobalLoader/GlobalLoader.jsx'
import './styles/globals.css'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 min, no re-fetcha si los datos son frescos
            retry: 1,
        },
    },
})

// aplica el tema antes del primer render
const savedTheme = localStorage.getItem('theme') || 'light'
document.documentElement.classList.toggle('dark', savedTheme === 'dark')

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AppRouter />
                  <ToastContainer />
                  <GlobalLoader />
            </BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </StrictMode>
)