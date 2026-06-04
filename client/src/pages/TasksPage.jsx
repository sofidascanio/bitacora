import { useState } from 'react'
import { useTasks } from '../features/tasks/hooks/useTasks.js'
import { TaskBoard } from '../features/tasks/components/TaskBoard/TaskBoard.jsx'
import { TaskFilters } from '../features/tasks/components/TaskFilters/TaskFilters.jsx'
import { TaskDetail } from '../features/tasks/components/TaskDetail/TaskDetail.jsx'
import { TaskForm } from '../features/tasks/components/TaskForm/TaskForm.jsx'
import { Button } from '../components/common/Button/Button.jsx'
import styles from './TasksPage.module.css'

export function TasksPage() {
    const [filters, setFilters] = useState({})
    const [search, setSearch] = useState('')
    const [selectedTaskId, setSelectedTaskId] = useState(null)
    const [showForm, setShowForm] = useState(false)

    const queryFilters = {
        ...filters,
        search: search || undefined,
        limit: 100,
    }

    const { data, isLoading, isError } = useTasks(queryFilters)

    const tasks = data?.tasks ?? []

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <div className={styles.page} style={{ flex: 1, overflowY: 'auto' }}>
                <header className={styles.header}>
                    <div>
                        <span className={styles.eyebrow}>Tus Tareas</span>
                        <h1 className={styles.title}>Tareas</h1>
                    </div>

                    <div className={styles.headerActions}>
                        <div className={styles.searchWrapper}>
                            <span
                                className="material-symbols-outlined"
                                style={{
                                    color: 'var(--secondary)',
                                    fontSize: 18,
                                }}
                            >
                                search
                            </span>

                            <input
                                className={styles.searchInput}
                                placeholder="Buscar tarea..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <Button onClick={() => setShowForm(true)}>
                            <span
                                className="material-symbols-outlined"
                                style={{ fontSize: 18 }}
                            >
                                add
                            </span>
                            Nueva Tarea
                        </Button>
                    </div>
                </header>

                <div className={styles.filtersRow}>
                    <TaskFilters
                        filters={filters}
                        onChange={setFilters}
                    />
                </div>

                {isLoading && (
                    <div className={styles.state}>
                        Cargando tareas...
                    </div>
                )}

                {isError && (
                    <div className={styles.stateError}>
                        No se pudieron cargar las tareas.
                    </div>
                )}

                {!isLoading && !isError && (
                    <TaskBoard
                        tasks={tasks}
                        onSelectTask={setSelectedTaskId}
                    />
                )}
            </div>

            {selectedTaskId && (
                <TaskDetail
                    taskId={selectedTaskId}
                    onClose={() => setSelectedTaskId(null)}
                />
            )}

            {showForm && (
                <TaskForm
                    onClose={() => setShowForm(false)}
                />
            )}
        </div>
    )
}