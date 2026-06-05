import { Router } from 'express'
import { expensesController } from './expenses.controller.js'
import { authMiddleware } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import {
    createExpenseSchema,
    updateExpenseSchema,
    createExpenseCategorySchema,
    updateExpenseCategorySchema,
    upsertBudgetSchema,
} from './expenses.schema.js'

const router = Router()
router.use(authMiddleware)

// expenses
router.get('/', expensesController.getExpenses)
router.get('/stats', expensesController.getStats)
router.get('/:id', expensesController.getExpense)
router.post('/', validate(createExpenseSchema), expensesController.createExpense)
router.patch('/:id', validate(updateExpenseSchema), expensesController.updateExpense)
router.delete('/:id', expensesController.deleteExpense)

// categorias
router.get('/categories', expensesController.getCategories)
router.post('/categories', validate(createExpenseCategorySchema), expensesController.createCategory)
router.patch('/categories/:id', validate(updateExpenseCategorySchema), expensesController.updateCategory)
router.delete('/categories/:id', expensesController.deleteCategory)

// presupuestos 
router.get('/budgets', expensesController.getBudgets)
router.post('/budgets', validate(upsertBudgetSchema), expensesController.upsertBudget)
router.delete('/budgets/:id', expensesController.deleteBudget)

export default router