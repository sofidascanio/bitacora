import { z } from 'zod'

export const createTagSchema = z.object({
    name: z
        .string()
        .min(1, 'Ingrese un nombre')
        .max(30, 'El nombre es muy largo')
        .regex(/^[a-zA-Z0-9_\-]+$/, 'Solo letras, numeros y guiones.'),
})

export const updateTagSchema = createTagSchema.partial()