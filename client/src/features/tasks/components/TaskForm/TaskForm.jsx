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
    dueDate: '', categoryId: '', tagIds: [],
}

export function TaskForm({ task = null, onClose }) {
    // es edicion real solo si la task tiene id 
    const isEditing = !!task?.id

    const [form, setForm] = useState(() => ({
        ...EMPTY_FORM,
        ...(task && {
            title: task.title ?? '',
            description: task.description ?? '',
            status: task.status ?? EMPTY_FORM.status,
            priority: task.priority ?? EMPTY_FORM.priority,
            dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
            categoryId: task.category?.id ?? '',
            tagIds: task.tags?.map((t) => t.id) ?? [],
        }),
    }))

    const { mutate: createTask, isPending: creating } = useCreateTask()
    const { mutate: updateTask, isPending: updating } = useUpdateTask()
    const isPending = creating || updating

    function handleChange(e) {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    function handleSubmit(e) {
        e.preventDefault()

        const data = {
            ...form,
            dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
            categoryId: form.categoryId || null,
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


                    <Input id="dueDate"
                        name="dueDate"
                        type="date"
                        label="Fecha Limite"
                        value={form.dueDate}
                        onChange={handleChange}/>

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