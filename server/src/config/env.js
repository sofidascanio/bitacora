import dotenv from 'dotenv'
dotenv.config()

const required = ['DATABASE_URL', 'JWT_SECRET', 'PORT', 'CLIENT_URL']

for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`)
    }
}

export const env = {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    PORT: parseInt(process.env.PORT, 10) || 3001,
    CLIENT_URL: process.env.CLIENT_URL,
    NODE_ENV: process.env.NODE_ENV || 'development',
}