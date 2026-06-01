import './src/config/env.js' 
import app from './src/app.js'
import { env } from './src/config/env.js'
import { prisma } from './src/lib/prisma.js'

const server = app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`)
    console.log(`Environment: ${env.NODE_ENV}`)
})

// cierre graceful: espera que las conexiones activas terminen
async function shutdown(signal) {
    console.log(`\n${signal} received. Shutting down gracefully...`)
    server.close(async () => {
        await prisma.$disconnect()
        console.log('Server and database connections closed.')
        process.exit(0)
    })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

// errores no capturados, loguea y sale
process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err)
    shutdown('unhandledRejection')
})