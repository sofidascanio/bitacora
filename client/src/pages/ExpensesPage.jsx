import { useState } from 'react'
import { useExpenses, useExpenseStats, useExpenseCategories,
        useDeleteExpense, useUpsertBudget, useCreateExpenseCategory,
} from '../features/expenses/hooks/useExpenses.js'
import { ExpenseForm } from '../features/expenses/components/ExpenseForm/ExpenseForm.jsx'
import { Button } from '../components/common/Button/Button.jsx'
import styles from './ExpensesPage.module.css'

const MONTH_NAMES = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]

// categorias predeterminadas
const DEFAULT_CATEGORIES = [
    { name: 'Comida', color: '#ef4444', icon: 'restaurant' },
    { name: 'Transporte', color: '#f97316', icon: 'directions_car' },
    { name: 'Hogar', color: '#8b5cf6', icon: 'home' },
    { name: 'Salud', color: '#10b981', icon: 'favorite' },
    { name: 'Entretenimiento', color: '#3b82f6', icon: 'sports_esports' },
    { name: 'Compras', color: '#ec4899', icon: 'shopping_bag' },
    { name: 'Educación', color: '#6366f1', icon: 'school' },
    { name: 'Otros', color: '#6b7280', icon: 'more_horiz' },
]

export function ExpensesPage() {
    const now = new Date()
    const [month, setMonth] = useState(now.getMonth() + 1)
    const [year, setYear] = useState(now.getFullYear())
    const [showForm, setShowForm] = useState(false)
    const [editExpense, setEditExpense] = useState(null)
    const [activeTab,  setActiveTab] = useState('list') // 'list' | 'stats' | 'budgets'

    const params = { month, year }

    const { data: expenseData, isLoading } = useExpenses({ ...params, limit: 50 })
    const { data: stats } = useExpenseStats(params)
    const { data: categories = [] } = useExpenseCategories()

    const { mutate: deleteExpense } = useDeleteExpense()
    const { mutate: upsertBudget } = useUpsertBudget()
    const { mutate: createCategory } = useCreateExpenseCategory()

    const expenses = expenseData?.expenses ?? []

    function handlePrevMonth() {
        if (month === 1) { setMonth(12); setYear((y) => y - 1) }
        else setMonth((m) => m - 1)
    }

    function handleNextMonth() {
        if (month === 12) { setMonth(1); setYear((y) => y + 1) }
        else setMonth((m) => m + 1)
    }

    function seedCategories() {
        DEFAULT_CATEGORIES.forEach((cat) => createCategory(cat))
    }

    function handleBudgetChange(categoryId, value) {
        if (!value || isNaN(value)) return
        upsertBudget({ categoryId, amount: parseFloat(value), month, year })
    }

    const fmt = (n) => new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD', minimumFractionDigits: 2,
    }).format(n)

    return (
        <div className={styles.page}>
            {/* header */}
            <header className={styles.header}>
                <div>
                    <span className={styles.eyebrow}>Economia Personal</span>
                    <h1 className={styles.title}>Gastos</h1>
                </div>
                <div className={styles.headerRight}>
                    {/* navegacion de mes */}
                    <div className={styles.monthNav}>
                        <button className={styles.monthBtn} onClick={handlePrevMonth}>
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <span className={styles.monthLabel}>
                            {MONTH_NAMES[month - 1]} {year}
                        </span>
                        <button className={styles.monthBtn} onClick={handleNextMonth}>
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                    <Button onClick={() => setShowForm(true)}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                        Agregar Gasto
                    </Button>
                </div>
            </header>

            {/* total del mes, siempre visible */}
            <div className={styles.totalCard}>
                <div className={styles.totalLeft}>
                    <span className={styles.totalLabel}>Total del mes</span>
                    <span className={styles.totalAmount}>{fmt(stats?.total ?? 0)}</span>
                    <span className={styles.totalSub}>{stats?.count ?? 0} gastos</span>
                </div>
                {stats?.byCategory?.some((r) => r.overBudget) && (
                    <div className={styles.overBudgetAlert}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>warning</span>
                        Te pasaste del presupuesto en {stats.byCategory.filter((r) => r.overBudget).length} categor{stats.byCategory.filter((r) => r.overBudget).length === 1 ? 'y' : 'ies'}
                    </div>
                )}
            </div>

            {/* tabs */}
            <div className={styles.tabs}>
                {['Listado', 'Estadisticas', 'Presupuesto'].map((tab) => (
                    <button key={tab}
                            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab(tab)}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* tab: lista */}
            {activeTab === 'Listado' && (
                <div className={styles.content}>
                    {categories.length === 0 && (
                        <div className={styles.seedPrompt}>
                            <p>No hay categorías.</p>
                            <Button variant="secondary" size="sm" onClick={seedCategories}>
                                Crear categorías por defecto.
                            </Button>
                        </div>
                    )}

                    {isLoading && <p className={styles.state}>Cargando...</p>}

                    {!isLoading && expenses.length === 0 && (
                        <div className={styles.empty}>
                            <span className="material-symbols-outlined" style={{ fontSize: 40, opacity: 0.2 }}>
                                receipt_long
                            </span>
                            <p>No tenes gastos en este mes.</p>
                            <Button size="sm" onClick={() => setShowForm(true)}>
                                Agrega tu primer gasto.
                            </Button>
                        </div>
                    )}

                    <div className={styles.expenseList}>
                        {expenses.map((expense) => (
                            <div key={expense.id} className={styles.expenseRow}>
                                {/* icono de categoria */}
                                <div className={styles.expenseIcon}
                                    style={{ '--cat-color': expense.category?.color || 'var(--secondary)' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                                        {expense.category?.icon || 'receipt'}
                                    </span>
                                </div>

                                {/* datos */}
                                <div className={styles.expenseInfo}>
                                    <span className={styles.expenseDesc}>
                                        {expense.description || expense.category?.name || 'Expense'}
                                    </span>
                                    <span className={styles.expenseMeta}>
                                        {expense.category?.name} · {formatDate(expense.date)}
                                    </span>
                                </div>

                                {/* monto */}
                                <span className={styles.expenseAmount}>{fmt(expense.amount)}</span>

                                {/* acciones */}
                                <div className={styles.expenseActions}>
                                    <button className={styles.actionBtn}
                                            onClick={() => { setEditExpense(expense); setShowForm(true) }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                                    </button>
                                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                            onClick={() => deleteExpense(expense.id)}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* tab: estadisticas */}
            {activeTab === 'Estadisticas' && (
                <div className={styles.content}>
                    {/* por categoria */}
                    <div className={styles.statsSection}>
                    <h3 className={styles.sectionTitle}>Por categoría</h3>
                    <div className={styles.categoryStats}>
                        {(stats?.byCategory ?? []).map(({ category, total, count, budget, pct, overBudget }) => (
                            <div key={category?.id} className={styles.statRow}>
                                <div className={styles.statRowLeft}>
                                    <div className={styles.statIcon} style={{ '--cat-color': category?.color || 'var(--secondary)' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                                            {category?.icon || 'category'}
                                        </span>
                                    </div>
                                    <div className={styles.statInfo}>
                                        <span className={styles.statName}>{category?.name}</span>
                                        <span className={styles.statCount}>{count} expense{count !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>

                                <div className={styles.statRowRight}>
                                    <span className={`${styles.statAmount} ${overBudget ? styles.overBudget : ''}`}>
                                        {fmt(total)}
                                    </span>
                                    {budget && (
                                        <span className={styles.statBudget}>of {fmt(budget)}</span>
                                    )}
                                </div>

                                {/* barra de progreso contra presupuesto */}
                                {budget && (
                                    <div className={styles.statBar}>
                                        <div className={`${styles.statBarFill} ${overBudget ? styles.statBarOver : ''}`}
                                            style={{ width: `${Math.min(pct, 100)}%` }}/>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* tendencia mensual */}
                {stats?.monthlyTrend?.length > 0 && (
                    <div className={styles.statsSection}>
                        <h3 className={styles.sectionTitle}>Tendencia Mensual</h3>
                        <div className={styles.trend}>
                            {stats.monthlyTrend.map((row) => {
                                const maxTotal = Math.max(...stats.monthlyTrend.map((r) => r.total))
                                const height = maxTotal > 0 ? (row.total / maxTotal) * 100 : 0
                                return (
                                    <div key={row.month} className={styles.trendBar}>
                                        <span className={styles.trendAmount}>{fmt(row.total)}</span>
                                        <div className={styles.trendBarWrapper}>
                                            <div className={styles.trendBarFill} style={{ height: `${height}%` }}/>
                                        </div>
                                        <span className={styles.trendLabel}>
                                            {new Date(row.month).toLocaleDateString('en-US', { month: 'short' })}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
                </div>
            )}

            {/* tab: presupuestos */}
            {activeTab === 'Presupuesto' && (
                <div className={styles.content}>
                    <p className={styles.budgetHint}>
                        Crea presupuestos por categoría para ver tu progreso en Estadisticas.
                    </p>
                    <div className={styles.budgetList}>
                        {categories.map((cat) => {
                            const catStat = stats?.byCategory?.find((r) => r.category?.id === cat.id)
                            return (
                                <div key={cat.id} className={styles.budgetRow}>
                                    <div className={styles.budgetIcon}
                                        style={{ '--cat-color': cat.color || 'var(--secondary)' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                                            {cat.icon || 'category'}
                                        </span>
                                    </div>
                                    <span className={styles.budgetCatName}>{cat.name}</span>
                                    {catStat && (
                                        <span className={styles.budgetSpent}>{fmt(catStat.total)} gastado.</span>
                                    )}
                                    <div className={styles.budgetInputWrapper}>
                                        <span className={styles.budgetCurrency}>$</span>
                                        <input type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="Sin limite"
                                            defaultValue={catStat?.budget ?? ''}
                                            className={styles.budgetInput}
                                            onBlur={(e) => handleBudgetChange(cat.id, e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}/>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {showForm && (
                <ExpenseForm expense={editExpense}
                            onClose={() => { setShowForm(false); setEditExpense(null) }}/>
            )}
        </div>
    )
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric',
    })
}