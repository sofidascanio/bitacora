import { Router } from 'express'
import { categoriesController } from './categories.controller.js'
import { authMiddleware } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { createCategorySchema, updateCategorySchema } from './categories.schema.js'

const router = Router()
router.use(authMiddleware)

router.get('/', categoriesController.getCategories)
router.post('/', validate(createCategorySchema), categoriesController.createCategory)
router.patch('/:id', validate(updateCategorySchema), categoriesController.updateCategory)
router.delete('/:id', categoriesController.deleteCategory)

export default router