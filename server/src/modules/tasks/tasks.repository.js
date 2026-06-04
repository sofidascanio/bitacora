import { prisma } from '../../lib/prisma.js'

// seleccion base reutilizable, para evitar traer campos innecesarios
const taskSelect = {
    id: true,
    title: true,
    description: true,
    status: true,
    priority: true,
    dueDate: true,
    order: true,
    parentId: true,
    createdAt: true,
    updatedAt: true,
    category: { select: { id: true, name: true, color: true } },
    tags: { select: { tag: { select: { id: true, name: true } } } },
    _count: { select: { subtasks: true } },
}

export const tasksRepository = {
    async findMany({ userId, filters }) {
        const {
            status, priority, categoryId, parentId,
            search, page, limit, sortBy, sortOrder,
        } = filters

        const where = {
            userId,
            // por defecto muestra solo tareas raiz (sin padre)
            // si se pasa parentId explicito, filtra por ese id
            parentId: parentId !== undefined ? parentId : null,
            ...(status     && { status }),
            ...(priority   && { priority }),
            ...(categoryId && { categoryId }),
            ...(search     && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            }),
        }

        const [tasks, total] = await Promise.all([
            prisma.task.findMany({
                where,
                select: taskSelect,
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.task.count({ where }),
        ])

        return { tasks, total, page, limit }
    },

    async findById({ id, userId }) {
        return prisma.task.findFirst({
            where: { id, userId },
            select: {
                ...taskSelect,
                subtasks: { select: taskSelect, orderBy: { order: 'asc' } },
            },
        })
    },

    async create({ data, userId }) {
        const { tagIds, ...taskData } = data

        // calcula el order maximo para poner la nueva tarea al final de su columna
        const maxOrderTask = await prisma.task.findFirst({
            where: { userId, status: taskData.status || 'TODO' },
            orderBy: { order: 'desc' },
            select: { order: true },
        })

        return prisma.task.create({
            data: {
                ...taskData,
                order: (maxOrderTask?.order ?? -1) + 1,
                userId,
                ...(tagIds?.length > 0 && {
                    tags: {
                        create: tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })),
                    },
                }),
            },
            select: taskSelect,
        })
    },

    async update({ id, userId, data }) {
        const { tagIds, ...taskData } = data

        // construye el update dinamicamente
        const updateData = { ...taskData }

        // si se envian tags, reemplaza todos (delete + create)
        if (tagIds !== undefined) {
            updateData.tags = {
                deleteMany: {},
                ...(tagIds.length > 0 && {
                    create: tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })),
                }),
            }
        }

        return prisma.task.update({
            where: { id, userId },
            data: updateData,
            select: {
                ...taskSelect,
                // incluye subtareas en la respuesta del update para que el cache quede completo
                subtasks: { select: taskSelect, orderBy: { order: 'asc' } },
            },
        })
    },

    // actualiza el status de todas las subtareas de un padre
    async updateSubtasksStatus({ parentId, userId, status }) {
        return prisma.task.updateMany({
            where: { parentId, userId },
            data: { status },
        })
    },

    async delete({ id, userId }) {
        // prisma hace cascade delete de subtasks por la relacion self-referencial
        return prisma.task.delete({ where: { id, userId } })
    },

    async updateOrder({ id, userId, order, status }) {
        return prisma.task.update({
            where: { id, userId },
            data: { order, status },
            select: { id: true, order: true, status: true },
        })
    },

    async findByDateRange({ userId, from, to }) {
        return prisma.task.findMany({
            where: {
                userId,
                dueDate: { gte: new Date(from), lte: new Date(to) },
            },
            select: taskSelect,
            orderBy: { dueDate: 'asc' },
        })
    },
}