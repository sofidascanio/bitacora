import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tasksApi } from '../../../api/tasks.api.js'
import { toast } from '../../../store/useToastStore.js'

// keys centralizadas, para evitar strings duplicados en la app
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

function invalidateTaskQueries(qc) {
    qc.invalidateQueries({ queryKey: taskKeys.lists() })
    qc.invalidateQueries({ queryKey: taskKeys.calendar() })
}

export function useCreateTask() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data) => tasksApi.create(data).then((r) => r.data),
        onSuccess: (newTask) => {
            // si es una subtarea, refresca el detail del padre para que aparezca en el panel
            if (newTask.parentId) {
                qc.invalidateQueries({ queryKey: taskKeys.detail(newTask.parentId) })
                toast.success('Tarea creada.')
            }
            invalidateTaskQueries(qc)
        },
        onError: () => toast.error('No se pudo crear la tarea')
    })
}

export function useUpdateTask() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...data }) => tasksApi.update(id, data).then((r) => r.data),
        onSuccess: (updatedTask) => {
            qc.setQueryData(taskKeys.detail(updatedTask.id), updatedTask)
            // si es una subtarea, sincroniza también el detail del padre
            if (updatedTask.parentId) {
                qc.invalidateQueries({ queryKey: taskKeys.detail(updatedTask.parentId) })
            }
            invalidateTaskQueries(qc)
        },
    })
}

export function useDeleteTask() {
    const qc = useQueryClient()
    return useMutation({
        // .then(r => r.data) para recibir la task eliminada y leer su parentId
        mutationFn: (id) => tasksApi.remove(id).then((r) => r.data),
        onSuccess: (deletedTask, id) => {
            qc.removeQueries({ queryKey: taskKeys.detail(id) })
            // si era una subtarea, refresca el detail del padre para que desaparezca
            if (deletedTask?.parentId) {
                qc.invalidateQueries({ queryKey: taskKeys.detail(deletedTask.parentId) })
                toast.success('Tarea borrada.')
            }
            invalidateTaskQueries(qc)
        },
        onError: () => toast.error('No se pudo borrar la tarea.'),
    })
}

export function useReorderTask() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...data }) => tasksApi.reorder(id, data).then((r) => r.data),
        onSuccess: () => invalidateTaskQueries(qc),
    })
}