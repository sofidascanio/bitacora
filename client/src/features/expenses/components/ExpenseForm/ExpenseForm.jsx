import { useState, useRef, useEffect } from 'react'
import { useCreateExpense, useUpdateExpense, useExpenseCategories } from '../../hooks/useExpenses.js'
import { Button } from '../../../../components/common/Button/Button.jsx'
import { Input }  from '../../../../components/common/Input/Input.jsx'
import styles from './ExpenseForm.module.css'

const EMPTY = {
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    categoryId:  '',
}

export function ExpenseForm({ expense = null, onClose }) {
    const isEditing = !!expense
    const [form, setForm] = useState(
        expense
        ? {
            amount: expense.amount,
            description: expense.description || '',
            date: expense.date?.split('T')[0] ?? EMPTY.date,
            categoryId: expense.category?.id || '',
            }
        : EMPTY
    )
    const [errors, setErrors] = useState({})

    const { data: categories = [] } = useExpenseCategories()
    const { mutate: create, isPending: creating } = useCreateExpense()
    const { mutate: update, isPending: updating } = useUpdateExpense()
    const isPending = creating || updating

    const [catOpen, setCatOpen] = useState(false)
    const catRef = useRef(null)

    const selectedCategory = categories.find((c) => c.id === form.categoryId) ?? null

    function validate() {
        const e = {}
        if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
            e.amount = 'Ingresa un monto valido.'
        if (!form.categoryId)
            e.categoryId = 'Elegi una categoría.'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    function handleChange(e) {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => ({ ...prev, [name]: undefined }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        if (!validate()) return

        const data = {
            amount: parseFloat(form.amount),
            description: form.description || null,
            date: new Date(form.date).toISOString(),
            categoryId: form.categoryId,
        }

        if (isEditing) {
            update({ id: expense.id, ...data }, { onSuccess: onClose })
        } else {
            create(data, { onSuccess: onClose })
        }
    }

    // cierra al hacer click afuera
    useEffect(() => {
        function handleClickOutside(e) {
            if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className={styles.modal}>
                <header className={styles.header}>
                    <h2 className={styles.title}>{isEditing ? 'Editar Gasto' : 'Agregar Gasto'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </header>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* monto */}
                    <div className={styles.amountWrapper}>
                        <span className={styles.currencySymbol}>$</span>
                        <input name="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={form.amount}
                            onChange={handleChange}
                            className={styles.amountInput}
                            autoFocus/>
                    </div>
                    {errors.amount && <span className={styles.error}>{errors.amount}</span>}

                    {/* categoria */}
                    <div className={styles.field}>
                        <label className={styles.label}>Categoría</label>
                        <div className={styles.categoryDropdown} ref={catRef}>
                            <button type="button"
                                    className={`${styles.catTrigger} ${catOpen ? styles.catTriggerOpen : ''}`}
                                    onClick={() => setCatOpen((o) => !o)}>
                                {selectedCategory ? (
                                        <span className={styles.catSelected}>
                                            <span className={styles.catIconCircle}
                                                style={{ '--cat-color': selectedCategory.color || 'var(--secondary)' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                                                    {selectedCategory.icon || 'category'}
                                                </span>
                                            </span>
                                            {selectedCategory.name}
                                        </span>
                                    ) : (
                                        <span className={styles.catPlaceholder}>Elegi una categoría</span>
                                )}
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                                    {catOpen ? 'expand_less' : 'expand_more'}
                                </span>
                            </button>

                            {catOpen && (
                                <div className={styles.catDropdown}>
                                    {categories.map((cat) => (
                                        <button key={cat.id}
                                                type="button"
                                                className={`${styles.catOption} ${form.categoryId === cat.id ? styles.catOptionActive : ''}`}
                                                onClick={() => {
                                                setForm((p) => ({ ...p, categoryId: cat.id }))
                                                setErrors((p) => ({ ...p, categoryId: undefined }))
                                                setCatOpen(false)}}>
                                            <span className={styles.catIconCircle}
                                                style={{ '--cat-color': cat.color || 'var(--secondary)' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                                                    {cat.icon || 'category'}
                                                </span>
                                            </span>
                                            <span>{cat.name}</span>
                                            {form.categoryId === cat.id && (
                                                <span className="material-symbols-outlined" style={{ fontSize: 14, marginLeft: 'auto' }}>
                                                    check
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {errors.categoryId && <span className={styles.error}>{errors.categoryId}</span>}
                    </div>

                    {/* descripcion */}
                    <Input id="description"
                        name="description"
                        label="Descripción (opcional)"
                        placeholder="¿Para qué fue este gasto?"
                        value={form.description}
                        onChange={handleChange}/>

                    {/* fecha */}
                    <Input id="date"
                        name="date"
                        type="date"
                        label="Fecha"
                        value={form.date}
                        onChange={handleChange}/>

                    <div className={styles.actions}>
                        <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" loading={isPending}>
                            {isEditing ? 'Guardar Cambios' : 'Agregar Gasto'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}