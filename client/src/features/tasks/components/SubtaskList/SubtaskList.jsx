import { useState } from 'react'
import { useCreateTask, useUpdateTask, useDeleteTask } from '../../hooks/useTasks.js'
import styles from './SubtaskList.module.css'

export function SubtaskList({ parentTask }) {
    const subtasks = parentTask.subtasks ?? []
    const [newTitle, setNewTitle] = useState('')
    const [adding, setAdding] = useState(false)

    const { mutate: createTask, isPending: creating } = useCreateTask()
    const { mutate: updateTask } = useUpdateTask()
    const { mutate: deleteTask } = useDeleteTask()

    function handleAddSubtask(e) {
        e.preventDefault()
        if (!newTitle.trim()) return

        createTask(
            {
                title:    newTitle.trim(),
                parentId: parentTask.id,
                status:   'TODO',
                priority: 'MEDIUM',
            },
            {
                onSuccess: () => {
                    setNewTitle('')
                    setAdding(false)
                },
            }
        )
    }

    function handleToggle(subtask) {
        updateTask({
            id: subtask.id,
            status: subtask.status === 'DONE' ? 'TODO' : 'DONE',
        })
    }

    const completedCount = subtasks.filter((s) => s.status === 'DONE').length
    const progress = subtasks.length > 0
        ? Math.round((completedCount / subtasks.length) * 100)
        : 0

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h4 className={styles.title}>
                    Subtareas
                    <span className={styles.count}>{completedCount}/{subtasks.length}</span>
                </h4>
                {subtasks.length > 0 && (
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                    </div>
                )}
            </div>

            <div className={styles.list}>
                {subtasks.map((subtask) => (
                    <div key={subtask.id} className={styles.item}>
                        <button className={`${styles.checkbox} ${subtask.status === 'DONE' ? styles.checked : ''}`}
                                onClick={() => handleToggle(subtask)}>
                            {subtask.status === 'DONE' && (
                                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>check</span>
                            )}
                        </button>

                        <span className={`${styles.label} ${subtask.status === 'DONE' ? styles.done : ''}`}>
                            {subtask.title}
                        </span>

                        <button className={styles.deleteBtn}
                                onClick={() => deleteTask(subtask.id)}
                                title="Delete subtask">
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                        </button>
                    </div>
                ))}

                {adding ? (
                    <form onSubmit={handleAddSubtask} className={styles.addForm}>
                        <input autoFocus
                            className={styles.addInput}
                            placeholder="Titulo de subtarea..."
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Escape' && setAdding(false)}/>
                        <div className={styles.addActions}>
                            <button type="submit" className={styles.confirmBtn} disabled={creating}>
                                {creating ? '...' : 'Add'}
                            </button>
                            <button type="button" className={styles.cancelBtn} onClick={() => setAdding(false)}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                    ) : (
                    <button className={styles.addBtn} onClick={() => setAdding(true)}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                        Agregar Subtarea
                    </button>
                )}
            </div>
        </div>
    )
}