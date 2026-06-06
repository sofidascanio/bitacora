import { tagsService } from './tags.service.js'

export const tagsController = {
    async getTags(req, res, next) {
        try {
            const tags = await tagsService.getTags(req.user.id)
            res.json(tags)
        } catch (err) { next(err) }
    },

    async createTag(req, res, next) {
        try {
            const tag = await tagsService.createTag({
                name: req.body.name,
                userId: req.user.id,
            })
            res.status(201).json(tag)
        } catch (err) { next(err) }
    },

    async updateTag(req, res, next) {
        try {
            const tag = await tagsService.updateTag({
                id: req.params.id,
                userId: req.user.id,
                data: req.body,
            })
            res.json(tag)
        } catch (err) { next(err) }
    },

    async deleteTag(req, res, next) {
        try {
            await tagsService.deleteTag({ id: req.params.id, userId: req.user.id })
            res.status(204).send()
        } catch (err) { next(err) }
    },
}