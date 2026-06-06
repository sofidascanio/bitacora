import { prisma } from '../../lib/prisma.js'

export const tagsRepository = {
    async findAll(userId) {
        return prisma.tag.findMany({
            where: { userId },
            orderBy: { name: 'asc' },
            include: {
                _count: { select: { tasks: true, notes: true } },
            },
        })
    },

    async findById({ id, userId }) {
        return prisma.tag.findFirst({ where: { id, userId } })
    },

    async create({ name, userId }) {
        return prisma.tag.create({
            data: { name, userId },
            include: { _count: { select: { tasks: true, notes: true } } },
        })
    },

    async update({ id, userId, data }) {
        return prisma.tag.update({
            where: { id, userId },
            data,
            include: { _count: { select: { tasks: true, notes: true } } },
        })
    },

    async delete({ id, userId }) {
        return prisma.tag.delete({ where: { id, userId } })
    },
}