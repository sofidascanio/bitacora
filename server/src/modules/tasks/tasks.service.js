import { tasksRepository } from './tasks.repository.js'
import { ApiError } from '../../utils/ApiError.js'

// convierte los tags de [{tag: {id, name}}] a [{id, name}]
function normalizeTags(tasks) {
    const normalize = (task) => ({
        ...task,
        tags: task.tags?.map((t) => t.tag) ?? [],
        // normaliza tags de subtareas si vienen incluidas
        subtasks: task.subtasks?.map((s) => ({
            ...s,
            tags: s.tags?.map((t) => t.tag) ?? [],
        })),
    })

    if (Array.isArray(tasks)) return tasks.map(normalize)
    return normalize(tasks)
}

export const tasksService = {
    async getTasks({ userId, filters }) {
        const result = await tasksRepository.findMany({ userId, filters })
        return {
            ...result,
            tasks: normalizeTags(result.tasks),
            totalPages: Math.ceil(result.total / result.limit),
        }
    },

    async getTask({ id, userId }) {
        const task = await tasksRepository.findById({ id, userId })
        if (!task) throw ApiError.notFound('Tarea no encontrada')
        return normalizeTags(task)
    },

    async createTask({ data, userId }) {
        // si tiene parentId, verifica que el padre exista y pertenezca al usuario
        if (data.parentId) {
            const parent = await tasksRepository.findById({ id: data.parentId, userId })
            if (!parent) throw ApiError.notFound('Tarea principal no encontrada')
        }

        const task = await tasksRepository.create({ data, userId })
        return normalizeTags(task)
    },

    async updateTask({ id, userId, data }) {
        const existing = await tasksRepository.findById({ id, userId })
        if (!existing) throw ApiError.notFound('Tarea no encontrada')

        // si se marca como DONE, propaga el status a todas las subtareas
        if (data.status === 'DONE' && existing.subtasks?.length > 0) {
            await tasksRepository.updateSubtasksStatus({
                parentId: id,
                userId,
                status: 'DONE',
            })
        }

        const task = await tasksRepository.update({ id, userId, data })
        return normalizeTags(task)
    },

    async deleteTask({ id, userId }) {
        const existing = await tasksRepository.findById({ id, userId })
        if (!existing) throw ApiError.notFound('Tarea no encontrada')
        await tasksRepository.delete({ id, userId })
    },

    async reorderTask({ id, userId, order, status }) {
        const existing = await tasksRepository.findById({ id, userId })
        if (!existing) throw ApiError.notFound('Tarea no encontrada')
        return tasksRepository.updateOrder({ id, userId, order, status })
    },

    async getTasksByDateRange({ userId, from, to }) {
        if (!from || !to) throw ApiError.badRequest('Se necesita un rango de fechas')
        const tasks = await tasksRepository.findByDateRange({ userId, from, to })
        return normalizeTags(tasks)
    },
}