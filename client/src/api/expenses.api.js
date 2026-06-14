import api from './axios.js'

export const expensesApi = {
    // expenses
    getAll: (params) => api.get('/expenses', { params }),
    getOne: (id) => api.get(`/expenses/${id}`),
    create: (data) => api.post('/expenses', data),
    update: (id, data) => api.patch(`/expenses/${id}`, data),
    remove: (id) => api.delete(`/expenses/${id}`),
    getStats: (params) => api.get('/expenses/stats', { params }),

    // categories
    getCategories: () => api.get('/expenses/categories'),
    createCategory: (data) => api.post('/expenses/categories', data),
    updateCategory: (id, data) => api.patch(`/expenses/categories/${id}`, data),
    deleteCategory: (id) => api.delete(`/expenses/categories/${id}`),

    // budgets
    getBudgets: (params) => api.get('/expenses/budgets', { params }),
    upsertBudget: (data) => api.post('/expenses/budgets', data),
    deleteBudget: (id) => api.delete(`/expenses/budgets/${id}`),
}