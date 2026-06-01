import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '../features/auth/hooks/useAuthMutations.js'
import { Input } from '../components/common/Input/Input.jsx'
import { Button } from '../components/common/Button/Button.jsx'
import styles from './AuthPage.module.css'

export function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' })
    const { mutate: login, isPending, error } = useLogin()

    const apiError = error?.response?.data?.message

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        login(form)
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <header className={styles.header}>
                    <span className={styles.eyebrow}> Bienvenido a Bitacora</span>
                    <h1 className={styles.title}>Iniciar Sesión </h1>
                </header>

                {apiError && <div className={styles.alert}>{apiError}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input id="email"
                        name="email"
                        type="email"
                        label="Email"
                        placeholder="nombre@ejemplo.com"
                        value={form.email}
                        onChange={handleChange}
                        required/>
                    <Input id="password"
                        name="password"
                        type="password"
                        label="Contraseña"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        required/>
                    <Button type="submit" loading={isPending} size="lg" className={styles.submitBtn}>
                        Iniciar Sesión
                    </Button>
                </form>

                <p className={styles.footer}>
                    No tenes cuenta?{' '}
                    <Link to="/register" className={styles.link}>Crear Cuenta</Link>
                </p>
            </div>
        </div>
    )
}