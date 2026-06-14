import { PrismaClient } from '@prisma/client'
import { cleanDatabase } from './seeders/clean.js'
import { seedExpenseCategories } from './seeders/expenseCategories.js'
import { seedUsers } from './seeders/users.js'
import { seedCategoriesAndTags } from './seeders/categoriesAndTags.js'
import { seedTasks } from './seeders/tasks.js'
import { seedNotes } from './seeders/notes.js'
import { seedExpenses } from './seeders/expenses.js'
import { seedBudgets } from './seeders/budgets.js'

const prisma = new PrismaClient()

async function main() {
    console.log('Iniciando seed completo...\n')

    // if (process.env.SEED_CLEAN === 'true') {
    //     await cleanDatabase(prisma)
    //     console.log('')
    // }
    await cleanDatabase(prisma)

    const expenseCategories = await seedExpenseCategories(prisma)

    const users = await seedUsers(prisma)

    const { categories, tags } = await seedCategoriesAndTags(prisma, users)

    await seedTasks(prisma, users, categories, tags)

    await seedNotes(prisma, users, categories, tags)

    await seedExpenses(prisma, users, expenseCategories)

    await seedBudgets(prisma, users, expenseCategories)

    console.log('\n Seed completo finalizado.')
}

main()
    .catch((e) => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())