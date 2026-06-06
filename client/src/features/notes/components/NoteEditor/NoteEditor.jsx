import { useState, useEffect, useRef } from 'react'
import { useUpdateNote, useCategories } from '../../hooks/useNotes.js'
import { Button } from '../../../../components/common/Button/Button.jsx'
import { CategorySelect } from '../../../../components/common/CategorySelect/CategorySelect.jsx'
import { TagSelect } from '../../../../components/common/TagSelect/TagSelect.jsx'
import styles from './NoteEditor.module.css'

export function NoteEditor({ note, onClose }) {
    const [title, setTitle] = useState(note.title)
    const [content, setContent] = useState(note.content || '')
    const [isDirty, setIsDirty] = useState(false)

    const { mutate: updateNote, isPending } = useUpdateNote()
    const { data: categories = [] } = useCategories()

    const saveTimer = useRef(null)

    // autosave con debounce de 800ms
    useEffect(() => {
        if (!isDirty) return
        clearTimeout(saveTimer.current)
        saveTimer.current = setTimeout(() => {
            updateNote({ id: note.id, title, content })
            setIsDirty(false)
        }, 800)
        return () => clearTimeout(saveTimer.current)
    }, [title, content, isDirty])

    function handleTitleChange(e) {
        setTitle(e.target.value)
        setIsDirty(true)
    }

    function handleContentChange(e) {
        setContent(e.target.value)
        setIsDirty(true)
    }

    function handleCategoryChange(e) {
        updateNote({ id: note.id, categoryId: e.target.value || null })
    }

    function handleSaveNow() {
        clearTimeout(saveTimer.current)
        updateNote({ id: note.id, title, content })
        setIsDirty(false)
    }

    return (
        <div className={styles.editor}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <CategorySelect value={note.category?.id || ''}
                                    onChange={(val) => updateNote({ id: note.id, categoryId: val || null })}/>
                    <TagSelect value={note.tags?.map((t) => t.id) || []}
                            onChange={(tagIds) => updateNote({ id: note.id, tagIds })}/>
                    <span className={styles.saveStatus}>
                        {isPending ? 'Guardando...' : isDirty ? 'Sin guardar' : 'Guardado'}
                    </span>
                </div>
                <div className={styles.headerRight}>
                    <Button variant="ghost" size="sm" onClick={handleSaveNow} disabled={!isDirty}>
                        Guardar
                    </Button>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            </header>

            <div className={styles.body}>
                <textarea className={styles.titleInput}
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Titulo de la nota..."
                        rows={1}
                        onInput={(e) => {
                            // auto-resize
                            e.target.style.height = 'auto'
                            e.target.style.height = e.target.scrollHeight + 'px'
                        }}/>

                <textarea className={styles.contentInput}
                        value={content}
                        onChange={handleContentChange}
                        placeholder="Escribi tu nota..."/>
            </div>

            <footer className={styles.footer}>
                <span className={styles.meta}>
                    Ultima Edición: {formatDate(note.updatedAt)}
                </span>
                <span className={styles.wordCount}>
                    {content.trim() ? content.trim().split(/\s+/).length : 0} palabras
                </span>
            </footer>
        </div>
    )
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
}