import { Router } from 'express'
import { tagsController } from './tags.controller.js'
import { authMiddleware } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { createTagSchema, updateTagSchema } from './tags.schema.js'

const router = Router()
router.use(authMiddleware)

router.get('/', tagsController.getTags)
router.post('/', validate(createTagSchema), tagsController.createTag)
router.patch('/:id', validate(updateTagSchema), tagsController.updateTag)
router.delete('/:id', tagsController.deleteTag)

export default router