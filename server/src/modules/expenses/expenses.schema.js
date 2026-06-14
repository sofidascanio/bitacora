import { z } from 'zod'

export const createExpenseSchema = z.object({
    amount: z.number().positive('Amount must be positive').multipleOf(0.01),
    description: z.string().max(500).optional().nullable(),
    date: z.string().datetime({ offset: true }).optional(),
    categoryId: z.string().cuid('Invalid category'),
})

export const updateExpenseSchema = createExpenseSchema.partial()

export const expenseFiltersSchema = z.object({
    categoryId: z.string().cuid().optional(),
    month: z.coerce.number().int().min(1).max(12).optional(),
    year: z.coerce.number().int().min(2000).max(2100).optional(),
    search: z.string().max(100).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(30),
    sortBy: z.enum(['date', 'amount', 'createdAt']).default('date'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export const createExpenseCategorySchema = z.object({
    name: z.string().min(1).max(50),
    description: z.string().max(255).optional().nullable(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
    icon: z.string().max(50).optional().nullable(),
})

export const updateExpenseCategorySchema = createExpenseCategorySchema.partial()

export const upsertBudgetSchema = z.object({
    amount: z.number().nonnegative(), // permite 0, rechaza negativos
    month: z.number().int().min(1).max(12),
    year: z.number().int().min(2000).max(2100),
    categoryId: z.string().cuid(),
})