import { prisma } from '../../lib/prisma.js'

export const authRepository = {
    async findByEmail(email) {
        return prisma.user.findUnique({
            where: { email },
        })
    },

    async findByUsername(username) {
        return prisma.user.findUnique({
            where: { username },
        })
    },

    async findById(id) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                email: true,
                avatar: true,
                role: true,
                createdAt: true,
            },
        })
    },

    async create({ username, email, password }) {
        return prisma.user.create({
            data: { username, email, password },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
            },
        })
    },
}