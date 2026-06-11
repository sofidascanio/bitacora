import { useState, useCallback } from 'react'
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    closestCorners,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable'
import { DroppableColumn } from './DroppableColumn.jsx'
import { TaskCard } from '../TaskCard/TaskCard.jsx'
import { useUpdateTask, useReorderTask } from '../../hooks/useTasks.js'
import styles from './TaskBoard.module.css'

const COLUMNS = [
    { key: 'TODO', label: 'Pendiente' },
    { key: 'IN_PROGRESS', label: 'En Progreso' },
    { key: 'DONE', label: 'Terminadas' },
]

export function TaskBoard({ tasks, onSelectTask }) {
    // estado local de las tareas para actualizaciones optimistas
    const [localTasks, setLocalTasks] = useState(tasks)
    const [activeTask,  setActiveTask] = useState(null)

    const { mutate: updateTask  } = useUpdateTask()
    const { mutate: reorderTask } = useReorderTask()

    // sincroniza cuando cambia las tasks del servidor (despues de invalidacion de React Query)
    if (JSON.stringify(tasks.map(t => t.id + t.status + t.order + t.priority + t.title + t.updatedAt)) !==
        JSON.stringify(localTasks.map(t => t.id + t.status + t.order + t.priority + t.title + t.updatedAt))) {
        setLocalTasks(tasks)
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            // mover 8px antes de iniciar drag, para evitar conflictos con clicks normales
            activationConstraint: { distance: 8 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function getTasksByStatus(status) {
        return localTasks
            .filter((t) => t.status === status)
            .sort((a, b) => a.order - b.order)
    }

    function findTaskColumn(taskId) {
        return localTasks.find((t) => t.id === taskId)?.status ?? null
    }

    // cuando empieza a arrastrar
    const handleDragStart = useCallback((event) => {
        const task = localTasks.find((t) => t.id === event.active.id)
        setActiveTask(task ?? null)
    }, [localTasks])

    // mientras arrastra (para preview en tiempo real)
    const handleDragOver = useCallback((event) => {
        const { active, over } = event
        if (!over) return

        const activeId = active.id
        const overId   = over.id

        if (activeId === overId) return

        const activeColumn = findTaskColumn(activeId)

        // determina la columna destino, over puede ser una columna (droppable) o una tarea (sortable)
        const overColumn = COLUMNS.find((c) => c.key === overId)?.key
        ?? findTaskColumn(overId)

        if (!activeColumn || !overColumn) return

        // movimiento entre columnas
        if (activeColumn !== overColumn) {
        setLocalTasks((prev) => {
            const updated = prev.map((t) =>
                t.id === activeId ? { ...t, status: overColumn } : t
            )
            return updated
        })
        }
    }, [localTasks])

    // cuando suelta
    const handleDragEnd = useCallback((event) => {
        const { active, over } = event
        setActiveTask(null)

        if (!over) return

        const activeId = active.id
        const overId   = over.id

        const task = localTasks.find((t) => t.id === activeId)
        if (!task) return

        // determina columna final
        const finalStatus = COLUMNS.find((c) => c.key === overId)?.key
            ?? findTaskColumn(overId)
            ?? task.status

        // calcula nuevo orden dentro de la columna
        const columnTasks = getTasksByStatus(finalStatus)
        const overIndex = columnTasks.findIndex((t) => t.id === overId)
        const activeIndex = columnTasks.findIndex((t) => t.id === activeId)

        let newOrder = task.order

        if (overIndex !== -1 && activeIndex !== -1) {
            // reordena dentro de la misma columna
            const reordered = arrayMove(columnTasks, activeIndex, overIndex)
            newOrder = overIndex
            // actualiza todos los ordenes localmente
            setLocalTasks((prev) => {
                const others = prev.filter((t) => t.status !== finalStatus)
                const reorderedWithOrder = reordered.map((t, i) => ({ ...t, order: i }))
                return [...others, ...reorderedWithOrder]
            })
        } else if (finalStatus !== task.status) {
            // movimiento entre columnas: va al final
            const destTasks = getTasksByStatus(finalStatus)
            newOrder = destTasks.length
        }

        // sincroniza con el servidor
        if (finalStatus !== task.status || newOrder !== task.order) {
            reorderTask({ id: activeId, status: finalStatus, order: newOrder })

            // si cambio de columna, tambien actualiza el status
            if (finalStatus !== task.status) {
                updateTask({ id: activeId, status: finalStatus })
            }
        }
    }, [localTasks, reorderTask, updateTask])

    const handleDragCancel = useCallback(() => {
        setActiveTask(null)
        setLocalTasks(tasks) // revierte al estado del servidor
    }, [tasks])

    return (
        <DndContext sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}>
            <div className={styles.board}>
                {COLUMNS.map((column) => (
                <DroppableColumn key={column.key}
                                column={column}
                                tasks={getTasksByStatus(column.key)}
                                onSelect={onSelectTask}/>
                ))}
            </div>

            {/* DragOverlay: la "sombra" que sigue al cursor mientras arrastra */}
            <DragOverlay>
                {activeTask ? (
                    <div style={{ transform: 'rotate(2deg)', opacity: 0.95 }}>
                        <TaskCard task={activeTask} onEdit={() => {}} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}