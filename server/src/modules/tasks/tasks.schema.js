import { z } from 'zod'

export const createTaskSchema = z.object({
    title: z
        .string()
        .min(1, 'Ingresa un titulo')
        .max(255, 'El titulo es demasiado largo'),
    description: z.string().max(2000).optional().nullable(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).default('TODO'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
    dueDate: z.string().datetime({ offset: true }).optional().nullable(),
    parentId: z.string().cuid().optional().nullable(),
    categoryId: z.string().cuid().optional().nullable(),
    tagIds: z.array(z.string().cuid()).optional().default([]),
})

export const updateTaskSchema = createTaskSchema.partial()

export const taskFiltersSchema = z.object({
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    categoryId: z.string().cuid().optional(),
    parentId: z.string().cuid().optional().nullable(),
    search: z.string().max(100).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z.enum(['createdAt', 'dueDate', 'priority', 'order']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
})