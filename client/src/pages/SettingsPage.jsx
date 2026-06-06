import { useState } from 'react'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory,
        useTags, useCreateTag, useUpdateTag, useDeleteTag,
} from '../features/settings/hooks/useSettings.js'
import styles from './SettingsPage.module.css'

const PRESET_COLORS = [
    '#b32822','#ef4444','#f97316','#f59e0b','#22c55e',
    '#10b981','#14b8a6','#3b82f6','#6366f1','#8b5cf6',
    '#ec4899','#6b7280',
]

// linea editable inline
function CategoryRow({ category, onUpdate, onDelete }) {
    const [editing, setEditing] = useState(false)
    const [name, setName] = useState(category.name)
    const [color, setColor] = useState(category.color || '#6b7280')

    function handleSave() {
        if (!name.trim()) return
        onUpdate({ id: category.id, name: name.trim(), color })
        setEditing(false)
    }

    function handleCancel() {
        setName(category.name)
        setColor(category.color || '#6b7280')
        setEditing(false)
    }

    if (editing) {
        return (
            <div className={styles.rowEditing}>
                <div className={styles.colorPicker}>
                    {PRESET_COLORS.map((c) => (
                        <button key={c}
                                type="button"
                                className={`${styles.colorSwatch} ${color === c ? styles.colorSwatchActive : ''}`}
                                style={{ background: c }}
                                onClick={() => setColor(c)}/>
                    ))}
                </div>
                <div className={styles.editRow}>
                    <span className={styles.colorPreview} style={{ background: color }} />
                    <input autoFocus
                        className={styles.editInput}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter')  handleSave()
                            if (e.key === 'Escape') handleCancel()
                        }}/>
                    <button className={styles.saveBtn}   onClick={handleSave}>Guardar</button>
                    <button className={styles.cancelBtn} onClick={handleCancel}>Cancelar</button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.row}>
            <span className={styles.colorDot} style={{ background: category.color || 'var(--secondary)' }} />
            <span className={styles.rowName}>{category.name}</span>
            <span className={styles.rowMeta}>
                {category._count?.tasks ?? 0} tareas · {category._count?.notes ?? 0} notas
            </span>
            <div className={styles.rowActions}>
                <button className={styles.actionBtn} onClick={() => setEditing(true)}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                </button>
                <button className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => onDelete(category.id)}
                        disabled={(category._count?.tasks ?? 0) + (category._count?.notes ?? 0) > 0}
                        title={
                            (category._count?.tasks ?? 0) + (category._count?.notes ?? 0) > 0
                            ? 'No se puede borrar: la categoría esta en uso.'
                            : 'Borrar'
                        }>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                </button>
            </div>
        </div>
    )
}

function TagRow({ tag, onUpdate, onDelete }) {
    const [editing, setEditing] = useState(false)
    const [name, setName] = useState(tag.name)

    function handleSave() {
        if (!name.trim()) return
        onUpdate({ id: tag.id, name: name.trim() })
        setEditing(false)
    }

    if (editing) {
        return (
            <div className={styles.row}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--secondary)' }}>tag</span>
                <input autoFocus
                    className={styles.editInput}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter')  handleSave()
                        if (e.key === 'Escape') { setName(tag.name); setEditing(false) }
                    }}/>
                <button className={styles.saveBtn} onClick={handleSave}>Guardar</button>
                <button className={styles.cancelBtn} onClick={() => { setName(tag.name); setEditing(false) }}>Cancelar</button>
            </div>
        )
    }

    return (
        <div className={styles.row}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--secondary)' }}>tag</span>
            <span className={styles.rowName}>#{tag.name}</span>
            <span className={styles.rowMeta}>
                {tag._count?.tasks ?? 0} tareas · {tag._count?.notes ?? 0} notas
            </span>
            <div className={styles.rowActions}>
                <button className={styles.actionBtn} onClick={() => setEditing(true)}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                </button>
                <button className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => onDelete(tag.id)}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                </button>
            </div>
        </div>
    )
}

// crear form, inline
function NewCategoryForm({ onSubmit, onCancel }) {
    const [name, setName] = useState('')
    const [color, setColor] = useState('#b32822')

    function handleSubmit(e) {
        e.preventDefault()
        if (!name.trim()) return
        onSubmit({ name: name.trim(), color })
        setName('')
        setColor('#b32822')
    }

    return (
        <form onSubmit={handleSubmit} className={styles.newForm}>
            <div className={styles.colorPicker}>
                {PRESET_COLORS.map((c) => (
                    <button key={c}
                            type="button"
                            className={`${styles.colorSwatch} ${color === c ? styles.colorSwatchActive : ''}`}
                            style={{ background: c }}
                            onClick={() => setColor(c)}/>
                ))}
            </div>
            <div className={styles.editRow}>
                <span className={styles.colorPreview} style={{ background: color }} />
                <input autoFocus
                    className={styles.editInput}
                    placeholder="Nombre de la categoría..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}/>
                <button type="submit" className={styles.saveBtn}>Agregar</button>
                <button type="button" className={styles.cancelBtn} onClick={onCancel}>Cancelar</button>
            </div>
        </form>
    )
}

function NewTagForm({ onSubmit, onCancel }) {
    const [name, setName] = useState('')

    function handleSubmit(e) {
        e.preventDefault()
        if (!name.trim()) return
        onSubmit({ name: name.trim() })
        setName('')
    }

    return (
        <form onSubmit={handleSubmit} className={styles.editRow} style={{ padding: '4px 0' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--secondary)' }}>tag</span>
            <input autoFocus
                className={styles.editInput}
                placeholder="nombre-etiqueta (letras, numeros, guiones)"
                value={name}
                onChange={(e) => setName(e.target.value)}/>
            <button type="submit" className={styles.saveBtn}>Agregar</button>
            <button type="button" className={styles.cancelBtn} onClick={onCancel}>Cancelar</button>
        </form>
    )
}

// pagina principal
export function SettingsPage() {
    const [addingCategory, setAddingCategory] = useState(false)
    const [addingTag, setAddingTag] = useState(false)

    const { data: categories = [], isLoading: loadingCats } = useCategories()
    const { data: tags = [], isLoading: loadingTags } = useTags()

    const { mutate: createCategory } = useCreateCategory()
    const { mutate: updateCategory } = useUpdateCategory()
    const { mutate: deleteCategory } = useDeleteCategory()

    const { mutate: createTag } = useCreateTag()
    const { mutate: updateTag } = useUpdateTag()
    const { mutate: deleteTag } = useDeleteTag()

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <span className={styles.eyebrow}>Preferencias</span>
                <h1 className={styles.title}>Ajustes</h1>
            </header>

            <div className={styles.sections}>

                {/* categorias */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <h2 className={styles.sectionTitle}>Categorías</h2>
                            {/* <p className={styles.sectionDesc}>
                                Organiza tus tareas y notas. Cada categoría tiene un nombre y un color.
                            </p> */}
                        </div>
                        {!addingCategory && (
                            <button className={styles.addBtn}
                                    onClick={() => setAddingCategory(true)}>
                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                                Nueva Categoría
                            </button>
                        )}
                    </div>

                    <div className={styles.list}>
                        {addingCategory && (
                            <NewCategoryForm onSubmit={(data) => { createCategory(data); setAddingCategory(false) }}
                                        onCancel={() => setAddingCategory(false)}/>
                        )}

                        {loadingCats && <p className={styles.loading}>Cargando...</p>}

                        {!loadingCats && categories.length === 0 && !addingCategory && (
                            <p className={styles.empty}>
                                No hay categorías. Crea la primera para organizar tus tareas y notas.
                            </p>
                        )}

                        {categories.map((cat) => (
                            <CategoryRow key={cat.id}
                                        category={cat}
                                        onUpdate={(data) => updateCategory(data)}
                                        onDelete={(id) => deleteCategory(id)}/>
                        ))}
                    </div>
                </section>

                {/* tags */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <h2 className={styles.sectionTitle}>Etiquetas</h2>
                            {/* <p className={styles.sectionDesc}>
                                Agrega etiquetas a tus tareas y notas, para mejores busquedas.
                            </p> */}
                        </div>
                        {!addingTag && (
                            <button className={styles.addBtn}
                                    onClick={() => setAddingTag(true)}>
                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                                Nueva Etiqueta
                            </button>
                        )}
                    </div>

                    <div className={styles.list}>
                        {addingTag && (
                            <NewTagForm onSubmit={(data) => { createTag(data); setAddingTag(false) }}
                                        onCancel={() => setAddingTag(false)}/>
                        )}

                        {loadingTags && <p className={styles.loading}>Cargando...</p>}

                        {!loadingTags && tags.length === 0 && !addingTag && (
                            <p className={styles.empty}>
                                No hay etiquetas. Crea la primera para separar y filtrar mejor tus notas.
                            </p>
                        )}

                        {tags.map((tag) => (
                            <TagRow key={tag.id}
                                    tag={tag}
                                    onUpdate={(data) => updateTag(data)}
                                    onDelete={(id) => deleteTag(id)}/>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    )
}