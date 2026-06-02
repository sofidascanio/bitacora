import { notesService } from './notes.service.js'
import { noteFiltersSchema } from './notes.schema.js'

export const notesController = {
    async getNotes(req, res, next) {
        try {
            const filters = noteFiltersSchema.parse(req.query)
            const result  = await notesService.getNotes({ userId: req.user.id, filters })
            res.json(result)
        } catch (err) { next(err) }
    },

    async getNote(req, res, next) {
        try {
            const note = await notesService.getNote({ id: req.params.id, userId: req.user.id })
            res.json(note)
        } catch (err) { next(err) }
    },

    async createNote(req, res, next) {
        try {
            const note = await notesService.createNote({ data: req.body, userId: req.user.id })
            res.status(201).json(note)
        } catch (err) { next(err) }
    },

    async updateNote(req, res, next) {
        try {
            const note = await notesService.updateNote({
                id: req.params.id,
                userId: req.user.id,
                data: req.body,
            })
            res.json(note)
        } catch (err) { next(err) }
    },

    async deleteNote(req, res, next) {
        try {
            await notesService.deleteNote({ id: req.params.id, userId: req.user.id })
            res.status(204).send()
        } catch (err) { next(err) }
    },
}