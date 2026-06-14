export async function cleanDatabase(prisma) {
    console.log('Limpiando base de datos...')

    // tablas intermedias 
    await prisma.tagsOnTasks.deleteMany()
    await prisma.tagsOnNotes.deleteMany()

    // tareas: primero subtareas, despues las tareas sin subtareas
    await prisma.task.deleteMany({ where: { parentId: { not: null } } })
    await prisma.task.deleteMany()

    // entidades que dependen de user
    await prisma.note.deleteMany()
    await prisma.expense.deleteMany()
    await prisma.budget.deleteMany()
    await prisma.category.deleteMany()
    await prisma.tag.deleteMany()

    // entidades globales sin dependencias de usuario
    await prisma.expenseCategory.deleteMany()

    // usuarios
    await prisma.user.deleteMany()

    console.log('   ✔ Base de datos limpia')
}