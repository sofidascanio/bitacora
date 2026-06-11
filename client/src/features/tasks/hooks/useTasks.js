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
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: taskKeys.lists() })
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
            // cancela cualquier refetch en vuelo para evitar race condition
            qc.cancelQueries({ queryKey: taskKeys.detail(updatedTask.id) })

            // actualiza el detail, preservar subtasks que el endpoint de update no devuelve
            qc.setQueryData(taskKeys.detail(updatedTask.id), (prev) => {
                if (!prev) return updatedTask
                return Object.assign({}, prev, updatedTask, {
                    subtasks: prev.subtasks ?? [],
                })
            })

            // actualiza las listas en cache
            qc.setQueriesData({ queryKey: taskKeys.lists() }, (prev) => {
                if (!prev) return prev
                return {
                    ...prev,
                    tasks: prev.tasks?.map((t) =>
                        t.id === updatedTask.id ? { ...t, ...updatedTask } : t
                    ),
                }
            })
        },
        onError: () => toast.error('No se pudo actualizar la tarea'),
    })
}

export function useDeleteTask() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id) => tasksApi.remove(id),
        onSuccess: (_, id) => {
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