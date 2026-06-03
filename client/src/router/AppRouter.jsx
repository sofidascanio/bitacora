import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute.jsx'
import { AppLayout } from '../components/layout/AppLayout.jsx'
import { LoginPage } from '../pages/LoginPage.jsx'
import { RegisterPage } from '../pages/RegisterPage.jsx'
import { TasksPage } from '../pages/TasksPage.jsx'
import { NotesPage } from '../pages/NotesPage.jsx'
import { CalendarPage } from '../pages/CalendarPage.jsx'
import { DashboardPage } from '../pages/DashboardPage.jsx'

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
                    <Route path="/notes" element={<NotesPage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    )
}