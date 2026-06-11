import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
    persist(
        (set) => ({
        user:  null,
        token: null,

        // derivado, no se persiste por separado
        get isAuthenticated() {
            return !!this.token
        },

        setAuth: (user, token) => {
            localStorage.setItem('token', token)
            set({ user, token })
        },

        logout: () => {
            localStorage.removeItem('token')
            set({ user: null, token: null })
        },

        updateUser: (user) =>
            set((state) => ({ user: { ...state.user, ...user } })),
        }),
        {
            name: 'auth-storage',
            // persiste user y token
            partialize: (state) => ({ user: state.user, token: state.token }),
        }
    )
)