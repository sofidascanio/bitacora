import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tasksApi } from '../../../api/tasks.api.js'
import { toast } from '../../../store/useToastStore.js'

export const taskKeys = {
    all: ['tasks'],
    lists: () => [...taskKeys.all, 'list'],
    list: (filters) => [...taskKeys.lists(), filters],
    details: () => [...taskKeys.all, 'detail'],
    detail: (id) => [...taskKeys.details(), id],
    calendar: () => [...taskKeys.all, 'calendar'],
}

export function useTasks(filters = {}) {
    return useQuery({
        queryKey: taskKeys.list(filters),
        queryFn:  () => tasksApi.getAll(filters).then((r) => r.data),
    })
}

export function useTask(id) {
    return useQuery({
        queryKey: taskKeys.detail(id),
        queryFn:  () => tasksApi.getOne(id).then((r) => r.data),
        enabled:  !!id,
    })
}

export function useCreateTask() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data) => tasksApi.create(data).then((r) => r.data),
        onSuccess: (newTask) => {
            // si es una subtarea, actualiza el detail del padre
            if (newTask.parentId) {
                qc.setQueryData(taskKeys.detail(newTask.parentId), (prev) => {
                    if (!prev) return prev
                    return {
                        ...prev,
                        subtasks: [...(prev.subtasks ?? []), newTask],
                        _count: {
                            ...prev._count,
                            subtasks: (prev._count?.subtasks ?? 0) + 1,
                        },
                    }
                })
            }

            qc.invalidateQueries({ queryKey: taskKeys.lists() })
            qc.invalidateQueries({ queryKey: taskKeys.calendar() })
            toast.success('Tarea creada.')
        },
        onError: () => toast.error('No se pudo crear la tarea'),
    })
}

export function useUpdateTask() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...data }) => tasksApi.update(id, data).then((r) => r.data),
        onSuccess: (updatedTask) => {
            // cancela cualquier refetch para evitar race condition
            qc.cancelQueries({ queryKey: taskKeys.detail(updatedTask.id) })

            // actualiza el detail, mantiene subtasks que el endpoint de update no devuelve
            qc.setQueryData(taskKeys.detail(updatedTask.id), (prev) => {
                if (!prev) return updatedTask
                return Object.assign({}, prev, updatedTask, {
                    subtasks: prev.subtasks ?? [],
                })
            })

            // si es una subtarea, actualiza su estado dentro del padre
            qc.getQueryCache().getAll().forEach((query) => {
                const key = query.queryKey
                if (
                    Array.isArray(key) &&
                    key[0] === 'tasks' &&
                    key[1] === 'detail'
                ) {
                    const data = query.state.data
                    if (!data?.subtasks) return
                    const isSubtask = data.subtasks.some((s) => s.id === updatedTask.id)
                    if (!isSubtask) return

                    qc.setQueryData(key, {
                        ...data,
                        subtasks: data.subtasks.map((s) =>
                            s.id === updatedTask.id ? { ...s, ...updatedTask } : s
                        ),
                    })
                }
            })

            // actualiza todas las listas en cach
            qc.setQueriesData({ queryKey: taskKeys.lists() }, (prev) => {
                if (!prev) return prev
                return {
                    ...prev,
                    tasks: prev.tasks?.map((t) =>
                        t.id === updatedTask.id ? { ...t, ...updatedTask } : t
                    ),
                }
            })

            qc.invalidateQueries({ queryKey: taskKeys.calendar() })
        },
        onError: () => toast.error('No se pudo actualizar la tarea'),
    })
}

export function useDeleteTask() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id) => tasksApi.remove(id),
        onSuccess: (_, id) => {
            // busca si esta tarea era subtarea de algun padre en cache y la quita de su lista de subtasks
            qc.getQueryCache().getAll().forEach((query) => {
                const key = query.queryKey
                if (
                    Array.isArray(key) &&
                    key[0] === 'tasks' &&
                    key[1] === 'detail'
                ) {
                    const data = query.state.data
                    if (!data?.subtasks) return
                    const isSubtask = data.subtasks.some((s) => s.id === id)
                    if (!isSubtask) return

                    qc.setQueryData(key, {
                        ...data,
                        subtasks: data.subtasks.filter((s) => s.id !== id),
                        _count: {
                            ...data._count,
                            subtasks: Math.max(0, (data._count?.subtasks ?? 1) - 1),
                        },
                    })
                }
            })

            qc.removeQueries({ queryKey: taskKeys.detail(id) })
            qc.setQueriesData({ queryKey: taskKeys.lists() }, (prev) => {
                if (!prev) return prev
                return {
                    ...prev,
                    tasks: prev.tasks?.filter((t) => t.id !== id),
                }
            })
            toast.success('Tarea eliminada.')
        },
        onError: () => toast.error('No se pudo borrar la tarea.'),
    })
}

export function useReorderTask() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...data }) => tasksApi.reorder(id, data).then((r) => r.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: taskKeys.lists() })
            qc.invalidateQueries({ queryKey: taskKeys.calendar() })
        },
    })
}