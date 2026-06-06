import { useState } from 'react'
import { useNotes, useCreateNote, useDeleteNote, useCategories, useCreateCategory } from '../features/notes/hooks/useNotes.js'
import { NoteCard } from '../features/notes/components/NoteCard/NoteCard.jsx'
import { NoteEditor } from '../features/notes/components/NoteEditor/NoteEditor.jsx'
import { Button } from '../components/common/Button/Button.jsx'
import styles from './NotesPage.module.css'

export function NotesPage() {
    const [selectedNote, setSelectedNote] = useState(null)
    const [search, setSearch] = useState('')
    const [activeCategoryId, setActiveCategoryId] = useState('')
    const [newCatName, setNewCatName] = useState('')

    const filters = {
        search: search || undefined,
        categoryId: activeCategoryId || undefined,
    }

    const { data, isLoading } = useNotes(filters)
    const { data: categories = [] } = useCategories()
    const { mutate: createNote, isPending: creating } = useCreateNote()
    const { mutate: createCategory } = useCreateCategory()

    const notes = data?.notes ?? []

    function handleCreateNote() {
        createNote(
            { title: 'Nota sin titulo', content: '' },
            { onSuccess: (note) => setSelectedNote(note) }
        )
    }

    return (
        <div className={styles.layout}>
            {/* panel izquierdo: lista */}
            <div className={`${styles.sidebar} ${selectedNote ? styles.hiddenMobile : ''}`}>
                <div className={styles.sidebarHeader}>
                    <h1 className={styles.title}>Notas</h1>
                    <Button size="sm" onClick={handleCreateNote} loading={creating}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                        Agregar
                    </Button>
                </div>

                {/* busqueda */}
                <div className={styles.searchWrapper}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--secondary)' }}>search</span>
                    <input className={styles.searchInput}
                        placeholder="Buscar nota..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}/>
                </div>

                {/* categorias */}
                <div className={styles.categories}>
                    <button className={`${styles.catBtn} ${!activeCategoryId ? styles.catBtnActive : ''}`}
                            onClick={() => setActiveCategoryId('')}>
                        Todas las notas
                        <span className={styles.catCount}>{data?.total ?? 0}</span>
                    </button>

                    {categories.map((cat) => (
                        <button key={cat.id}
                                className={`${styles.catBtn} ${activeCategoryId === cat.id ? styles.catBtnActive : ''}`}
                                onClick={() => setActiveCategoryId(cat.id)}>
                            <span className={styles.catDot} style={{ background: cat.color || 'var(--secondary)' }}/>
                                {cat.name}
                            <span className={styles.catCount}>{cat._count?.notes ?? 0}</span>
                        </button>
                    ))}

                </div>

                {/* lista de notas */}
                <div className={styles.notesList}>
                    {isLoading && <p className={styles.state}>Cargando...</p>}

                    {!isLoading && notes.length === 0 && (
                        <div className={styles.empty}>
                            <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--secondary)', opacity: 0.3 }}>sticky_note_2</span>
                            <p>No hay notas</p>
                            <Button size="sm" onClick={handleCreateNote}>Crea tu primera nota.</Button>
                        </div>
                    )}

                    {notes.map((note) => (
                        <NoteCard key={note.id}
                                note={note}
                                onEdit={setSelectedNote}/>
                    ))}
                </div>
            </div>

            {/* panel derecho: editor */}
            <div className={`${styles.editorPanel} ${!selectedNote ? styles.hiddenMobile : ''}`}>
                {selectedNote ? (
                    <NoteEditor key={selectedNote.id}
                                note={selectedNote}
                                onClose={() => setSelectedNote(null)}/>
                    ) : (
                    <div className={styles.emptyEditor}>
                        <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--secondary)', opacity: 0.2 }}>edit_note</span>
                        <p>Selecciona una nota para editar</p>
                    </div>
                )}
            </div>
        </div>
    )
}