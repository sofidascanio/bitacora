import { categoriesRepository } from './categories.repository.js'
import { ApiError } from '../../utils/ApiError.js'

export const categoriesService = {
    async getCategories(userId) {
        return categoriesRepository.findAll(userId)
    },

    async createCategory({ data, userId }) {
        return categoriesRepository.create({ data, userId })
    },

    async updateCategory({ id, userId, data }) {
        const existing = await categoriesRepository.findById({ id, userId })
        if (!existing) throw ApiError.notFound('No se encontro la categoría.')
        return categoriesRepository.update({ id, userId, data })
    },

    async deleteCategory({ id, userId }) {
        const existing = await categoriesRepository.findById({ id, userId })
        if (!existing) throw ApiError.notFound('No se encontro la categoría.')
        return categoriesRepository.delete({ id, userId })
    },
}