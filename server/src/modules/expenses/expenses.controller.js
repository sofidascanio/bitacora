import { expensesService } from './expenses.service.js'
import { expenseFiltersSchema } from './expenses.schema.js'

export const expensesController = {
    // expenses
    async getExpenses(req, res, next) {
        try {
            const filters = expenseFiltersSchema.parse(req.query)
            const result  = await expensesService.getExpenses({ userId: req.user.id, filters })
            res.json(result)
        } catch (err) { next(err) }
    },

    async getExpense(req, res, next) {
        try {
            const expense = await expensesService.getExpense({
                id: req.params.id, userId: req.user.id,
            })
            res.json(expense)
        } catch (err) { next(err) }
    },

    async createExpense(req, res, next) {
        try {
            const expense = await expensesService.createExpense({
                data: req.body, userId: req.user.id,
            })
            res.status(201).json(expense)
        } catch (err) { next(err) }
    },

    async updateExpense(req, res, next) {
        try {
            const expense = await expensesService.updateExpense({
                id: req.params.id, userId: req.user.id, data: req.body,
            })
            res.json(expense)
        } catch (err) { next(err) }
    },

    async deleteExpense(req, res, next) {
        try {
            await expensesService.deleteExpense({ id: req.params.id, userId: req.user.id })
            res.status(204).send()
        } catch (err) { next(err) }
    },

    async getStats(req, res, next) {
        try {
            const month = parseInt(req.query.month) || new Date().getMonth() + 1
            const year = parseInt(req.query.year)  || new Date().getFullYear()
            const stats = await expensesService.getStats({ userId: req.user.id, month, year })
            res.json(stats)
        } catch (err) { next(err) }
    },

    // categorias 
    async getCategories(req, res, next) {
        try {
            const categories = await expensesService.getCategories()
            res.json(categories)
        } catch (err) { next(err) }
    },

    async createCategory(req, res, next) {
        try {
            const category = await expensesService.createCategory({
                data: req.body, userId: req.user.id,
            })
            res.status(201).json(category)
        } catch (err) { next(err) }
    },

    async updateCategory(req, res, next) {
        try {
            const category = await expensesService.updateCategory({
                id: req.params.id, userId: req.user.id, data: req.body,
            })
            res.json(category)
        } catch (err) { next(err) }
    },

    async deleteCategory(req, res, next) {
        try {
            await expensesService.deleteCategory({ id: req.params.id, userId: req.user.id })
            res.status(204).send()
        } catch (err) { next(err) }
    },

    // presupuestos
    async getBudgets(req, res, next) {
        try {
            const month = parseInt(req.query.month) || new Date().getMonth() + 1
            const year = parseInt(req.query.year)  || new Date().getFullYear()
            const budgets = await expensesService.getBudgets({ userId: req.user.id, month, year })
            res.json(budgets)
        } catch (err) { next(err) }
    },

    async upsertBudget(req, res, next) {
        try {
            const budget = await expensesService.upsertBudget({
                userId: req.user.id, data: req.body,
            })
            res.status(201).json(budget)
        } catch (err) { next(err) }
    },

    async deleteBudget(req, res, next) {
        try {
            await expensesService.deleteBudget({ id: req.params.id, userId: req.user.id })
            res.status(204).send()
        } catch (err) { next(err) }
    },
}