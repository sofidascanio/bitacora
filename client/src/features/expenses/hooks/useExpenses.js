import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { expensesApi } from '../../../api/expenses.api.js'
import { toast } from '../../../store/useToastStore.js'

export const expenseKeys = {
    all: ['expenses'],
    lists: () => [...expenseKeys.all, 'list'],
    list: (f) => [...expenseKeys.lists(), f],
    detail: (id) => [...expenseKeys.all, 'detail', id],
    stats: (p) => [...expenseKeys.all, 'stats', p],
    categories: () => [...expenseKeys.all, 'categories'],
    budgets: (p) => [...expenseKeys.all, 'budgets', p],
}

export function useExpenses(filters = {}) {
    return useQuery({
        queryKey: expenseKeys.list(filters),
        queryFn: () => expensesApi.getAll(filters).then((r) => r.data),
    })
}

export function useExpenseStats(params) {
    return useQuery({
        queryKey: expenseKeys.stats(params),
        queryFn: () => expensesApi.getStats(params).then((r) => r.data),
        enabled: !!params.month && !!params.year,
    })
}

export function useExpenseCategories() {
    return useQuery({
        queryKey: expenseKeys.categories(),
        queryFn: () => expensesApi.getCategories().then((r) => r.data),
        staleTime: 1000 * 60 * 10,
    })
}

export function useBudgets(params) {
    return useQuery({
        queryKey: expenseKeys.budgets(params),
        queryFn: () => expensesApi.getBudgets(params).then((r) => r.data),
        enabled: !!params.month && !!params.year,
    })
}

export function useCreateExpense() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data) => expensesApi.create(data).then((r) => r.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: expenseKeys.lists() })
            qc.invalidateQueries({ queryKey: expenseKeys.all })
            toast.success('Se agrego el gasto.')
        },
        onError: () => toast.error('No se pudo agregar el gasto.'),
    })
}

export function useUpdateExpense() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...data }) => expensesApi.update(id, data).then((r) => r.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: expenseKeys.lists() })
            qc.invalidateQueries({ queryKey: expenseKeys.all })
            toast.success('Se actualizo el gasto.')
        },
        onError: () => toast.error('No se pudo actualizar el gasto.'),
    })
}

export function useDeleteExpense() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id) => expensesApi.remove(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: expenseKeys.lists() })
            qc.invalidateQueries({ queryKey: expenseKeys.all })
            toast.success('Se borro el gasto.')
        },
        onError: () => toast.error('No se pudo borrar el gasto.'),
    })
}

export function useCreateExpenseCategory() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data) => expensesApi.createCategory(data).then((r) => r.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: expenseKeys.categories() })
            toast.success('Se creo la categoría.')
        },
    })
}

export function useUpsertBudget() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data) => expensesApi.upsertBudget(data).then((r) => r.data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: expenseKeys.all })
            toast.success('Se guardo el presupuesto.')
        },
    })
}

export function useDeleteBudget() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id) => expensesApi.deleteBudget(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: expenseKeys.all })
            toast.success('Se borró el presupuesto.')
        },
        onError: () => toast.error('No se pudo borrar el presupuesto.'),
    })
}