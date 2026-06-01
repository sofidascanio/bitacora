import { authService } from './auth.service.js'

export const authController = {
    async register(req, res, next) {
        try {
            const { user, token } = await authService.register(req.body)
            res.status(201).json({ user, token })
        } catch (err) {
            next(err)
        }
    },

    async login(req, res, next) {
        try {
            const { user, token } = await authService.login(req.body)
            res.status(200).json({ user, token })
        } catch (err) {
            next(err)
        }
    },

    async getMe(req, res, next) {
        try {
            const user = await authService.getMe(req.user.id)
            res.status(200).json({ user })
        } catch (err) {
            next(err)
        }
    },
}