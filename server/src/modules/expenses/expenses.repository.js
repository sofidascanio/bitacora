import { prisma } from '../../lib/prisma.js'

const expenseSelect = {
    id: true,
    amount: true,
    description: true,
    date: true,
    createdAt: true,
    updatedAt: true,
    category: {
        select: { id: true, name: true, color: true, icon: true },
    },
}

export const expensesRepository = {
    // expenses
    async findMany({ userId, filters }) {
        const { categoryId, month, year, search, page, limit, sortBy, sortOrder } = filters

        const where = {
            userId,
            ...(categoryId && { categoryId }),
            ...(search && {
                description: { contains: search, mode: 'insensitive' },
            }),
            // filtro por mes/año sobre el campo date
            ...((month || year) && {
                date: {
                    ...(month && year && {
                        gte: new Date(year, month - 1, 1),
                        lt:  new Date(year, month, 1),
                    }),
                    ...(year && !month && {
                        gte: new Date(year, 0, 1),
                        lt:  new Date(year + 1, 0, 1),
                    }),
                },
            }),
        }

        const [expenses, total] = await Promise.all([
            prisma.expense.findMany({
                where,
                select: expenseSelect,
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.expense.count({ where }),
        ])

        return { expenses, total, page, limit }
    },

    async findById({ id, userId }) {
        return prisma.expense.findFirst({ where: { id, userId }, select: expenseSelect })
    },

    async create({ data, userId }) {
        return prisma.expense.create({
            data: { ...data, userId },
            select: expenseSelect,
        })
    },

    async update({ id, userId, data }) {
        return prisma.expense.update({
            where: { id, userId },
            data,
            select: expenseSelect,
        })
    },

    async delete({ id, userId }) {
        return prisma.expense.delete({ where: { id, userId } })
    },

    // estadisticas
    async getMonthlyStats({ userId, month, year }) {
        const gte = new Date(year, month - 1, 1)
        const lt  = new Date(year, month, 1)

        // total del mes
        const totalResult = await prisma.expense.aggregate({
            where: { userId, date: { gte, lt } },
            _sum: { amount: true },
            _count: true,
        })

        // total por categoria en el mes
        const byCategory = await prisma.expense.groupBy({
            by: ['categoryId'],
            where: { userId, date: { gte, lt } },
            _sum: { amount: true },
            _count: true,
            orderBy: { _sum: { amount: 'desc' } },
        })

        // trae los datos de cada categoria
        const categoryIds = byCategory.map((r) => r.categoryId)
        const categories  = await prisma.expenseCategory.findMany({
            where: { id: { in: categoryIds } },
            select: { id: true, name: true, color: true, icon: true },
        })

        const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]))

        // total de los ultimos 6 meses para el grafico de tendencia
        const sixMonthsAgo = new Date(year, month - 7, 1)
        const monthlyTrend = await prisma.$queryRaw`
            SELECT
                DATE_TRUNC('month', date) AS month,
                SUM(amount)::float        AS total,
                COUNT(*)::int             AS count
            FROM "Expense"
            WHERE "userId" = ${userId}
                AND date >= ${sixMonthsAgo}
                AND date < ${lt}
            GROUP BY DATE_TRUNC('month', date)
            ORDER BY month ASC
            `

        return {
            total: Number(totalResult._sum.amount ?? 0),
            count: totalResult._count,
            byCategory: byCategory.map((r) => ({
                category: categoryMap[r.categoryId],
                total: Number(r._sum.amount),
                count: r._count,
            })),
            monthlyTrend: monthlyTrend.map((row) => ({
                month: row.month,
                total: row.total,
                count: row.count,
            })),
        }
    },

    // categorias
    async findAllCategories(userId) {
        return prisma.expenseCategory.findMany({
            where: { userId },
            orderBy: { name: 'asc' },
            include: { _count: { select: { expenses: true } } },
        })
    },

    async findCategoryById({ id, userId }) {
        return prisma.expenseCategory.findFirst({ where: { id, userId } })
    },

    async createCategory({ data, userId }) {
        return prisma.expenseCategory.create({ data: { ...data, userId } })
    },

    async updateCategory({ id, userId, data }) {
        return prisma.expenseCategory.update({ where: { id, userId }, data })
    },

    async deleteCategory({ id, userId }) {
        return prisma.expenseCategory.delete({ where: { id, userId } })
    },

    // presupuestos
    async findBudgets({ userId, month, year }) {
        return prisma.budget.findMany({
            where: { userId, month, year },
            include: { category: { select: { id: true, name: true, color: true, icon: true } } },
        })
    },

    async upsertBudget({ userId, categoryId, month, year, amount }) {
        return prisma.budget.upsert({
            where: { categoryId_month_year_userId: { categoryId, month, year, userId } },
            create: { userId, categoryId, month, year, amount },
            update: { amount },
            include: { category: { select: { id: true, name: true, color: true, icon: true } } },
        })
    },

    async deleteBudget({ id, userId }) {
        return prisma.budget.delete({ where: { id, userId } })
    },
}