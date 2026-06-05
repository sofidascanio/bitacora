import { expensesRepository } from './expenses.repository.js'
import { ApiError } from '../../utils/ApiError.js'

export const expensesService = {
    // expenses
    async getExpenses({ userId, filters }) {
        const result = await expensesRepository.findMany({ userId, filters })
        return {
            ...result,
            expenses: result.expenses.map(normalizeAmount),
            totalPages: Math.ceil(result.total / result.limit),
        }
    },

    async getExpense({ id, userId }) {
        const expense = await expensesRepository.findById({ id, userId })
        if (!expense) throw ApiError.notFound('No se encontro el gasto.')
        return normalizeAmount(expense)
    },

    async createExpense({ data, userId }) {
        // verifica que la categoria pertenece al usuario
        const category = await expensesRepository.findCategoryById({
            id: data.categoryId, userId,
        })
        if (!category) throw ApiError.notFound('No se encontro la categoría.')

        const expense = await expensesRepository.create({ data, userId })
        return normalizeAmount(expense)
    },

    async updateExpense({ id, userId, data }) {
        const existing = await expensesRepository.findById({ id, userId })
        if (!existing) throw ApiError.notFound('No se encontro el gasto.')

        if (data.categoryId) {
            const category = await expensesRepository.findCategoryById({
                id: data.categoryId, userId,
            })
            if (!category) throw ApiError.notFound('No se encontro la categoría.')
        }

        const expense = await expensesRepository.update({ id, userId, data })
        return normalizeAmount(expense)
    },

    async deleteExpense({ id, userId }) {
        const existing = await expensesRepository.findById({ id, userId })
        if (!existing) throw ApiError.notFound('No se encontro el gasto.')
        await expensesRepository.delete({ id, userId })
    },

    async getStats({ userId, month, year }) {
        const stats = await expensesRepository.getMonthlyStats({ userId, month, year })

        // trae presupuestos del mes para calcular % de uso
        const budgets = await expensesRepository.findBudgets({ userId, month, year })
        const budgetMap = Object.fromEntries(
            budgets.map((b) => [b.categoryId, Number(b.amount)])
        )

        return {
            ...stats,
            byCategory: stats.byCategory.map((row) => ({
                ...row,
                budget:  budgetMap[row.category?.id] ?? null,
                // porcentaje usado del presupuesto
                pct: budgetMap[row.category?.id]
                    ? Math.round((row.total / budgetMap[row.category.id]) * 100)
                    : null,
                overBudget: budgetMap[row.category?.id]
                    ? row.total > budgetMap[row.category.id]
                    : false,
            })),
        }
    },

    // categorias
    async getCategories(userId) {
        return expensesRepository.findAllCategories(userId)
    },

    async createCategory({ data, userId }) {
        return expensesRepository.createCategory({ data, userId })
    },

    async updateCategory({ id, userId, data }) {
        const existing = await expensesRepository.findCategoryById({ id, userId })
        if (!existing) throw ApiError.notFound('No se encontro la categoría.')
        return expensesRepository.updateCategory({ id, userId, data })
    },

    async deleteCategory({ id, userId }) {
        const existing = await expensesRepository.findCategoryById({ id, userId })
        if (!existing) throw ApiError.notFound('No se encontro la categoría.')
        return expensesRepository.deleteCategory({ id, userId })
    },

    // presupuestos
    async getBudgets({ userId, month, year }) {
        return expensesRepository.findBudgets({ userId, month, year })
    },

    async upsertBudget({ userId, data }) {
        return expensesRepository.upsertBudget({ userId, ...data })
    },

    async deleteBudget({ id, userId }) {
        return expensesRepository.deleteBudget({ id, userId })
    },
}

// convierte decimal a numero, prisma lo devuelve como string en json
function normalizeAmount(expense) {
    return { ...expense, amount: Number(expense.amount) }
}