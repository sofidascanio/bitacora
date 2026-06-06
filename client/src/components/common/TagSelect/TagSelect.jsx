import { useState, useRef, useEffect } from 'react'
import { useTags } from '../../../features/settings/hooks/useSettings.js'
import styles from './TagSelect.module.css'

export function TagSelect({ value = [], onChange }) {
    const { data: tags = [] } = useTags()
    const [open,  setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const ref = useRef(null)

    const filtered = tags.filter(
        (t) => t.name.toLowerCase().includes(query.toLowerCase()) && !value.includes(t.id)
    )
    const selectedTags = tags.filter((t) => value.includes(t.id))

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
                setQuery('')
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    function addTag(tagId) {
        onChange([...value, tagId])
    }

    function removeTag(tagId) {
        onChange(value.filter((id) => id !== tagId))
    }

    return (
        <div className={styles.wrapper} ref={ref}>
            {/* chips de tags seleccionados */}
            <div className={`${styles.inputArea} ${open ? styles.inputAreaOpen : ''}`}
                onClick={() => setOpen(true)}>
                {selectedTags.map((tag) => (
                    <span key={tag.id} className={styles.chip}>
                        #{tag.name}
                        <button type="button"
                                className={styles.chipRemove}
                                onClick={(e) => { e.stopPropagation(); removeTag(tag.id) }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 12 }}>close</span>
                        </button>
                    </span>
                ))}

                <input className={styles.searchInput}
                    placeholder={selectedTags.length === 0 ? 'Agrega etiquetas...' : ''}
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
                    onFocus={() => setOpen(true)}/>
            </div>

            {/* dropdown */}
            {open && (
                <div className={styles.dropdown}>
                    {filtered.length === 0 && query === '' && tags.length === 0 && (
                        <p className={styles.empty}>No hay etiquetas, crealas en "Ajustes"</p>
                    )}
                    {filtered.length === 0 && query !== '' && (
                        <p className={styles.empty}>No hay etiquetas con: "{query}".</p>
                    )}
                    {filtered.map((tag) => (
                        <button key={tag.id}
                                type="button"
                                className={styles.option}
                                onClick={() => { addTag(tag.id); setQuery(''); }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>tag</span>
                            #{tag.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}