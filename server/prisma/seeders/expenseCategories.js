export const EXPENSE_CATEGORIES_DATA = [
    { name: 'Comida',  color: '#ef4444', icon: 'restaurant', description: 'Supermercado, delivery y restaurantes' },
    { name: 'Transporte', color: '#f97316', icon: 'directions_car',  description: 'Combustible, transporte público y taxis' },
    { name: 'Casa', color: '#8b5cf6', icon: 'home', description: 'Alquiler, servicios e internet' },
    { name: 'Salud', color: '#10b981', icon: 'favorite', description: 'Médicos, medicamentos y gimnasio' },
    { name: 'Entretenimiento', color: '#3b82f6', icon: 'sports_esports', description: 'Cine, juegos y salidas' },
    { name: 'Shopping', color: '#ec4899', icon: 'shopping_bag', description: 'Ropa, calzado y accesorios' },
    { name: 'Educación', color: '#6366f1', icon: 'school', description: 'Cursos, libros y materiales' },
    { name: 'Viajes', color: '#0ea5e9', icon: 'flight', description: 'Vuelos, hoteles y turismo' },
    { name: 'Subscripciones',  color: '#14b8a6', icon: 'subscriptions', description: 'Netflix, Spotify y servicios digitales' },
    { name: 'Cuidado Personal', color: '#f59e0b', icon: 'self_improvement',description: 'Peluquería, cosméticos y spa' },
    { name: 'Ahorros', color: '#22c55e', icon: 'savings', description: 'Transferencias a caja de ahorro' },
    { name: 'Otros', color: '#6b7280', icon: 'more_horiz', description: 'Gastos varios no categorizados' },
]

export async function seedExpenseCategories(prisma) {
    console.log('Seed: categorías de gastos...')

    const categories = []

    for (const cat of EXPENSE_CATEGORIES_DATA) {
        const category = await prisma.expenseCategory.upsert({
            where: { name: cat.name },
            update: { color: cat.color, icon: cat.icon, description: cat.description },
            create: cat,
        })
        categories.push(category)
    }

    console.log(`   ✔ ${categories.length} categorías de gastos listas`)
    return categories
}