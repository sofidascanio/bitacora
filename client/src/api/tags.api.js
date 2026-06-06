import api from './axios.js'

export const tagsApi = {
  getAll: () => api.get('/tags'),
  create: (data) => api.post('/tags', data),
  update: (id, data) => api.patch(`/tags/${id}`, data),
  remove: (id) => api.delete(`/tags/${id}`),
}