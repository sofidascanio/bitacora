import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar/Sidebar.jsx'
import styles from './AppLayout.module.css'

export function AppLayout() {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

    return (
        <div className={styles.layout}>
            {/* overlay mobile */}
            {mobileSidebarOpen && (
                <div className={styles.overlay}
                    onClick={() => setMobileSidebarOpen(false)}/>
            )}

            <Sidebar mobileOpen={mobileSidebarOpen}
                    onMobileClose={() => setMobileSidebarOpen(false)}/>

            <main className={styles.main}>
                {/* top bar mobile */}
                <div className={styles.mobileHeader}>
                    <button className={styles.menuBtn}
                            onClick={() => setMobileSidebarOpen(true)}>
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <span className={styles.mobileLogo}>Focus</span>
                </div>

                <Outlet />
            </main>
        </div>
    )
}