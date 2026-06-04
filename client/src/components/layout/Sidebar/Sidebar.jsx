import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/useAuthStore.js'
import { useUIStore } from '../../../store/useUIStore.js'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
    { to: '/dashboard', icon: 'grid_view', label: 'Dashboard' },
    { to: '/tasks', icon: 'event_note', label: 'Tareas' },
    { to: '/calendar', icon: 'calendar_today', label: 'Calendario' },
    { to: '/notes', icon: 'sticky_note_2', label: 'Notas' },
]

export function Sidebar({ mobileOpen = false, onMobileClose }) {
    const { user, logout } = useAuthStore()
    const { toggleTheme, theme } = useUIStore()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/login')
    }

    return (
        <aside className={`${styles.sidebar} ${mobileOpen ? styles.mobileOpen : ''}`}>
                <button className={styles.mobileCloseBtn}
                        onClick={onMobileClose}
                        title="Cerrar Menu">
                    <span className="material-symbols-outlined">close</span>
                </button>
            
            <div className={styles.brand}>
                <h1 className={styles.brandName}>Bitacora</h1>
                <p className={styles.brandSub}>Agenda Minimalista</p>
            </div>

            <nav className={styles.nav}>
                {NAV_ITEMS.map(({ to, icon, label }) => (
                    <NavLink key={to}
                            to={to}
                            className={({ isActive }) =>
                                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                            }>
                        <span className="material-symbols-outlined">{icon}</span>
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className={styles.bottom}>
                <button className={styles.themeBtn} onClick={toggleTheme}>
                    <span className="material-symbols-outlined">
                        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                    </span>
                    <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>
                </button>

                <div className={styles.user}>
                    <div className={styles.avatar}>
                        {user?.username?.[0]?.toUpperCase()}
                    </div>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>{user?.username}</span>
                        <span className={styles.userEmail}>{user?.email}</span>
                    </div>
                    <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
                        <span className="material-symbols-outlined">logout</span>
                    </button>
                </div>
            </div>
        </aside>
    )
}