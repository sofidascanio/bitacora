function getNotesData(userId, categories, tags) {
    const cat = (name) => categories[userId]?.find(c => c.name === name)?.id ?? null
    const tag = (name) => tags[userId]?.find(t => t.name === name)?.id ?? null

    return [
        {
            note: {
                title: 'Ideas para el rediseño del dashboard',
                content: `Propuestas de mejora:
                        Reemplazar la sidebar fija por un nav colapsable para ganar espacio horizontal.
                        Agregar un widget de "Resumen de la semana" en la home con métricas clave.
                        Dark mode: revisar contraste en gráficos de líneas (actualmente muy bajo).
                        Considerar usar Recharts en lugar de Chart.js para mejor integración con React.

                        Referencias:
                        https://ui.shadcn.com/
                        Dribbble: buscar "SaaS dashboard 2024"

                        Pendiente validar con el equipo: ¿priorizar mobile-first o desktop-first en v2?`,
                userId,
                categoryId: cat('Trabajo') ?? cat('Diseño'),
            },
            tags: [tag('idea'), tag('revisión')].filter(Boolean),
        },
        {
            note: {
                title: 'Recursos de Rust que vale la pena guardar',
                content: `Libros:
                        The Rust Programming Language (gratis online): https://doc.rust-lang.org/book/
                        Rust by Example: ejercicios interactivos, muy buenos para afianzar conceptos.
                        Programming Rust (O'Reilly): más profundo, para cuando termines el libro oficial.

                        Canales de YouTube:
                        No Boilerplate, explicaciones cortas y claras.
                        Jon Gjengset, streams en profundidad (avanzado).

                        Herramientas útiles:
                        cargo-watch para recompilar en cada cambio.
                        bacon como alternativa más linda a cargo-watch.
                        tokio para async runtime.`,
                userId,
                categoryId: cat('Estudio'),
            },
            tags: [tag('referencia') ?? tag('documentación'), tag('importante')].filter(Boolean),
        },
        {
            note: {
                title: 'Presupuesto viaje a Bariloche (julio)',
                content: `Estimación de gastos:
                            Vuelos (x2): $280.000
                            Alojamiento 7 noches: $210.000
                            Comidas: $120.000
                            Excursiones: $80.000
                            Transporte local: $30.000
                            Imprevistos (10%): $72.000
                            Total: $792.000

                            Hoteles relevados:
                            1. Cabaña El Tronador, 4.8 estrellas en Booking.
                            2. Apart Nahuel Huapi, más económico, buena ubicación.

                            Check-in / Check-out:
                            Entrada: sábado 12/07
                            Salida: sábado 19/07`,
                userId,
                categoryId: cat('Personal') ?? cat('Hogar'),
            },
            tags: [tag('pendiente') ?? tag('en-espera')].filter(Boolean),
        },
        {
            note: {
                title: 'Snippets útiles de TypeScript',
                content: `Type guards:
                            function isString(val: unknown): val is string {
                            return typeof val === 'string'
                            }

                            Utility types más usados:
                            Partial<T>: hace todas las propiedades opcionales. type Partial<T> = { [K in keyof T]?: T[K] }
                            Pick<T, K>: selecciona un subconjunto de propiedades. type Pick<T, K extends keyof T> = { [P in K]: T[P] }
                            Omit<T, K>: excluye propiedades. type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

                            Inferir el tipo de retorno de una función:
                            type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : never`,
                userId,
                categoryId: cat('Trabajo') ?? cat('Estudio'),
            },
            tags: [tag('documentación') ?? tag('referencia')].filter(Boolean),
        },
        {
            note: {
                title: 'Recetas saludables para la semana',
                content: `  Lunes - Pollo con verduras al horno:
                                Pechuga de pollo, pimiento, zapallito, cebolla, aceite de oliva, ajo, pimentón.
                                200°C por 35 minutos.

                            Miércoles - Bowl de quinoa:
                                Quinoa cocida, garbanzos, tomate cherry, pepino, hummus, limón.
                                Preparar la quinoa en cantidad para toda la semana.

                            Viernes - Salmón al limón:
                                Filet de salmón, limón, eneldo, espárragos.
                                Sartén a fuego medio-alto, 4 minutos por lado.

                            Snacks:
                                Mix de nueces y almendras (un puñado por día).
                                Yogur griego con berries.`,
                userId,
                categoryId: cat('Salud') ?? cat('Personal') ?? cat('Hogar'),
            },
            tags: [],
        },
        {
            note: {
                title: 'Checklist onboarding nuevo empleado',
                content: `Día 1:
                            Configurar cuenta de email corporativo.
                            Acceso a Slack y canales relevantes (#general, #dev, #soporte).
                            Tour por la oficina y presentación al equipo.
                            Entrega de equipo (notebook, auriculares).

                            Primera semana:
                            Reunión 1:1 con Tech Lead.
                            Acceso a repositorios de GitHub.
                            Setup del entorno local (README en el repo).
                            Revisar documentación de arquitectura.
                            Primera task "good first issue" asignada.

                            Primer mes:
                            Completar curso interno de procesos.
                            Code review de al menos 3 PRs ajenos.
                            Presentar un mini-tech talk al equipo.`,
                userId,
                categoryId: cat('Trabajo') ?? cat('Freelance'),
            },
            tags: [tag('documentación'), tag('reunión')].filter(Boolean),
        },
    ]
}

export async function seedNotes(prisma, users, categories, tags) {
    console.log('Seed: notas...')

    let total = 0

    for (const user of users) {
        const notesData = getNotesData(user.id, categories, tags)

        for (const { note: noteData, tags: noteTags } of notesData) {
            await prisma.note.create({
                data: {
                    ...noteData,
                    tags: noteTags.length
                        ? { create: noteTags.map(tagId => ({ tagId })) }
                        : undefined,
                },
            })
            total++
        }
    }

    console.log(`   ✔ ${total} notas creadas`)
}