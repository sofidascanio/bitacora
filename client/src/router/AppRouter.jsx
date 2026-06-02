import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute.jsx'
import { AppLayout } from '../components/layout/AppLayout.jsx'
import { LoginPage } from '../pages/LoginPage.jsx'
import { RegisterPage } from '../pages/RegisterPage.jsx'
import { TasksPage } from '../pages/TasksPage.jsx'

function DashboardPage() {
  return <div style={{ padding: 'var(--space-lg) var(--space-margin)' }}>Dashboard </div>
}

export function AppRouter() {
    return (
        <Routes>
            <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    )
}