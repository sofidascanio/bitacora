import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    headers: { 'Content-Type': 'application/json' },
})

// request: adjunta el jwt, si existe
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// response: maneja 401 globalmente
api.interceptors.response.use(
    (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('token')
                // redirige sin depender del router
                if (!window.location.pathname.startsWith('/login')) {
                    window.location.href = '/login'
                }
            }
            return Promise.reject(error)
        }
)

export default api