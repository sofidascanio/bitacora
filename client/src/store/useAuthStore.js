import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
    persist(
        (set) => ({
            user:  null,
            token: null,
            isAuthenticated: false,

            setAuth: (user, token) => {
                localStorage.setItem('token', token)
                set({ user, token, isAuthenticated: true })
            },

            logout: () => {
                localStorage.removeItem('token')
                set({ user: null, token: null, isAuthenticated: false })
            },

            updateUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),
        }),
        {
            name: 'auth-storage',
            // solo persiste user y isAuthenticated, no el token (ya esta en localStorage)
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
)