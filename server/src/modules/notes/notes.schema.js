import { z } from 'zod'

export const createNoteSchema = z.object({
    title: z.string().min(1, 'Necesita un Titulo').max(255),
    content: z.string().max(50000).optional().nullable(),
    categoryId: z.string().cuid().optional().nullable(),
    tagIds: z.array(z.string().cuid()).optional().default([]),
})

export const updateNoteSchema = createNoteSchema.partial()

export const noteFiltersSchema = z.object({
    categoryId: z.string().cuid().optional(),
    search: z.string().max(100).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z.enum(['createdAt', 'updatedAt', 'title']).default('updatedAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
})