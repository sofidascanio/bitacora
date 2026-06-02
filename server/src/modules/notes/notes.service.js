import { notesRepository } from './notes.repository.js'
import { ApiError } from '../../utils/ApiError.js'

function normalizeTags(notes) {
    const normalize = (note) => ({
        ...note,
        tags: note.tags?.map((t) => t.tag) ?? [],
    })
    if (Array.isArray(notes)) return notes.map(normalize)
    return normalize(notes)
}

export const notesService = {
    async getNotes({ userId, filters }) {
        const result = await notesRepository.findMany({ userId, filters })
        return {
            ...result,
            notes:      normalizeTags(result.notes),
            totalPages: Math.ceil(result.total / result.limit),
        }
    },

    async getNote({ id, userId }) {
        const note = await notesRepository.findById({ id, userId })
        if (!note) throw ApiError.notFound('Note not found')
        return normalizeTags(note)
    },

    async createNote({ data, userId }) {
        const note = await notesRepository.create({ data, userId })
        return normalizeTags(note)
    },

    async updateNote({ id, userId, data }) {
        const existing = await notesRepository.findById({ id, userId })
        if (!existing) throw ApiError.notFound('Note not found')
        const note = await notesRepository.update({ id, userId, data })
        return normalizeTags(note)
    },

    async deleteNote({ id, userId }) {
        const existing = await notesRepository.findById({ id, userId })
        if (!existing) throw ApiError.notFound('Note not found')
        await notesRepository.delete({ id, userId })
    },
}