import { useDeleteTask, useUpdateTask } from '../../hooks/useTasks.js'
import styles from './TaskCard.module.css'

const PRIORITY_LABELS = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' }

export function TaskCard({ task, onEdit }) {
    const { mutate: deleteTask } = useDeleteTask()
    const { mutate: updateTask } = useUpdateTask()

    function handleToggleDone() {
        updateTask({
            id: task.id,
            status: task.status === 'DONE' ? 'TODO' : 'DONE',
        })
    }

    return (
        <div className={`${styles.card} ${task.status === 'DONE' ? styles.done : ''}`}>
            <div className={styles.header}>
                <button className={`${styles.checkbox} ${task.status === 'DONE' ? styles.checked : ''}`}
                        onClick={handleToggleDone}
                        aria-label="Toggle complete">
                    {task.status === 'DONE' && (
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span>
                    )}
                </button>

                <div className={styles.meta}>
                    {task.dueDate && (
                        <span className={`${styles.dueDate} ${isPastDue(task.dueDate) ? styles.overdue : ''}`}>
                        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>schedule</span>
                            {formatDate(task.dueDate)}
                        </span>
                    )}
                    <span className={`${styles.priority} ${styles[task.priority.toLowerCase()]}`}>
                        {PRIORITY_LABELS[task.priority]}
                    </span>
                </div>
            </div>

            <h3 className={styles.title}>{task.title}</h3>

            {task.description && (
                <p className={styles.description}>{task.description}</p>
            )}

            <div className={styles.footer}>
                <div className={styles.tags}>
                    {task.category && (
                        <span className={styles.category}>{task.category.name}</span>
                    )}
                    {task.tags?.map((tag) => (
                        <span key={tag.id} className={styles.tag}>#{tag.name}</span>
                    ))}
                </div>

                {task._count?.subtasks > 0 && (
                    <span className={styles.subtaskCount}>
                        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>account_tree</span>
                        {task._count.subtasks}
                    </span>
                )}

                <div className={styles.actions}>
                    <button className={styles.actionBtn} onClick={() => onEdit(task)} title="Edit">
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                    </button>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            onClick={() => deleteTask(task.id)}
                            title="Delete">
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

function isPastDue(date) {
    return new Date(date) < new Date()
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}