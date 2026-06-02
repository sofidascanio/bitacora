import { Router } from 'express'
import { tasksController } from './tasks.controller.js'
import { authMiddleware } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { createTaskSchema, updateTaskSchema } from './tasks.schema.js'

const router = Router()

// todas rutas que requieren auth
router.use(authMiddleware)

router.get('/', tasksController.getTasks)
router.get('/calendar', tasksController.getTasksByDateRange)
router.get('/:id', tasksController.getTask)
router.post('/', validate(createTaskSchema), tasksController.createTask)
router.patch('/:id', validate(updateTaskSchema), tasksController.updateTask)
router.delete('/:id', tasksController.deleteTask)
router.patch('/:id/order', tasksController.reorderTask)

export default router