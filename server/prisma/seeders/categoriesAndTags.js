// categorias y tags se crean por usuario (tienen userId)

const CATEGORIES_BY_USER = {
    // admin y martin_garcia tienen las mismas categorias base
    default: [
        { name: 'Trabajo', color: '#3b82f6', description: 'Proyectos y tareas laborales' },
        { name: 'Personal', color: '#10b981', description: 'Vida personal y familia' },
        { name: 'Proyectos', color: '#8b5cf6', description: 'Proyectos personales y side projects' },
        { name: 'Estudio', color: '#f59e0b', description: 'Cursos, libros y aprendizaje' },
        { name: 'Salud', color: '#ef4444', description: 'Ejercicio, médicos y bienestar' },
    ],
    sofia: [
        { name: 'Diseño',  color: '#ec4899', description: 'Proyectos de diseño gráfico' },
        { name: 'Freelance', color: '#f97316', description: 'Clientes y proyectos freelance' },
        { name: 'Hogar', color: '#14b8a6', description: 'Tareas del hogar y compras' },
        { name: 'Estudio', color: '#6366f1', description: 'Universidad y cursos online' },
        { name: 'Personal', color: '#22c55e', description: 'Vida personal y ocio' },
    ],
}

const TAGS_BY_USER = {
    default: [
        'urgente', 'importante', 'en-espera', 'revisión', 'bug',
        'feature', 'mejora', 'documentación', 'reunión', 'idea',
    ],
    sofia: [
        'cliente-a', 'cliente-b', 'urgente', 'pendiente', 'revisión',
        'inspiración', 'referencia', 'entrega', 'feedback', 'borrador',
    ],
}

export async function seedCategoriesAndTags(prisma, users) {
    console.log('Seed: categorías y etiquetas de usuarios...')

    const allCategories = {}  // { userId: [category, ...] }
    const allTags = {}        // { userId: [tag, ...] }

    for (const user of users) {
        const isSofia = user.username === 'sofia_lopez'
        const categoriesData = isSofia ? CATEGORIES_BY_USER.sofia : CATEGORIES_BY_USER.default
        const tagsData = isSofia ? TAGS_BY_USER.sofia : TAGS_BY_USER.default

        // crea categorias
        const userCategories = []
        for (const cat of categoriesData) {
            const category = await prisma.category.upsert({
                where: { name_userId: { name: cat.name, userId: user.id } },
                update: { color: cat.color, description: cat.description },
                create: { ...cat, userId: user.id },
            })
            userCategories.push(category)
        }
        allCategories[user.id] = userCategories

        // crea tags
        const userTags = []
        for (const tagName of tagsData) {
            const tag = await prisma.tag.upsert({
                where: { name_userId: { name: tagName, userId: user.id } },
                update: {},
                create: { name: tagName, userId: user.id },
            })
            userTags.push(tag)
        }
        allTags[user.id] = userTags
    }

    const totalCats = Object.values(allCategories).flat().length
    const totalTags = Object.values(allTags).flat().length
    console.log(`   ✔ ${totalCats} categorías y ${totalTags} etiquetas listas`)

    return { categories: allCategories, tags: allTags }
}