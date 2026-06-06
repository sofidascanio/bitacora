import { ApiError } from '../utils/ApiError.js'

export function requireAdmin(req, res, next) {
    if (req.user?.role !== 'ADMIN') {
        return next(ApiError.forbidden('Acceso de Administrador Requerido'))
    }
    next()
}