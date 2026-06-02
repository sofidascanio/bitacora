import { Router } from 'express'
import { notesController } from './notes.controller.js'
import { authMiddleware } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { createNoteSchema, updateNoteSchema } from './notes.schema.js'

const router = Router()

router.use(authMiddleware)

router.get('/', notesController.getNotes)
router.get('/:id', notesController.getNote)
router.post('/', validate(createNoteSchema), notesController.createNote)
router.patch('/:id', validate(updateNoteSchema), notesController.updateNote)
router.delete('/:id', notesController.deleteNote)

export default router