import api from './axios.js'

export const notesApi = {
    getAll: (params) => api.get('/notes', { params }),
    getOne: (id) => api.get(`/notes/${id}`),
    create: (data) => api.post('/notes', data),
    update: (id, data) => api.patch(`/notes/${id}`, data),
    remove: (id) => api.delete(`/notes/${id}`),
}