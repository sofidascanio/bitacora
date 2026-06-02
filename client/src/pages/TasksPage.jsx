import { useState } from 'react'
import { useTasks } from '../features/tasks/hooks/useTasks.js'
import { TaskCard } from '../features/tasks/components/TaskCard/TaskCard.jsx'
import { TaskForm } from '../features/tasks/components/TaskForm/TaskForm.jsx'
import { Button } from '../components/common/Button/Button.jsx'
import styles from './TasksPage.module.css'

const STATUS_COLUMNS = [
  { key: 'TODO', label: 'Pendiente' },
  { key: 'IN_PROGRESS', label: 'En Progreso' },
  { key: 'DONE', label: 'Terminada' },
]

export function TasksPage() {
    const [showForm, setShowForm]  = useState(false)
    const [editingTask, setEditingTask] = useState(null)
    const [search, setSearch]  = useState('')

    const { data, isLoading, isError } = useTasks({ search: search || undefined })

    const tasks = data?.tasks ?? []

    function tasksByStatus(status) {
        return tasks.filter((t) => t.status === status)
    }

    function handleEdit(task) {
        setEditingTask(task)
        setShowForm(true)
    }

    function handleCloseForm() {
        setShowForm(false)
        setEditingTask(null)
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <span className={styles.eyebrow}> Tus Tareas </span>
                    <h1 className={styles.title}> Tareas </h1>
                </div>

                <div className={styles.headerActions}>
                    <div className={styles.searchWrapper}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: 18 }}>search</span>
                        <input className={styles.searchInput}
                            placeholder="Buscar tarea.."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}/>
                    </div>
                    <Button onClick={() => setShowForm(true)}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                        Nueva Tarea
                    </Button>
                </div>
            </header>

            {isLoading && <div className={styles.state}>Cargando tareas...</div>}
            {isError && <div className={styles.stateError}>No se pudo cargar las tareas.</div>}

            {!isLoading && !isError && (
                <div className={styles.board}>
                    {STATUS_COLUMNS.map(({ key, label }) => (
                        <div key={key} className={styles.column}>
                            <div className={styles.columnHeader}>
                                <span className={styles.columnLabel}>{label}</span>
                                <span className={styles.columnCount}>{tasksByStatus(key).length}</span>
                            </div>

                            <div className={styles.columnBody}>
                                {tasksByStatus(key).length === 0 ? (
                                    <div className={styles.empty}> No hay tareas. </div>
                                ) : (
                                    tasksByStatus(key).map((task) => (
                                        <TaskCard key={task.id} task={task} onEdit={handleEdit} />
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <TaskForm task={editingTask} onClose={handleCloseForm} />
            )}
        </div>
    )
}