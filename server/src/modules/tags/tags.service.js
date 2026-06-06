import { tagsRepository } from './tags.repository.js'
import { ApiError } from '../../utils/ApiError.js'

export const tagsService = {
    async getTags(userId) {
        return tagsRepository.findAll(userId)
    },

    async createTag({ name, userId }) {
        return tagsRepository.create({ name, userId })
    },

    async updateTag({ id, userId, data }) {
        const existing = await tagsRepository.findById({ id, userId })
        if (!existing) throw ApiError.notFound('No se encontro la etiqueta.')
        return tagsRepository.update({ id, userId, data })
    },

    async deleteTag({ id, userId }) {
        const existing = await tagsRepository.findById({ id, userId })
        if (!existing) throw ApiError.notFound('No se encontro la etiqueta.')
        return tagsRepository.delete({ id, userId })
    },
}