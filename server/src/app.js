import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { env } from './config/env.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
import authRouter from './modules/auth/auth.routes.js'
import tasksRouter from './modules/tasks/tasks.routes.js'
import notesRouter from './modules/notes/notes.routes.js'
import categoriesRouter from './modules/categories/categories.routes.js'
import expensesRouter from './modules/expenses/expenses.routes.js'
import tagsRouter from './modules/tags/tags.routes.js'

const app = express()

// middlewares globales
app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// health check 
app.get('/health', (req, res) => {
    res.json({ status: 'ok', env: env.NODE_ENV })
})

// API routes
app.use('/api/auth', authRouter)
app.use('/api/tasks', tasksRouter)
app.use('/api/notes', notesRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/expenses', expensesRouter)
app.use('/api/tags', tagsRouter)

// 404 handler 
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.path} not found` })
})

// error handler 
app.use(errorMiddleware)

export default app