import { useTasks } from '../features/tasks/hooks/useTasks.js'
import { useNotes  } from '../features/notes/hooks/useNotes.js'
import { useAuthStore } from '../store/useAuthStore.js'
import { useNavigate } from 'react-router-dom'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
    const { user } = useAuthStore()
    const navigate = useNavigate()

    const { data: todoData } = useTasks({ status: 'TODO', limit: 5 })
    const { data: allData } = useTasks({ limit: 100 })
    const { data: notesData } = useNotes({ limit: 100 })

    const total = allData?.total ?? 0
    const done = allData?.tasks?.filter((t) => t.status === 'DONE').length ?? 0
    const highPrio = allData?.tasks?.filter((t) => t.priority === 'HIGH' && t.status !== 'DONE').length ?? 0
    const progress = total > 0 ? Math.round((done / total) * 100) : 0
    const upcomingTasks = todoData?.tasks ?? []

    const hour = new Date().getHours()
    const greeting = hour < 18 ? 'Buenos días' : 'Buenas noches'

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <span className={styles.eyebrow}>{greeting}</span>
                    <h1 className={styles.title}>{user?.username}</h1>
                </div>
                <p className={styles.date}>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
            </header>

            {/* stats bento */}
            <div className={styles.bento}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}> Tareas</span>
                    <span className={styles.statValue}>{total}</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Completadas</span>
                    <span className={styles.statValue}>{done}</span>
                </div>
                <div className={`${styles.statCard} ${styles.statHighlight}`}>
                    <span className={styles.statLabel}>Prioridad Alta</span>
                    <span className={styles.statValue}>{highPrio}</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Notas</span>
                    <span className={styles.statValue}>{notesData?.total ?? 0}</span>
                </div>
            </div>

            {/* progreso */}
            <div className={styles.progressCard}>
                <div className={styles.progressHeader}>
                    <span className={styles.progressLabel}>Progreso</span>
                    <span className={styles.progressPct}>{progress}%</span>
                </div>
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                </div>
                <span className={styles.progressSub}>{done} de {total} tareas completadas</span>
            </div>

            {/* Tareas pendientes */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Siguiente</h2>
                    <button className={styles.seeAll} onClick={() => navigate('/tasks')}>
                        Ver todas
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                    </button>
                </div>

                <div className={styles.taskList}>
                    {upcomingTasks.length === 0 && (
                        <p className={styles.empty}>No hay tareas pendiente. ¡Muy bien!</p>
                    )}
                    {upcomingTasks.map((task) => (
                        <div key={task.id} className={styles.taskRow} onClick={() => navigate('/tasks')}>
                        <div className={`${styles.priorityDot} ${styles[task.priority.toLowerCase()]}`} />
                            <span className={styles.taskTitle}>{task.title}</span>
                            {task.dueDate && (
                                <span className={styles.taskDue}>
                                    {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}