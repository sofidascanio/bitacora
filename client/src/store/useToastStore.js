import { create } from 'zustand'

let toastId = 0

export const useToastStore = create((set) => ({
    toasts: [],

    add: (message, type = 'info', duration = 3500) => {
        const id = ++toastId
        set((state) => ({
            toasts: [...state.toasts, { id, message, type }],
        }))
        setTimeout(() => {
            set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
        }, duration)
    },

    remove: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))

// helper para usar fuera de componentes
export const toast = {
    success:(msg) => useToastStore.getState().add(msg, 'success'),
    error: (msg) => useToastStore.getState().add(msg, 'error'),
    info: (msg) => useToastStore.getState().add(msg, 'info'),
}