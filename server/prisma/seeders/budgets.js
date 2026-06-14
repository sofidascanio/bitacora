// se generan presupuestos para el mes actual y los 2 meses anteriores
const BUDGET_AMOUNTS = {
    Comida: 90000,
    Transporte: 45000,
    Casa: 250000,
    Salud: 70000,
    Entretenimiento: 30000,
    Shopping: 40000,
    Educación: 20000,
    Viajes: 50000,
    Subscripciones: 15000,
    'Cuidado Personal': 20000,
    Ahorros: 100000,
    Otros: 10000,
}

// devuelve los ultimos 'count' periodos (mes/año) incluyendo el actual en orden descendente
function getRecentPeriods(count) {
    const periods = []
    const now = new Date()

    for (let i = 0; i < count; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        periods.push({ month: d.getMonth() + 1, year: d.getFullYear() })
    }

    return periods
}

// pequeña variacion entre meses para que no sea siempre el mismo monto exacto
function varyAmount(base, monthIndex) {
    // el mes actual usa el monto base, los anteriores tienen leve variacion
    if (monthIndex === 0) return base
    const factor = 1 + (((monthIndex * 7) % 11) - 5) / 100 // variacion entre -5% y +5%
    return Math.round(base * factor)
}

export async function seedBudgets(prisma, users, expenseCategories) {
    console.log('Seed: presupuestos...')

    const catMap = Object.fromEntries(expenseCategories.map(c => [c.name, c.id]))
    const periods = getRecentPeriods(3) // mes actual + 2 anteriores

    let total = 0

    for (const user of users) {
        for (const [categoryName, baseAmount] of Object.entries(BUDGET_AMOUNTS)) {
            const categoryId = catMap[categoryName]
            if (!categoryId) continue

            for (const [index, period] of periods.entries()) {
                const amount = varyAmount(baseAmount, index)

                await prisma.budget.upsert({
                    where: {
                        categoryId_month_year_userId: {
                            categoryId,
                            month: period.month,
                            year: period.year,
                            userId: user.id,
                        },
                    },
                    update: { amount },
                    create: {
                        amount,
                        month: period.month,
                        year: period.year,
                        categoryId,
                        userId: user.id,
                    },
                })
                total++
            }
        }
    }

    console.log(`   ✔ ${total} presupuestos creados (${periods.length} períodos por categoría/usuario)`)
}