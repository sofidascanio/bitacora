import { useState } from 'react'
import { useCreateTask, useUpdateTask } from '../../hooks/useTasks.js'
import { Input } from '../../../../components/common/Input/Input.jsx'
import { Button } from '../../../../components/common/Button/Button.jsx'
import { CategorySelect } from '../../../../components/common/CategorySelect/CategorySelect.jsx'
import { TagSelect } from '../../../../components/common/TagSelect/TagSelect.jsx'
import styles from './TaskForm.module.css'

const EMPTY_FORM = {
    title: '', description: '',
    status: 'TODO', priority: 'MEDIUM',
    date: '', time: '',  
    categoryId: '', tagIds: [],
}

export function TaskForm({ task = null, onClose }) {
    // es edicion real solo si la task tiene id 
    const isEditing = !!task?.id

    const [form, setForm] = useState(
        task
            ? {
                title: task.title,
                description: task.description || '',
                status: task.status,
                priority:task.priority,
                date: toDatePart(task.dueDate),
                time: toTimePart(task.dueDate),
                categoryId: task.category?.id || '',
                tagIds: task.tags?.map((t) => t.id) || [],
            }
            : EMPTY_FORM
    )

    const { mutate: createTask, isPending: creating } = useCreateTask()
    const { mutate: updateTask, isPending: updating } = useUpdateTask()
    const isPending = creating || updating

    function handleChange(e) {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    function handleSubmit(e) {
        e.preventDefault()

        let dueDate = null
        if (form.date) {
            const time = form.time || '00:00'
            dueDate = new Date(`${form.date}T${time}`).toISOString()
        }

        const data = {
            title: form.title,
            description: form.description || null,
            status: form.status,
            priority: form.priority,
            dueDate,
            categoryId: form.categoryId || null,
            tagIds: form.tagIds,
        }

        if (isEditing) {
            updateTask({ id: task.id, ...data }, { onSuccess: onClose })
        } else {
            createTask(data, { onSuccess: onClose })
        }
    }

    return (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className={styles.modal}>
                <header className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
                    </h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </header>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input id="title"
                        name="title"
                        label="Titulo"
                        placeholder="¿Qué tenes que hacer?"
                        value={form.title}
                        onChange={handleChange}
                        required/>

                    <div className={styles.field}>
                        <label className={styles.label}>Descripción</label>
                        <textarea name="description"
                                className={styles.textarea}
                                placeholder="Describi la tarea.."
                                value={form.description}
                                onChange={handleChange}
                                rows={3}/>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Estado</label>
                            <select name="status" className={styles.select} value={form.status} onChange={handleChange}>
                                <option value="TODO"> Pendiente </option>
                                <option value="IN_PROGRESS"> En Progreso </option>
                                <option value="DONE"> Terminada </option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}> Prioridad </label>
                            <select name="priority" className={styles.select} value={form.priority} onChange={handleChange}>
                                <option value="LOW"> Baja </option>
                                <option value="MEDIUM"> Media </option>
                                <option value="HIGH"> Alta </option>
                            </select>
                        </div>
                    </div>

                    {/* categoria */}
                    <div className={styles.field}>
                        <label className={styles.label}>Categoría</label>
                        <CategorySelect value={form.categoryId}
                                        onChange={(val) => setForm((p) => ({ ...p, categoryId: val }))}/>
                    </div>

                    {/* tags */}
                    <div className={styles.field}>
                        <label className={styles.label}>Etiquetas</label>
                        <TagSelect value={form.tagIds}
                                onChange={(val) => setForm((p) => ({ ...p, tagIds: val }))}/>
                    </div>


                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Fecha</label>
                            <input id="date"
                                name="date"
                                type="date"
                                className={styles.ghostInput}
                                value={form.date}
                                onChange={handleChange}/>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Hora (opcional)</label>
                            <input id="time"
                                name="time"
                                type="time"
                                className={styles.ghostInput}
                                value={form.time}
                                onChange={handleChange}
                                disabled={!form.date}/>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
                        <Button type="submit" loading={isPending}>
                            {isEditing ? 'Guardar Cambios' : 'Crear Tarea'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function toDatePart(isoString) {
    if (!isoString) return ''
    const d = new Date(isoString)
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function toTimePart(isoString) {
    if (!isoString) return ''
    const d = new Date(isoString)
    const pad = (n) => String(n).padStart(2, '0')
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}