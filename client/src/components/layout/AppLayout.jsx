import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar/Sidebar.jsx'
import styles from './AppLayout.module.css'

export function AppLayout() {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    )
}