import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notesApi } from '../../../api/notes.api.js'
import { categoriesApi } from '../../../api/categories.api.js'

export const noteKeys = {
    all: ['notes'],
    lists: () => [...noteKeys.all, 'list'],
    list: (f) => [...noteKeys.lists(), f],
    details: () => [...noteKeys.all, 'detail'],
    detail: (id) => [...noteKeys.details(), id],
}

export const categoryKeys = {
    all: ['categories'],
}

export function useNotes(filters = {}) {
    return useQuery({
        queryKey: noteKeys.list(filters),
        queryFn:  () => notesApi.getAll(filters).then((r) => r.data),
    })
}

export function useNote(id) {
    return useQuery({
        queryKey: noteKeys.detail(id),
        queryFn:  () => notesApi.getOne(id).then((r) => r.data),
        enabled:  !!id,
    })
}

export function useCategories() {
    return useQuery({
        queryKey: categoryKeys.all,
        queryFn:  () => categoriesApi.getAll().then((r) => r.data),
        staleTime: 1000 * 60 * 10, // las categorias cambian poco
    })
}

export function useCreateNote() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data) => notesApi.create(data).then((r) => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: noteKeys.lists() }),
    })
}

export function useUpdateNote() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...data }) => notesApi.update(id, data).then((r) => r.data),
        onSuccess: (updated) => {
            qc.setQueryData(noteKeys.detail(updated.id), updated)
            qc.invalidateQueries({ queryKey: noteKeys.lists() })
        },
    })
}

export function useDeleteNote() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id) => notesApi.remove(id),
        onSuccess: (_, id) => {
            qc.removeQueries({ queryKey: noteKeys.detail(id) })
            qc.invalidateQueries({ queryKey: noteKeys.lists() })
        },
    })
}

export function useCreateCategory() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data) => categoriesApi.create(data).then((r) => r.data),
        onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.all }),
    })
}