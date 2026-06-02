import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tasksApi } from '../../../api/tasks.api.js'

// keys centralizadas, para evitar strings duplicados en la app
export const taskKeys = {
    all: ['tasks'],
    lists: () => [...taskKeys.all, 'list'],
    list: (filters) => [...taskKeys.lists(), filters],
    details: () => [...taskKeys.all, 'detail'],
    detail: (id) => [...taskKeys.details(), id],
}

export function useTasks(filters = {}) {
    return useQuery({
        queryKey: taskKeys.list(filters),
        queryFn: () => tasksApi.getAll(filters).then((r) => r.data),
    })
}

export function useTask(id) {
    return useQuery({
        queryKey: taskKeys.detail(id),
        queryFn: () => tasksApi.getOne(id).then((r) => r.data),
        enabled: !!id,
    })
}

export function useCreateTask() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data) => tasksApi.create(data).then((r) => r.data),
        onSuccess: () => {
            // invalida todas las listas para que se repita el fetch
            qc.invalidateQueries({ queryKey: taskKeys.lists() })
        },
    })
}

export function useUpdateTask() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...data }) => tasksApi.update(id, data).then((r) => r.data),
        onSuccess: (updatedTask) => {
            // actualiza el detalle en cache sin repetir el fetch
            qc.setQueryData(taskKeys.detail(updatedTask.id), updatedTask)
            qc.invalidateQueries({ queryKey: taskKeys.lists() })
        },
    })
}

export function useDeleteTask() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id) => tasksApi.remove(id),
        onSuccess: (_, id) => {
            qc.removeQueries({ queryKey: taskKeys.detail(id) })
            qc.invalidateQueries({ queryKey: taskKeys.lists() })
        },
    })
}

export function useReorderTask() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...data }) => tasksApi.reorder(id, data).then((r) => r.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: taskKeys.lists() })
        },
    })
}