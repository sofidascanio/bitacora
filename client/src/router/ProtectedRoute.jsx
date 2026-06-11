import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore.js'

export function ProtectedRoute() {
    const { token, user } = useAuthStore()
    // si hay token pero todavia no hay user, deja pasar
    // el dashboardpage hace fetch de /auth/me y si falla el interceptor limpia todo
    if (!token) {
        return <Navigate to="/login" replace />
    }
    return <Outlet />
}

export function PublicOnlyRoute() {
    const { token } = useAuthStore()
    if (token) {
        return <Navigate to="/dashboard" replace />
    }
    return <Outlet />
}