import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const EXPENSE_CATEGORIES = [
    { name: 'Comida', color: '#ef4444', icon: 'restaurant' },
    { name: 'Transporte', color: '#f97316', icon: 'directions_car' },
    { name: 'Casa', color: '#8b5cf6', icon: 'home' },
    { name: 'Salud', color: '#10b981', icon: 'favorite' },
    { name: 'Entretenimiento', color: '#3b82f6', icon: 'sports_esports' },
    { name: 'Shopping', color: '#ec4899', icon: 'shopping_bag' },
    { name: 'Educación', color: '#6366f1', icon: 'school' },
    { name: 'Viajes', color: '#0ea5e9', icon: 'flight' },
    { name: 'Subscripciones', color: '#14b8a6', icon: 'subscriptions' },
    { name: 'Cuidado Personal', color: '#f59e0b', icon: 'self_improvement' },
    { name: 'Ahorros', color: '#22c55e', icon: 'savings' },
    { name: 'Otros', color: '#6b7280', icon: 'more_horiz' },
]

async function main() {
    console.log('Seed de categorias de gastos...')

    for (const cat of EXPENSE_CATEGORIES) {
        await prisma.expenseCategory.upsert({
            where: { name: cat.name },
            update: { color: cat.color, icon: cat.icon },
            create: cat,
        })
    }

    console.log(`✅ ${EXPENSE_CATEGORIES.length} categorias de gastos agregadas..`)
}

main()
    .catch((e) => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())