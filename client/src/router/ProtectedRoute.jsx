import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore.js'

export function ProtectedRoute() {
    const { isAuthenticated } = useAuthStore()
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export function PublicOnlyRoute() {
    const { isAuthenticated } = useAuthStore()
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}