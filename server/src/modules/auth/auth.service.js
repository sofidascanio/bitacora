import bcrypt from 'bcryptjs'
import { authRepository } from './auth.repository.js'
import { signToken } from '../../utils/jwt.js'
import { ApiError } from '../../utils/ApiError.js'

export const authService = {
    async register({ username, email, password }) {
        // verifica duplicados antes de hashear
        const [existingEmail, existingUsername] = await Promise.all([
            authRepository.findByEmail(email),
            authRepository.findByUsername(username),
        ])

        if (existingEmail) {
            throw ApiError.badRequest('Este email ya esta registrado')
        }
        if (existingUsername) {
            throw ApiError.badRequest('Este nombre de usuario ya esta en uso')
        }

        // bcrypt con cost factor 12
        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await authRepository.create({
            username,
            email,
            password: hashedPassword,
        })

        const token = signToken({ userId: user.id })

        return { user, token }
    },

    async login({ email, password }) {
        // usa findByEmail que devuelve el password findById no lo devuelve)
        const user = await authRepository.findByEmail(email)

        // msj generico
        if (!user) {
            throw ApiError.unauthorized('Credenciales invalidas')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            throw ApiError.unauthorized('Credenciales invalidas')
        }

        // devuelve el usuario sin el password
        const { password: _, ...userWithoutPassword } = user

        const token = signToken({ userId: user.id })

        return { user: userWithoutPassword, token }
    },

    async getMe(userId) {
        const user = await authRepository.findById(userId)

        if (!user) {
            throw ApiError.notFound('No se encontro el usuario')
        }

        return user
    },
}