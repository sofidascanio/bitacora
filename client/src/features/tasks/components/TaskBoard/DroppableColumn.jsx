import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableTaskCard } from './SortableTaskCard.jsx'
import styles from './DroppableColumn.module.css'

export function DroppableColumn({ column, tasks, onSelect }) {
    const { setNodeRef, isOver } = useDroppable({ id: column.key })

    const taskIds = tasks.map((t) => t.id)

    return (
        <div className={styles.column}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <span className={`${styles.dot} ${styles[column.key.toLowerCase()]}`} />
                    <span className={styles.label}>{column.label}</span>
                </div>
                <span className={styles.count}>{tasks.length}</span>
            </div>

            <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                <div ref={setNodeRef}
                    className={`${styles.body} ${isOver ? styles.isOver : ''}`}>
                    {tasks.length === 0 && (
                        <div className={styles.empty}>
                            <span className="material-symbols-outlined" style={{ fontSize: 32, opacity: 0.2 }}>
                                inbox
                            </span>
                            <p>Arrastra tus tareas aca.</p>
                        </div>
                    )}
                    {tasks.map((task) => (
                        <SortableTaskCard key={task.id} task={task} onSelect={onSelect} />
                    ))}
                </div>
            </SortableContext>
        </div>
    )
}