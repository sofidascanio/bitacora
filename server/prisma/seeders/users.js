import bcrypt from 'bcryptjs'

// contraseña por defecto para todos los usuarios de seed "password123"
const DEFAULT_PASSWORD = 'password123'

const USERS_DATA = [
    {
        username: 'admin',
        email: 'admin@example.com',
    },
    {
        username: 'martingarcia',
        email: 'martingarcia@example.com',
    },
    {
        username: 'sofialopez',
        email: 'sofialopez@example.com',
    },
]

export async function seedUsers(prisma) {
    console.log('Seed: usuarios...')

    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10)
    const users = []

    for (const userData of USERS_DATA) {
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: { ...userData, password: hashedPassword },
        })
        users.push(user)
    }

    console.log(`   ✔ ${users.length} usuarios listos (contraseña: "${DEFAULT_PASSWORD}")`)
    return users
}