import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'
import { prisma } from '../lib/prisma.js'

export async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader?.startsWith('Bearer ')) {
            throw ApiError.unauthorized('No token provided')
        }

        const token = authHeader.split(' ')[1]

        let decoded
        try {
            decoded = jwt.verify(token, env.JWT_SECRET)
        } catch {
            throw ApiError.unauthorized('Invalid or expired token')
        }

        // verifica que el usuario todavia exista en la bd
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, username: true, role: true },
        })

        if (!user) {
            throw ApiError.unauthorized('User not found')
        }

        req.user = user
        next()
    } catch (err) {
        next(err)
    }
}