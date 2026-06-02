import { z } from 'zod'

export const createCategorySchema = z.object({
    name: z.string().min(1).max(50),
    description: z.string().max(255).optional().nullable(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Debe ser un color hex valido').optional().nullable(),
})

export const updateCategorySchema = createCategorySchema.partial()