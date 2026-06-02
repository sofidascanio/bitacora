import { prisma } from '../../lib/prisma.js'

const noteSelect = {
    id: true,
    title: true,
    content: true,
    createdAt: true,
    updatedAt: true,
    category: { select: { id: true, name: true, color: true } },
    tags: { select: { tag: { select: { id: true, name: true } } } },
}

export const notesRepository = {
    async findMany({ userId, filters }) {
        const { categoryId, search, page, limit, sortBy, sortOrder } = filters

        const where = {
            userId,
            ...(categoryId && { categoryId }),
            ...(search && {
                OR: [
                    { title:   { contains: search, mode: 'insensitive' } },
                    { content: { contains: search, mode: 'insensitive' } },
                ],
            }),
        }

        const [notes, total] = await Promise.all([
            prisma.note.findMany({
                where,
                select: noteSelect,
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.note.count({ where }),
        ])

        return { notes, total, page, limit }
    },

    async findById({ id, userId }) {
        return prisma.note.findFirst({
            where: { id, userId },
            select: noteSelect,
        })
    },

    async create({ data, userId }) {
        const { tagIds, ...noteData } = data

        return prisma.note.create({
            data: {
                ...noteData,
                userId,
                ...(tagIds?.length > 0 && {
                    tags: {
                        create: tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })),
                    },
                }),
            },
            select: noteSelect,
        })
    },

    async update({ id, userId, data }) {
        const { tagIds, ...noteData } = data

        const updateData = { ...noteData }

        if (tagIds !== undefined) {
            updateData.tags = {
                deleteMany: {},
                ...(tagIds.length > 0 && {
                    create: tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })),
                }),
            }
        }

        return prisma.note.update({
            where: { id, userId },
            data: updateData,
            select: noteSelect,
        })
    },

    async delete({ id, userId }) {
        return prisma.note.delete({ where: { id, userId } })
    },
}