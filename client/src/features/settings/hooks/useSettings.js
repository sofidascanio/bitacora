import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriesApi } from '../../../api/categories.api.js'
import { tagsApi } from '../../../api/tags.api.js'
import { toast } from '../../../store/useToastStore.js'

export const settingsKeys = {
    categories: ['categories'],
    tags: ['tags'],
}

// categorias
export function useCategories() {
    return useQuery({
        queryKey: settingsKeys.categories,
        queryFn: () => categoriesApi.getAll().then((r) => r.data),
        staleTime: 1000 * 60 * 10,
    })
}

export function useCreateCategory() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data) => categoriesApi.create(data).then((r) => r.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: settingsKeys.categories })
            toast.success('Se creo la categoría.')
        },
        onError: (err) => toast.error(err.response?.data?.message || 'No se pudo crear la categoría.'),
    })
}

export function useUpdateCategory() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...data }) => categoriesApi.update(id, data).then((r) => r.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: settingsKeys.categories })
            toast.success('Se actualizo la categoría.')
        },
    })
}

export function useDeleteCategory() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id) => categoriesApi.remove(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: settingsKeys.categories })
            toast.success('Se borro la categoría.')
        },
        onError: () => toast.error('No se pudo borrar la categoría.'),
    })
}

// tags 
export function useTags() {
    return useQuery({
        queryKey: settingsKeys.tags,
        queryFn: () => tagsApi.getAll().then((r) => r.data),
        staleTime: 1000 * 60 * 10,
    })
}

export function useCreateTag() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data) => tagsApi.create(data).then((r) => r.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: settingsKeys.tags })
            toast.success('Se creo la etiqueta.')
        },
        onError: (err) => toast.error(err.response?.data?.message || 'No se pudo crear la etiqueta.'),
    })
}

export function useUpdateTag() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...data }) => tagsApi.update(id, data).then((r) => r.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: settingsKeys.tags })
            toast.success('Se actualizo la etiqueta.')
        },
    })
}

export function useDeleteTag() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id) => tagsApi.remove(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: settingsKeys.tags })
            toast.success('Se borro la etiqueta.')
        },
        onError: () => toast.error('No se pudo borrar la etiqueta.'),
    })
}