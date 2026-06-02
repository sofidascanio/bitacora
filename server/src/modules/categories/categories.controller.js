import { categoriesService } from './categories.service.js'

export const categoriesController = {
    async getCategories(req, res, next) {
        try {
            const categories = await categoriesService.getCategories(req.user.id)
            res.json(categories)
        } catch (err) { next(err) }
    },

    async createCategory(req, res, next) {
        try {
            const category = await categoriesService.createCategory({ data: req.body, userId: req.user.id })
            res.status(201).json(category)
        } catch (err) { next(err) }
    },

    async updateCategory(req, res, next) {
        try {
            const category = await categoriesService.updateCategory({
                id: req.params.id, 
                userId: req.user.id, 
                data: req.body,
            })
            res.json(category)
        } catch (err) { next(err) }
    },

    async deleteCategory(req, res, next) {
        try {
            await categoriesService.deleteCategory({ id: req.params.id, userId: req.user.id })
            res.status(204).send()
        } catch (err) { next(err) }
    },
}