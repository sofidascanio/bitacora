import { useState, useRef, useEffect } from 'react'
import { useCategories } from '../../../features/settings/hooks/useSettings.js'
import styles from './CategorySelect.module.css'

export function CategorySelect({ value, onChange, placeholder = 'Agrega una categoría' }) {
    const { data: categories = [] } = useCategories()
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    const selected = categories.find((c) => c.id === value) ?? null

    // cerrar cuando hace click afuera
    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className={styles.wrapper} ref={ref}>
            <button type="button"
                    className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
                    onClick={() => setOpen((o) => !o)}>
                {selected ? (
                    <span className={styles.selectedItem}>
                        <span className={styles.colorDot}
                            style={{ background: selected.color || 'var(--secondary)' }}/>
                        {selected.name}
                    </span>
                    ) : (
                    <span className={styles.placeholder}>{placeholder}</span>
                )}
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    {open ? 'expand_less' : 'expand_more'}
                </span>
            </button>

            {open && (
                <div className={styles.dropdown}>
                {/* opcion vacia */}
                <button type="button"
                        className={`${styles.option} ${!value ? styles.optionActive : ''}`}
                        onClick={() => { onChange(''); setOpen(false) }}>
                    <span className={styles.colorDot} style={{ background: 'var(--outline-variant)' }} />
                    <span>Sin categoría</span>
                </button>

                {categories.length === 0 && (
                    <p className={styles.empty}>
                        No hay categorías, crealas en "Ajustes".
                    </p>
                )}

                {categories.map((cat) => (
                    <button key={cat.id}
                            type="button"
                            className={`${styles.option} ${value === cat.id ? styles.optionActive : ''}`}
                            onClick={() => { onChange(cat.id); setOpen(false) }}>
                        <span className={styles.colorDot}
                            style={{ background: cat.color || 'var(--secondary)' }}/>
                        <span>{cat.name}</span>
                        {value === cat.id && (
                            <span className="material-symbols-outlined" style={{ fontSize: 14, marginLeft: 'auto' }}>
                            check
                            </span>
                        )}
                    </button>
                ))}
                </div>
            )}
        </div>
    )
}