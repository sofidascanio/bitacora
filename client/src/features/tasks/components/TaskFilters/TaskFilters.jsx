import { useCategories } from '../../../notes/hooks/useNotes.js'
import styles from './TaskFilters.module.css'

export function TaskFilters({ filters, onChange }) {
    const { data: categories = [] } = useCategories()

    function handleChange(key, value) {
        onChange({ ...filters, [key]: value || undefined })
    }

    function clearAll() {
        onChange({})
    }

    const hasActiveFilters = Object.values(filters).some(
        (v) => v !== undefined && v !== ''
    )

    return (
        <div className={styles.bar}>
            {/* prioridad */}
            <select className={styles.select}
                    value={filters.priority || ''}
                    onChange={(e) => handleChange('priority', e.target.value)}>
                <option value="">All priorities</option>
                <option value="HIGH">Alta</option>
                <option value="MEDIUM">Media</option>
                <option value="LOW">Baja</option>
            </select>

            {/* categoria */}
            <select className={styles.select}
                    value={filters.categoryId || ''}
                    onChange={(e) => handleChange('categoryId', e.target.value)}>
                <option value="">Todas las Categorias</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>

            {/* ordenar por */}
            <select className={styles.select}
                    value={filters.sortBy || 'createdAt'}
                    onChange={(e) => handleChange('sortBy', e.target.value)}>
                <option value="createdAt"> Fecha de Creación </option>
                <option value="dueDate"> Fecha de Vencimiento </option>
                <option value="priority"> Prioridad </option>
            </select>

            {/* orden */}
            <button className={styles.sortBtn}
                    onClick={() =>
                    handleChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')
                    }
                    title="Cambiar orden">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    {filters.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                </span>
            </button>

            {hasActiveFilters && (
                <button className={styles.clearBtn} onClick={clearAll}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                    Limpiar Filtros
                </button>
            )}
        </div>
    )
}