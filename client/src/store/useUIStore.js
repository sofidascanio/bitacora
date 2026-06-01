import { create } from 'zustand'

export const useUIStore = create((set) => ({
    sidebarOpen: true,
    theme: localStorage.getItem('theme') || 'light',

    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

    setTheme: (theme) => {
        localStorage.setItem('theme', theme)
        document.documentElement.classList.toggle('dark', theme === 'dark')
        set({ theme })
    },

    toggleTheme: () => {
        const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark'
        localStorage.setItem('theme', next)
        document.documentElement.classList.toggle('dark', next === 'dark')
        set({ theme: next })
    },
}))