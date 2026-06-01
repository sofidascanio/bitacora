import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute.jsx'
import { LoginPage } from '../pages/LoginPage.jsx'
import { RegisterPage } from '../pages/RegisterPage.jsx'

// placeholder 
function DashboardPage() {
    return <div style={{ padding: '2rem' }}>Dashboard </div>
}

export function AppRouter() {
    return (
        <Routes>
            {/* rutas publicas */}
            <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* rutas protegidas */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            {/* catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    )
}