import { tasksService } from './tasks.service.js'
import { taskFiltersSchema } from './tasks.schema.js'

export const tasksController = {
    async getTasks(req, res, next) {
        try {
            // los query params vienen como strings, zod los 'coerce' con z.coerce.number()
            const filters = taskFiltersSchema.parse(req.query)
            const result = await tasksService.getTasks({ userId: req.user.id, filters })
            res.json(result)
        } catch (err) { next(err) }
    },

    async getTask(req, res, next) {
        try {
            const task = await tasksService.getTask({ id: req.params.id, userId: req.user.id })
            res.json(task)
        } catch (err) { next(err) }
    },

    async createTask(req, res, next) {
        try {
            const task = await tasksService.createTask({ data: req.body, userId: req.user.id })
            res.status(201).json(task)
        } catch (err) { next(err) }
    },

    async updateTask(req, res, next) {
        try {
            const task = await tasksService.updateTask({
                id: req.params.id,
                userId: req.user.id,
                data: req.body,
            })
            res.json(task)
        } catch (err) { next(err) }
    },

    async deleteTask(req, res, next) {
        try {
            await tasksService.deleteTask({ id: req.params.id, userId: req.user.id })
            res.status(204).send()
        } catch (err) { next(err) }
    },

    async reorderTask(req, res, next) {
        try {
            const task = await tasksService.reorderTask({
                id: req.params.id,
                userId: req.user.id,
                ...req.body,
            })
            res.json(task)
        } catch (err) { next(err) }
    },

    async getTasksByDateRange(req, res, next) {
        try {
            const tasks = await tasksService.getTasksByDateRange({
                userId: req.user.id,
                from: req.query.from,
                to: req.query.to,
            })
            res.json(tasks)
        } catch (err) { next(err) }
    },
}