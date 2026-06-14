import { subDays, addDays } from 'date-fns'

// helper para fecha relativa a hoy
const daysAgo  = (n) => subDays(new Date(), n)
const daysFrom = (n) => addDays(new Date(), n)

// tareas por usuario: [categoryName, tags[], task, subtasks[]]

function getTasksData(userId, categories, tags) {
    const cat = (name) => categories[userId]?.find(c => c.name === name)?.id ?? null
    const tag = (name) => tags[userId]?.find(t => t.name === name)?.id ?? null

    return [
        // trabajo 
        {
            task: {
                title: 'Lanzar nueva versión del dashboard',
                description: 'Coordinar el despliegue de v2.0 con el equipo de backend.',
                status: 'IN_PROGRESS',
                priority: 'HIGH',
                dueDate: daysFrom(5),
                order: 1,
                categoryId: cat('Trabajo') ?? cat('Diseño'),
                userId,
            },
            tags: [tag('urgente'), tag('revisión')].filter(Boolean),
            subtasks: [
                { title: 'Revisar pull requests pendientes', status: 'DONE', priority: 'HIGH', order: 1 },
                { title: 'Actualizar variables de entorno en producción', status: 'IN_PROGRESS', priority: 'HIGH', order: 2 },
                { title: 'Ejecutar suite de tests E2E', status: 'TODO', priority: 'MEDIUM', order: 3 },
                { title: 'Redactar changelog para usuarios', status: 'TODO', priority: 'LOW', order: 4 },
            ],
        },
        {
            task: {
                title: 'Preparar informe mensual de métricas',
                description: 'Recopilar datos de GA4, CRM y soporte para el reporte de dirección.',
                status: 'TODO',
                priority: 'MEDIUM',
                dueDate: daysFrom(3),
                order: 2,
                categoryId: cat('Trabajo') ?? cat('Freelance'),
                userId,
            },
            tags: [tag('importante'), tag('reunión')].filter(Boolean),
            subtasks: [
                { title: 'Exportar datos de Google Analytics', status: 'DONE',  priority: 'MEDIUM', order: 1 },
                { title: 'Consolidar métricas en spreadsheet', status: 'TODO',  priority: 'MEDIUM', order: 2 },
                { title: 'Crear slides resumen', status: 'TODO',  priority: 'LOW', order: 3 },
            ],
        },

        // pProyectos/freelance 
        {
            task: {
                title: 'Desarrollar app de hábitos con React Native',
                description: 'Side project personal. MVP con racha diaria, notificaciones y estadísticas.',
                status: 'IN_PROGRESS',
                priority: 'MEDIUM',
                dueDate: daysFrom(30),
                order: 3,
                categoryId: cat('Proyectos') ?? cat('Freelance'),
                userId,
            },
            tags: [tag('feature'), tag('idea')].filter(Boolean),
            subtasks: [
                { title: 'Definir pantallas y flujos en Figma', status: 'DONE', priority: 'HIGH', order: 1 },
                { title: 'Configurar proyecto Expo + TypeScript',  status: 'DONE', priority: 'HIGH', order: 2 },
                { title: 'Implementar pantalla de hábitos', status: 'IN_PROGRESS', priority: 'HIGH', order: 3 },
                { title: 'Integrar notificaciones locales', status: 'TODO', priority: 'MEDIUM', order: 4 },
                { title: 'Publicar en Expo Go para beta testers',  status: 'TODO',  priority: 'LOW',  order: 5 },
            ],
        },

        // estudio
        {
            task: {
                title: 'Completar curso de Rust',
                description: 'Terminar los módulos 8-12 del curso "The Rust Book" y los ejercicios de Rustlings.',
                status: 'IN_PROGRESS',
                priority: 'LOW',
                dueDate: daysFrom(45),
                order: 4,
                categoryId: cat('Estudio'),
                userId,
            },
            tags: [tag('importante')].filter(Boolean),
            subtasks: [
                { title: 'Módulo 8: Colecciones comunes', status: 'DONE', priority: 'MEDIUM', order: 1 },
                { title: 'Módulo 9: Manejo de errores', status: 'DONE', priority: 'MEDIUM', order: 2 },
                { title: 'Módulo 10: Tipos genéricos', status: 'IN_PROGRESS', priority: 'MEDIUM', order: 3 },
                { title: 'Módulo 11: Tests automatizados', status: 'TODO', priority: 'MEDIUM', order: 4 },
                { title: 'Módulo 12: Proyecto CLI minigrep', status: 'TODO', priority: 'HIGH',   order: 5 },
            ],
        },

        // personal/salud 
        {
            task: {
                title: 'Organizar vacaciones a Bariloche',
                description: 'Viaje de 7 días en julio. Confirmar alojamiento, vuelos y actividades.',
                status: 'TODO',
                priority: 'MEDIUM',
                dueDate: daysFrom(20),
                order: 5,
                categoryId: cat('Personal') ?? cat('Hogar'),
                userId,
            },
            tags: [tag('pendiente') ?? tag('en-espera')].filter(Boolean),
            subtasks: [
                { title: 'Buscar y comparar vuelos', status: 'DONE', priority: 'HIGH', order: 1 },
                { title: 'Reservar cabaña en El Tronador',  status: 'IN_PROGRESS', priority: 'HIGH', order: 2 },
                { title: 'Planificar excursiones (trekking, lago)', status: 'TODO',  priority: 'MEDIUM', order: 3 },
                { title: 'Armar lista de equipaje',  status: 'TODO', priority: 'LOW', order: 4 },
            ],
        },
        {
            task: {
                title: 'Rutina de ejercicio semanal',
                description: '3 veces por semana: lunes, miércoles y viernes.',
                status: 'IN_PROGRESS',
                priority: 'HIGH',
                dueDate: daysFrom(2),
                order: 6,
                categoryId: cat('Salud') ?? cat('Personal'),
                userId,
            },
            tags: [tag('importante')].filter(Boolean),
            subtasks: [
                { title: 'Lunes: pecho y tríceps (45 min)', status: 'DONE', priority: 'MEDIUM', order: 1 },
                { title: 'Miércoles: espalda y bíceps', status: 'DONE', priority: 'MEDIUM', order: 2 },
                { title: 'Viernes: piernas y cardio', status: 'TODO', priority: 'MEDIUM', order: 3 },
            ],
        },

        // tarea simple sin subtareas 
        {
            task: {
                title: 'Renovar OSDE plan 310',
                description: 'Llamar al 0800 antes del 30 del mes para no perder la cobertura actual.',
                status: 'TODO',
                priority: 'HIGH',
                dueDate: daysFrom(7),
                order: 7,
                categoryId: cat('Salud') ?? cat('Personal'),
                userId,
            },
            tags: [tag('urgente')].filter(Boolean),
            subtasks: [],
        },
        {
            task: {
                title: 'Leer "El proyecto fábrica de almas"',
                description: 'Lectura de ficción para el club de lectura de agosto.',
                status: 'TODO',
                priority: 'LOW',
                dueDate: daysFrom(25),
                order: 8,
                categoryId: cat('Personal') ?? cat('Estudio'),
                userId,
            },
            tags: [],
            subtasks: [],
        },
        {
            task: {
                title: 'Actualizar CV y LinkedIn',
                description: 'Agregar proyectos 2024-2025, nuevas skills y actualizar foto.',
                status: 'DONE',
                priority: 'MEDIUM',
                dueDate: daysAgo(3),
                order: 9,
                categoryId: cat('Trabajo') ?? cat('Freelance'),
                userId,
            },
            tags: [tag('revisión')].filter(Boolean),
            subtasks: [],
        },
    ]
}

export async function seedTasks(prisma, users, categories, tags) {
    console.log('Seed: tareas y subtareas...')

    let totalTasks = 0
    let totalSubtasks = 0

    for (const user of users) {
        const tasksData = getTasksData(user.id, categories, tags)

        for (const { task: taskData, tags: taskTags, subtasks } of tasksData) {
            // crea tarea principal
            const task = await prisma.task.create({
                data: {
                    ...taskData,
                    tags: taskTags.length
                        ? { create: taskTags.map(tagId => ({ tagId })) }
                        : undefined,
                },
            })
            totalTasks++

            // crea subtareas
            for (const sub of subtasks) {
                await prisma.task.create({
                    data: {
                        ...sub,
                        parentId: task.id,
                        userId: user.id,
                        categoryId: taskData.categoryId,
                    },
                })
                totalSubtasks++
            }
        }
    }

    console.log(`   ✔ ${totalTasks} tareas y ${totalSubtasks} subtareas creadas`)
}