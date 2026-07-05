import { ZodError } from 'zod'
import { ApiError } from '../utils/ApiError.js'

export function validate(schema) {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body)
            next()
        } catch (err) {
            if (err instanceof ZodError) {
                const errors = err.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }))
                return next(ApiError.badRequest('Error de validación', errors))
            }
            next(err)
        }
    }
}