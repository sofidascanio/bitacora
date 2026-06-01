import { z } from 'zod'

export const registerSchema = z.object({
    username: z
        .string()
        .min(3, 'Minimo 3 caracteres')
        .max(30, 'Maximo 30 caracteres')
        .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, numeros o guiones bajos'),
    email: z
        .string()
        .email('Email invalido'),
    password: z
        .string()
        .min(8, 'Al menos 8 caracteres')
        .max(100, 'Muy larga'),
})

export const loginSchema = z.object({
    email: z.string().email('Email invalido'),
    password: z.string().min(1, 'Ingresa la contraseña'),
})