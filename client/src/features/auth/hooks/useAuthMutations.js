import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../../api/auth.api.js'
import { useAuthStore } from '../../../store/useAuthStore.js'

export function useLogin() {
    const { setAuth } = useAuthStore()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: ({ data }) => {
            setAuth(data.user, data.token)
            navigate('/dashboard')
        },
    })
}

export function useRegister() {
    const { setAuth } = useAuthStore()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: authApi.register,
        onSuccess: ({ data }) => {
            setAuth(data.user, data.token)
            navigate('/dashboard')
        },
    })
}