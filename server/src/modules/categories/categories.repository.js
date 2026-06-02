import { prisma } from '../../lib/prisma.js'

export const categoriesRepository = {
    async findAll(userId) {
        return prisma.category.findMany({
            where: { userId },
            orderBy: { name: 'asc' },
            include: {
                _count: { select: { tasks: true, notes: true } },
            },
        })
    },

    async findById({ id, userId }) {
        return prisma.category.findFirst({ where: { id, userId } })
    },

    async create({ data, userId }) {
        return prisma.category.create({ data: { ...data, userId } })
    },

    async update({ id, userId, data }) {
        return prisma.category.update({ where: { id, userId }, data })
    },

    async delete({ id, userId }) {
        return prisma.category.delete({ where: { id, userId } })
    },
}