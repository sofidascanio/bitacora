import { useDeleteNote } from '../../hooks/useNotes.js'
import styles from './NoteCard.module.css'

export function NoteCard({ note, onEdit }) {
    const { mutate: deleteNote } = useDeleteNote()

    // extrae el primer parrafo no vacio como preview
    const preview = note.content
        ?.split('\n')
        .find((line) => line.trim().length > 0) || ''

    return (
        <article className={styles.card} onClick={() => onEdit(note)}>
            <header className={styles.header}>
                {note.category && (
                    <span className={styles.category}
                        style={{ '--cat-color': note.category.color || 'var(--secondary)' }}>
                        {note.category.name}
                    </span>
                )}
                <button className={styles.deleteBtn}
                        onClick={(e) => { e.stopPropagation(); deleteNote(note.id) }}
                        title="Delete note">
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                </button>
            </header>

            <h3 className={styles.title}>{note.title}</h3>

            {preview && <p className={styles.preview}>{preview}</p>}

            <footer className={styles.footer}>
                <div className={styles.tags}>
                    {note.tags?.map((tag) => (
                        <span key={tag.id} className={styles.tag}>#{tag.name}</span>
                    ))}
                </div>
                <time className={styles.date}>
                    {formatDate(note.updatedAt)}
                </time>
            </footer>
        </article>
    )
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    })
}