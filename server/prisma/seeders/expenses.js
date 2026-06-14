import { subDays, subMonths, setDate } from 'date-fns'

// genera una fecha aleatoria dentro del rango [daysAgoMax, daysAgoMin]
function randomDateInRange(daysAgoMax, daysAgoMin = 0) {
    const diff = Math.floor(Math.random() * (daysAgoMax - daysAgoMin)) + daysAgoMin
    return subDays(new Date(), diff)
}

// genera un monto con algo de variacion aleatoria alrededor de un centro
function randomAmount(center, variance = 0.2) {
    const factor = 1 + (Math.random() * variance * 2 - variance)
    return Math.round(center * factor)
}

// gastos recurrentes mensuales (se repiten los ultimos 3 meses)
function buildRecurringExpenses(userId, catMap) {
    const expenses = []

    // ultimos 3 meses
    for (let m = 0; m < 3; m++) {
        const base = subMonths(new Date(), m)

        const monthly = [
            { description: 'Alquiler departamento', amount: 180000, categoryName: 'Casa', day: 1  },
            { description: 'Expensas', amount: 28000, categoryName: 'Casa', day: 5  },
            { description: 'Internet Fibertel', amount: 9800, categoryName: 'Casa', day: 10 },
            { description: 'Luz (EDESUR)', amount: 15400,categoryName: 'Casa', day: 12 },
            { description: 'Gas (Metrogas)', amount: 8200, categoryName: 'Casa', day: 14 },
            { description: 'Netflix', amount: 3499, categoryName: 'Subscripciones', day: 3  },
            { description: 'Spotify', amount: 1799, categoryName: 'Subscripciones', day: 3  },
            { description: 'Adobe Creative Cloud', amount: 8900,   categoryName: 'Subscripciones', day: 7  },
            { description: 'OSDE plan 310', amount: 52000,  categoryName: 'Salud', day: 1  },
            { description: 'Gimnasio SmartFit', amount: 18500,  categoryName: 'Salud', day: 5  },
        ]

        for (const item of monthly) {
            const categoryId = catMap[item.categoryName]
            if (!categoryId) continue
            expenses.push({
                amount: randomAmount(item.amount, 0.05), // poca variación en recurrentes
                description: item.description,
                date: setDate(base, item.day),
                categoryId,
                userId,
            })
        }
    }

    return expenses
}

// gastos variables (compras, comida, transporte, etc.)
function buildVariableExpenses(userId, catMap) {
    const items = [
        // comida
        { description: 'Carrefour - compra semanal',        amount: 28000, cat: 'Comida',  daysAgo: 2  },
        { description: 'Mostaza - almuerzo',                amount: 4200,  cat: 'Comida',  daysAgo: 3  },
        { description: 'La Cabaña del Tío - cena familiar', amount: 18500, cat: 'Comida',  daysAgo: 5  },
        { description: 'PedidosYa - delivery pizza',        amount: 8900,  cat: 'Comida',  daysAgo: 7  },
        { description: 'Disco - supermercado',              amount: 22000, cat: 'Comida',  daysAgo: 10 },
        { description: 'Café con medialunas - bar',         amount: 2800,  cat: 'Comida',  daysAgo: 11 },
        { description: 'Rappi - comida japonesa',           amount: 11200, cat: 'Comida',  daysAgo: 15 },
        { description: 'Coto - compra mensual grande',      amount: 65000, cat: 'Comida',  daysAgo: 18 },
        { description: 'Café Martínez - desayuno',          amount: 3400,  cat: 'Comida',  daysAgo: 20 },
        { description: 'Green Eat - almuerzo saludable',    amount: 6800,  cat: 'Comida',  daysAgo: 25 },

        // transporte
        { description: 'Carga SUBE',                   amount: 5000,   cat: 'Transporte',  daysAgo: 4  },
        { description: 'YPF - carga de nafta',         amount: 38000,  cat: 'Transporte',  daysAgo: 6  },
        { description: 'Cabify - viaje al aeropuerto', amount: 12500,  cat: 'Transporte',  daysAgo: 9  },
        { description: 'Autopista Riccheri',           amount: 1800,   cat: 'Transporte',  daysAgo: 13 },
        { description: 'Shell - nafta',                amount: 41000,  cat: 'Transporte',  daysAgo: 22 },
        { description: 'Estacionamiento Shopping',     amount: 1500,   cat: 'Transporte',  daysAgo: 28 },
        { description: 'Uber - salida nocturna',       amount: 4200,   cat: 'Transporte',  daysAgo: 35 },
        { description: 'YPF - nafta',                  amount: 39500,  cat: 'Transporte',  daysAgo: 40 },

        // salud
        { description: 'Farmacity - medicamentos',      amount: 8900,  cat: 'Salud',  daysAgo: 8  },
        { description: 'Dr. Méndez - consulta clínico', amount: 14000, cat: 'Salud',  daysAgo: 14 },
        { description: 'Farmacity - vitaminas',         amount: 6200,  cat: 'Salud',  daysAgo: 30 },
        { description: 'Dr. Torres - odontólogo',       amount: 32000, cat: 'Salud',  daysAgo: 45 },

        // entretenimiento
        { description: 'Cine Village - entradas x2',       amount: 9600,   cat: 'Entretenimiento', daysAgo: 5  },
        { description: 'Steam - Cyberpunk 2077',           amount: 4200,   cat: 'Entretenimiento', daysAgo: 12 },
        { description: 'Bar La Biela - salida con amigos', amount: 14500,  cat: 'Entretenimiento', daysAgo: 19 },
        { description: 'Teatro Colón - entrada',           amount: 8000,   cat: 'Entretenimiento', daysAgo: 32 },
        { description: 'Bowling + pizza',                  amount: 18000,  cat: 'Entretenimiento', daysAgo: 50 },
        { description: 'Escape room',                      amount: 12000,  cat: 'Entretenimiento', daysAgo: 60 },

        // shopping
        { description: 'Zara - camisa y jean',             amount: 42000,  cat: 'Shopping',    daysAgo: 7  },
        { description: 'Nike - zapatillas running',        amount: 89000,  cat: 'Shopping',    daysAgo: 20 },
        { description: 'Mercado Libre - auriculares BT',   amount: 35000,  cat: 'Shopping',    daysAgo: 33 },
        { description: 'Ikea - lámpara escritorio',        amount: 22000,  cat: 'Shopping',    daysAgo: 48 },
        { description: 'H&M - ropa casual',                amount: 31000,  cat: 'Shopping',    daysAgo: 70 },

        // educacion
        { description: 'Udemy - curso Next.js 14',          amount: 2900,   cat: 'Educación',  daysAgo: 10 },
        { description: 'Manning - libro "Rust in Action"',  amount: 8400,   cat: 'Educación',  daysAgo: 25 },
        { description: 'Platzi - suscripción anual',        amount: 48000,  cat: 'Educación',  daysAgo: 55 },

        // cuidado Personal
        { description: 'Peluquería Pablo',              amount: 7500,  cat: 'Cuidado Personal', daysAgo: 15 },
        { description: 'Farmacity - cremas y shampoo',  amount: 9800,  cat: 'Cuidado Personal', daysAgo: 30 },
        { description: 'Masaje relax 60 min',           amount: 18000, cat: 'Cuidado Personal', daysAgo: 42 },

        // ahorros
        { description: 'Transferencia caja de ahorro',   amount: 100000, cat: 'Ahorros',  daysAgo: 1  },
        { description: 'Transferencia caja de ahorro',   amount: 80000,  cat: 'Ahorros',  daysAgo: 31 },
        { description: 'Transferencia caja de ahorro',   amount: 120000, cat: 'Ahorros',  daysAgo: 61 },

        // otros
        { description: 'Regalo cumpleaños amiga',  amount: 15000, cat: 'Otros',  daysAgo: 11 },
        { description: 'Tintorería',               amount: 4500,  cat: 'Otros',  daysAgo: 23 },
        { description: 'Gastos bancarios',         amount: 1200,  cat: 'Otros',  daysAgo: 31 },
    ]

    return items
        .filter(i => catMap[i.cat])
        .map(i => ({
            amount: randomAmount(i.amount, 0.1),
            description: i.description,
            date: subDays(new Date(), i.daysAgo),
            categoryId: catMap[i.cat],
            userId,
        }))
}

export async function seedExpenses(prisma, users, expenseCategories) {
    console.log('Seed: gastos...')

    // mapa nombre -> id de las expense categories globales
    const catMap = Object.fromEntries(expenseCategories.map(c => [c.name, c.id]))

    let total = 0

    for (const user of users) {
        const recurring = buildRecurringExpenses(user.id, catMap)
        const variable = buildVariableExpenses(user.id, catMap)
        const all = [...recurring, ...variable]

        await prisma.expense.createMany({ data: all })
        total += all.length
    }

    console.log(`   ✔ ${total} gastos creados`)
}