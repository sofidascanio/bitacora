import { useRef } from 'react'
import { useTask, useUpdateTask, useDeleteTask } from '../../hooks/useTasks.js'
import { useCategories } from '../../../notes/hooks/useNotes.js'
import { SubtaskList } from '../SubtaskList/SubtaskList.jsx'
import { TagSelect } from '../../../../components/common/TagSelect/TagSelect.jsx'
import styles from './TaskDetail.module.css'

const PRIORITY_OPTIONS = {
    LOW: 'Baja',
    MEDIUM: 'Media',
    HIGH: 'Alta',
}

const STATUS_OPTIONS = {
    TODO: 'Pendiente',
    IN_PROGRESS: 'En Progreso',
    DONE: 'Terminada',
}

export function TaskDetail({ taskId, onClose }) {
    const { data: task, isLoading } = useTask(taskId)
    const { data: categories = [] } = useCategories()
    const { mutate: updateTask } = useUpdateTask()
    const { mutate: deleteTask } = useDeleteTask()

    // refs para titulo y descripción, sin estado local, se guardan con onBlur
    const titleRef = useRef(null)
    const descRef = useRef(null)

    function handleField(field, value) {
        updateTask({ id: task.id, [field]: value })
    }

    function handleTitleBlur() {
        const val = titleRef.current?.value?.trim()
        if (val && val !== task.title) {
            handleField('title', val)
        }
    }

    function handleDescBlur() {
        const val = descRef.current?.value ?? ''
        if (val !== (task.description ?? '')) {
            handleField('description', val || null)
        }
    }

    function handleDelete() {
        deleteTask(task.id)
        onClose()
    }

    if (isLoading) {
        return (
            <div className={styles.panel}>
                <div className={styles.loading}>Cargando...</div>
            </div>
        )
    }

    if (!task) return null

    return (
        <div className={styles.panel}>
            <header className={styles.header}>
                <div className={styles.headerActions}>
                    <button className={`${styles.statusToggle} ${task.status === 'DONE' ? styles.completed : ''}`}
                            onClick={() => handleField('status', task.status === 'DONE' ? 'TODO' : 'DONE')} >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                            {task.status === 'DONE' ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                        {task.status === 'DONE' ? 'Completada' : 'Marcar como hecha'}
                    </button>

                    <div className={styles.rightActions}>
                        <button className={styles.iconBtn} onClick={handleDelete} title="Eliminar tarea">
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                        </button>
                        <button className={styles.iconBtn} onClick={onClose} title="Cerrar">
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className={styles.body}>
                {/* titulo y descripcion usan defaultValue + ref + onBlur
                    la key incluye updatedAt para que react re-monte el elemento 
                    con el valor fresco de cache en cada update del servidor */}
                <textarea ref={titleRef}
                        key={`title-${task.id}-${task.updatedAt}`}
                        className={`${styles.titleInput} ${task.status === 'DONE' ? styles.titleDone : ''}`}
                        defaultValue={task.title}
                        onBlur={handleTitleBlur}
                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                        rows={1}
                        onInput={(e) => {
                            e.target.style.height = 'auto'
                            e.target.style.height = e.target.scrollHeight + 'px'
                        }}/>

                <textarea ref={descRef}
                        key={`desc-${task.id}-${task.updatedAt}`}
                        className={styles.descInput}
                        defaultValue={task.description ?? ''}
                        onBlur={handleDescBlur}
                        placeholder="Agregar descripción..."
                        rows={3}/>

                {/* los selects leen directo del cache via task.X 
                    se actualizan solos cuando rq re-renderiza
                    la dueDate tambien usa defaultValue + key pq es un input no controlado */}
                <div className={styles.properties}>
                    <div className={styles.property}>
                        <span className={styles.propLabel}>Estado</span>
                        <select
                            className={styles.propSelect}
                            value={task.status}
                            onChange={(e) => handleField('status', e.target.value)}
                        >
                            {Object.entries(STATUS_OPTIONS).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.property}>
                        <span className={styles.propLabel}>Prioridad</span>
                        <select
                            className={styles.propSelect}
                            value={task.priority}
                            onChange={(e) => handleField('priority', e.target.value)}
                        >
                            {Object.entries(PRIORITY_OPTIONS).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.property}>
                        <span className={styles.propLabel}>Vencimiento</span>
                        <input
                            key={`date-${task.id}-${task.updatedAt}`}
                            type="date"
                            className={styles.propInput}
                            defaultValue={task.dueDate ? task.dueDate.split('T')[0] : ''}
                            onBlur={(e) =>
                                handleField(
                                    'dueDate',
                                    e.target.value
                                        ? new Date(e.target.value).toISOString()
                                        : null
                                )
                            }
                        />
                    </div>

                    <div className={styles.property}>
                        <span className={styles.propLabel}>Categoría</span>
                        <select
                            className={styles.propSelect}
                            value={task.category?.id || ''}
                            onChange={(e) => handleField('categoryId', e.target.value || null)}
                        >
                            <option value="">Sin categoría</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={`${styles.property} ${styles.propertyTags}`}>
                        <span className={styles.propLabel}>Tags</span>
                        <div className={styles.propTagsWrapper}>
                            <TagSelect
                                value={task.tags?.map((t) => t.id) ?? []}
                                onChange={(tagIds) => updateTask({ id: task.id, tagIds })}
                            />
                        </div>
                    </div>

                    <div className={styles.property}>
                        <span className={styles.propLabel}>Creada</span>
                        <span className={styles.propValue}>{formatDate(task.createdAt)}</span>
                    </div>
                </div>

                <SubtaskList parentTask={task} />
            </div>
        </div>
    )
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('es-ES', {
        month: 'short', day: 'numeric', year: 'numeric',
    })
}