import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'

export function errorMiddleware(err, req, res, next) {
    // error Prisma: registro no encontrado
    if (err.code === 'P2025') {
        return res.status(404).json({ message: 'Resource not found' })
    }

    // error Prisma: violacion de constraint unico
    if (err.code === 'P2002') {
        const field = err.meta?.target?.[0] || 'field'
        return res.status(409).json({ message: `${field} already exists` })
    }

    // error operacional conocido
    if (err instanceof ApiError && err.isOperational) {
        return res.status(err.statusCode).json({
            message: err.message,
            errors: err.errors.length > 0 ? err.errors : undefined,
        })
    }

    // error inesperado
    console.error('Unexpected error:', err)

    return res.status(500).json({
        message: 'Internal server error',
        ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    })
}