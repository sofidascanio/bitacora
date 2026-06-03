import { useTask, useUpdateTask, useDeleteTask } from '../../hooks/useTasks.js'
import { useCategories } from '../../../notes/hooks/useNotes.js'
import { SubtaskList } from '../SubtaskList/SubtaskList.jsx'
import styles from './TaskDetail.module.css'

const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH']
const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'DONE']

export function TaskDetail({ taskId, onClose }) {
    const { data: task, isLoading } = useTask(taskId)
    const { data: categories = [] } = useCategories()
    const { mutate: updateTask } = useUpdateTask()
    const { mutate: deleteTask } = useDeleteTask()

    if (isLoading) {
        return (
            <div className={styles.panel}>
                <div className={styles.loading}>Cargando...</div>
            </div>
        )
    }

    if (!task) return null

    function handleField(field, value) {
        updateTask({ id: task.id, [field]: value })
    }

    function handleDelete() {
        deleteTask(task.id)
        onClose()
    }

    return (
        <div className={styles.panel}>
            <header className={styles.header}>
                <div className={styles.headerActions}>
                    <button className={`${styles.statusToggle} ${task.status === 'DONE' ? styles.completed : ''}`}
                            onClick={() => handleField('status', task.status === 'DONE' ? 'TODO' : 'DONE')}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                            {task.status === 'DONE' ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                        {task.status === 'DONE' ? 'Completed' : 'Mark complete'}
                    </button>

                    <div className={styles.rightActions}>
                        <button className={styles.iconBtn} onClick={handleDelete} title="Delete task">
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                        </button>
                        <button className={styles.iconBtn} onClick={onClose} title="Close">
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className={styles.body}>
                {/* titulo editable */}
                <textarea className={`${styles.titleInput} ${task.status === 'DONE' ? styles.titleDone : ''}`}
                        defaultValue={task.title}
                        onBlur={(e) => {
                            if (e.target.value !== task.title) handleField('title', e.target.value)
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                        rows={1}
                        onInput={(e) => {
                            e.target.style.height = 'auto'
                            e.target.style.height = e.target.scrollHeight + 'px'
                        }}/>

                {/* descripcion editable */}
                <textarea className={styles.descInput}
                        defaultValue={task.description || ''}
                        placeholder="Agregar una descripción..."
                        onBlur={(e) => {
                            if (e.target.value !== (task.description || '')) {
                            handleField('description', e.target.value || null)
                            }
                        }}
                        rows={3}/>

                {/* propiedades */}
                <div className={styles.properties}>
                    <div className={styles.property}>
                        <span className={styles.propLabel}>Estado</span>
                        <select className={styles.propSelect}
                                value={task.status}
                                onChange={(e) => handleField('status', e.target.value)}>
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>{s.replace('_', ' ')}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.property}>
                        <span className={styles.propLabel}>Priority</span>
                        <select className={styles.propSelect}
                                value={task.priority}
                                onChange={(e) => handleField('priority', e.target.value)}>
                            {PRIORITY_OPTIONS.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.property}>
                        <span className={styles.propLabel}>Fecha de Vencimiento</span>
                        <input type="date"
                            className={styles.propInput}
                            defaultValue={task.dueDate ? task.dueDate.split('T')[0] : ''}
                            onBlur={(e) =>
                                handleField('dueDate', e.target.value ? new Date(e.target.value).toISOString() : null)
                            }/>
                    </div>

                    <div className={styles.property}>
                        <span className={styles.propLabel}>Categoria</span>
                        <select className={styles.propSelect}
                                value={task.category?.id || ''}
                                onChange={(e) => handleField('categoryId', e.target.value || null)}>
                            <option value="">Ninguna</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.property}>
                        <span className={styles.propLabel}>Creado:</span>
                        <span className={styles.propValue}>{formatDate(task.createdAt)}</span>
                    </div>
                </div>

                {/* subtareas */}
                <SubtaskList parentTask={task} />
            </div>
        </div>
    )
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    })
}