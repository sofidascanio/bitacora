import api from './axios.js'

export const tasksApi = {
    getAll: (params) => api.get('/tasks', { params }),
    getOne: (id) => api.get(`/tasks/${id}`),
    create: (data) => api.post('/tasks', data),
    update: (id, data) => api.patch(`/tasks/${id}`, data),
    remove: (id) => api.delete(`/tasks/${id}`),
    reorder: (id, data) => api.patch(`/tasks/${id}/order`, data),
    calendar: (params) => api.get('/tasks/calendar', { params }),
}