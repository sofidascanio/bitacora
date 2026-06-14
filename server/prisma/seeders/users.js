import bcrypt from 'bcryptjs'

// contraseña por defecto para todos los usuarios de seed "password123"
const DEFAULT_PASSWORD = 'password123'

const USERS_DATA = [
    {
        username: 'admin',
        email: 'admin@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
    {
        username: 'martin_garcia',
        email: 'martin.garcia@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=martin',
    },
    {
        username: 'sofia_lopez',
        email: 'sofia.lopez@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sofia',
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